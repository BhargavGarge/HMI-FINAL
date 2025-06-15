import pandas as pd
from sqlalchemy import text


def create_tables(engine):
    create_schema_sql = """
    CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        doc_id TEXT UNIQUE NOT NULL,
        title TEXT,
        domain TEXT,
        year INT,
        source TEXT
    );

    CREATE TABLE IF NOT EXISTS visual_entities (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id),
        fig_number TEXT,
        type TEXT,
        title TEXT,
        description TEXT,
        tags TEXT[]
    );

    CREATE TABLE IF NOT EXISTS indicators (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        unit TEXT,
        category TEXT,
        tags TEXT[]
    );

    CREATE TABLE IF NOT EXISTS observations (
        id BIGINT PRIMARY KEY,
        visual_entity_id INTEGER REFERENCES visual_entities(id),
        indicator_id INTEGER REFERENCES indicators(id),
        country TEXT,
        year INT,
        value NUMERIC,
        notes TEXT
    );
    """
    with engine.begin() as conn:
        for statement in create_schema_sql.strip().split(";"):
            if statement.strip():
                conn.execute(text(statement.strip()))
    print("✅ Tables created or verified.")

def load_csv_to_postgres(csv_path, table_name, engine):
    print(f"📥 Loading {table_name}...")
    df = pd.read_csv(csv_path)
    df.to_sql(table_name, con=engine, if_exists='append', index=False)
    print(f"✅ {table_name} loaded successfully.")

def load_all_data(engine):
    create_tables(engine)

    csv_files = {
        "documents": "documents.csv",
        "visual_entities": "visual_entities.csv",
        "indicators": "indicators.csv",
        "observations": "observations.csv"
    }

    for table, path in csv_files.items():
        load_csv_to_postgres(path, table, engine)
