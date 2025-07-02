# src/core/utils/load_data.py
import pandas as pd
import psycopg2
import os
from pathlib import Path

def load_csv_data():
    # Database connection
    conn = psycopg2.connect(
        dbname="test_hmi",
        user="postgres",
        password="db123",
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()

    # Drop and recreate tables to ensure consistency
    cursor.execute("DROP TABLE IF EXISTS observations CASCADE")
    cursor.execute("DROP TABLE IF EXISTS visual_entities CASCADE")
    cursor.execute("DROP TABLE IF EXISTS indicators CASCADE")
    cursor.execute("DROP TABLE IF EXISTS documents CASCADE")
    conn.commit()

    # Create table SQLs - updated structure
    create_queries = {
        "documents": """
            CREATE TABLE IF NOT EXISTS documents (
                document_id TEXT PRIMARY KEY,
                title TEXT,
                domain TEXT,
                source TEXT
            );
        """,
        "indicators": """
            CREATE TABLE IF NOT EXISTS indicators (
                indicator_id TEXT PRIMARY KEY,
                name TEXT,
                unit TEXT,
                visual_id TEXT,
                document_id TEXT
            );
        """,
        "visual_entities": """
            CREATE TABLE IF NOT EXISTS visual_entities (
                visual_id TEXT PRIMARY KEY,
                document_id TEXT,
                type TEXT,
                indicator_id TEXT
            );
        """,
        "observations": """
            CREATE TABLE IF NOT EXISTS observations (
                observation_id TEXT PRIMARY KEY,
                indicator_id TEXT,
                visual_id TEXT,
                value TEXT,
                period TEXT,
                country TEXT,
                document_id TEXT,
                unit TEXT,
                metric_type TEXT,
                name TEXT
            );
        """
    }

    for name, query in create_queries.items():
        cursor.execute(query)
    conn.commit()

    # Get the correct path to the data folder
    current_file_path = Path(__file__).resolve()
    backend_path = current_file_path.parent.parent.parent
    csv_path = backend_path / "data"
    
    if not csv_path.exists():
        raise FileNotFoundError(f"Data directory not found at: {csv_path}")

    csv_files = {
        "documents": "documents.csv",
        "indicators": "indicators.csv",
        "visual_entities": "visual-entities.csv",
        "observations": "observations.csv"
    }

    def insert_df(df, table):
        # Convert all column names to lowercase to avoid case sensitivity issues
        df.columns = df.columns.str.lower()
        
        # Handle column mapping for each table
        if table == "documents":
            # Ensure all required columns exist
            required_columns = ['document_id', 'title', 'domain', 'source']
            for col in required_columns:
                if col not in df.columns:
                    raise ValueError(f"Missing required column '{col}' in documents.csv")
            
        elif table == "observations":
            if 'year' in df.columns and 'period' not in df.columns:
                df = df.rename(columns={'year': 'period'})
        
        columns = ', '.join(df.columns)
        placeholders = ', '.join(['%s'] * len(df.columns))
        sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders}) ON CONFLICT DO NOTHING"
        
        data = [tuple(row) for row in df.values]
        cursor.executemany(sql, data)
        conn.commit()

    # Load and insert each CSV with error handling
    for table, filename in csv_files.items():
        file_path = csv_path / filename
        try:
            if not file_path.exists():
                print(f"⚠️ Warning: {filename} not found at {file_path}")
                continue
                
            df = pd.read_csv(file_path)
            
            # Clean data
            if table == "documents":
                # Check if source column exists before processing
                if 'source' in df.columns:
                    df['source'] = df['source'].astype(str).str.replace('DIW Weekly Report ', '')
                else:
                    raise ValueError("'source' column not found in documents.csv")
            
            insert_df(df, table)
            print(f"✅ Loaded {filename} into {table} table")
            
        except Exception as e:
            print(f"❌ Error loading {filename}: {str(e)}")
            conn.rollback()

    cursor.close()
    conn.close()
    print("✅ All data loaded successfully!")