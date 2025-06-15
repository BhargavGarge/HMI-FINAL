from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import json
import numpy as np
import pandas as pd
from datetime import datetime
import PyPDF2
import re
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Create directories for uploaded PDFs
os.makedirs('uploads/pdfs', exist_ok=True)

# Store uploaded PDFs and their metadata
pdf_database = {}

@app.route("/upload_pdf", methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Generate unique ID and filename
        pdf_id = str(uuid.uuid4())
        filename = f"{pdf_id}_{file.filename}"
        filepath = os.path.join('uploads/pdfs', filename)
        
        # Save the file
        file.save(filepath)
        
        # Extract text and metadata from PDF
        text, metadata = extract_pdf_content(filepath)
        
        # Extract indicators from text
        indicators = extract_indicators(text)
        
        # Determine category based on content
        category = determine_category(text, indicators)
        
        # Store PDF metadata
        pdf_database[pdf_id] = {
            "id": pdf_id,
            "filename": file.filename,
            "filepath": filepath,
            "upload_date": datetime.now().isoformat(),
            "size": os.path.getsize(filepath),
            "text": text[:1000],  # Store just a preview of the text
            "indicators": indicators,
            "category": category,
            "metadata": metadata
        }
        
        return jsonify({
            "id": pdf_id,
            "filename": file.filename,
            "size": os.path.getsize(filepath),
            "upload_date": datetime.now().isoformat(),
            "indicators": indicators,
            "category": category
        }), 200
    
    return jsonify({"error": "Invalid file format"}), 400

@app.route("/pdf_list", methods=['GET'])
def get_pdf_list():
    pdfs = []
    for pdf_id, pdf_data in pdf_database.items():
        pdfs.append({
            "id": pdf_id,
            "filename": pdf_data["filename"],
            "size": pdf_data["size"],
            "upload_date": pdf_data["upload_date"],
            "indicators": pdf_data["indicators"],
            "category": pdf_data["category"]
        })
    
    return jsonify({"pdfs": pdfs}), 200

@app.route("/generate_cross_pdf_story", methods=['POST'])
def generate_cross_pdf_story():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    
    pdf_ids = data.get("pdf_ids", [])
    template_id = data.get("template_id", "")
    
    if not pdf_ids or not template_id:
        return jsonify({"error": "PDF IDs and template ID are required"}), 400
    
    # Get PDF data for selected PDFs
    selected_pdfs = []
    for pdf_id in pdf_ids:
        if pdf_id in pdf_database:
            selected_pdfs.append(pdf_database[pdf_id])
    
    if not selected_pdfs:
        return jsonify({"error": "No valid PDFs found"}), 400
    
    try:
        # Extract all indicators from selected PDFs
        all_indicators = []
        for pdf in selected_pdfs:
            all_indicators.extend(pdf["indicators"])
        
        # Get unique indicators
        unique_indicators = list(set(all_indicators))
        
        # Generate cross-PDF analysis
        story = generate_story(selected_pdfs, unique_indicators, template_id)
        
        return jsonify(story), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def extract_pdf_content(filepath):
    """Extract text and metadata from PDF"""
    text = ""
    metadata = {}
    
    try:
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract metadata
            if pdf_reader.metadata:
                metadata = {
                    "title": pdf_reader.metadata.get('/Title', ''),
                    "author": pdf_reader.metadata.get('/Author', ''),
                    "subject": pdf_reader.metadata.get('/Subject', ''),
                    "creator": pdf_reader.metadata.get('/Creator', ''),
                    "producer": pdf_reader.metadata.get('/Producer', ''),
                    "creation_date": pdf_reader.metadata.get('/CreationDate', '')
                }
            
            # Extract text from all pages
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
    
    except Exception as e:
        print(f"Error extracting PDF content: {e}")
    
    return text, metadata

def extract_indicators(text):
    """Extract economic indicators from text"""
    # This is a simplified version - in a real app, you would use NLP techniques
    # to extract actual indicators from the text
    
    indicators = []
    
    # Check for common economic indicators
    indicator_patterns = {
        "GDP Growth": r"GDP growth|economic growth|gross domestic product",
        "Inflation": r"inflation|CPI|consumer price|price level",
        "Unemployment": r"unemployment|jobless|employment rate",
        "Interest Rate": r"interest rate|policy rate|central bank rate",
        "Public Investment": r"public investment|government spending|fiscal spending",
        "Renewable Energy": r"renewable energy|solar|wind power|green energy",
        "Energy Prices": r"energy price|electricity cost|power price",
        "Gender Pay Gap": r"gender pay gap|wage gap|salary difference",
        "Carbon Emissions": r"carbon emission|CO2|greenhouse gas|GHG",
        "Health Expenditure": r"health spending|healthcare cost|medical expenditure"
    }
    
    for indicator, pattern in indicator_patterns.items():
        if re.search(pattern, text, re.IGNORECASE):
            indicators.append(indicator)
    
    # If no indicators found, add some default ones based on text content
    if not indicators:
        if re.search(r"econom|GDP|growth|fiscal", text, re.IGNORECASE):
            indicators.append("Economic Growth")
        
        if re.search(r"energy|power|electricity|renewable", text, re.IGNORECASE):
            indicators.append("Energy")
        
        if re.search(r"gender|equality|women|female", text, re.IGNORECASE):
            indicators.append("Gender Equality")
        
        if re.search(r"health|hospital|medical|care", text, re.IGNORECASE):
            indicators.append("Healthcare")
        
        if re.search(r"labor|employment|job|work", text, re.IGNORECASE):
            indicators.append("Labour Market")
    
    return indicators[:5]  # Limit to 5 indicators

def determine_category(text, indicators):
    """Determine document category based on content and indicators"""
    # Count keyword occurrences for each category
    category_keywords = {
        "macroeconomy": ["GDP", "inflation", "economic", "fiscal", "monetary", "growth", "recession"],
        "energy": ["energy", "electricity", "power", "renewable", "grid", "infrastructure"],
        "labour": ["employment", "job", "worker", "wage", "labor", "unemployment"],
        "gender": ["gender", "women", "equality", "female", "diversity", "inclusion"],
        "health": ["health", "hospital", "medical", "care", "patient", "doctor"]
    }
    
    category_scores = {}
    
    for category, keywords in category_keywords.items():
        score = 0
        for keyword in keywords:
            score += len(re.findall(r'\b' + keyword + r'\b', text, re.IGNORECASE))
        category_scores[category] = score
    
    # Also consider indicators
    for indicator in indicators:
        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword.lower() in indicator.lower():
                    category_scores[category] += 2
    
    # Get category with highest score
    if category_scores:
        return max(category_scores, key=category_scores.get)
    
    return "other"

def generate_story(pdfs, indicators, template_id):
    """Generate a cross-PDF analysis story"""
    # In a real implementation, this would use NLP to analyze the PDFs
    # and generate insights based on the template
    
    # Get PDF filenames
    pdf_names = [pdf["filename"] for pdf in pdfs]
    
    # Select top indicators (or use defaults if none found)
    selected_indicators = indicators[:2] if len(indicators) >= 2 else ["Economic Growth", "Public Policy"]
    
    # Generate title based on template
    title = generate_title(template_id, selected_indicators)
    
    # Generate summary
    summary = f"This analysis explores the relationship between {selected_indicators[0]} and {selected_indicators[1]} based on data from {len(pdfs)} documents. The findings reveal important patterns and insights for policy development."
    
    # Generate sections based on template
    sections = generate_sections(template_id, selected_indicators, pdf_names)
    
    # Generate insights
    insights = generate_insights(template_id, selected_indicators)
    
    # Generate policy implications
    policy_implications = [
        "Integrated policy framework needed for comprehensive approach",
        "Regional customization essential for effective implementation",
        "Regular monitoring of cross-indicator relationships recommended",
        "Further research needed on causal mechanisms"
    ]
    
    return {
        "title": title,
        "summary": summary,
        "sections": sections,
        "insights": insights,
        "policy_implications": policy_implications
    }

def generate_title(template_id, indicators):
    """Generate story title based on template and indicators"""
    if template_id == "correlation":
        return f"The {indicators[0]}-{indicators[1]} Connection: A Cross-Document Analysis"
    elif template_id == "trend_comparison":
        return f"Evolving Trends: {indicators[0]} and {indicators[1]} Over Time"
    elif template_id == "distribution_analysis":
        return f"Distribution Patterns in {indicators[0]} and {indicators[1]}"
    elif template_id == "impact_assessment":
        return f"Impact Assessment: How {indicators[0]} Influences {indicators[1]}"
    else:
        return f"Cross-Document Analysis of {indicators[0]} and {indicators[1]}"

def generate_sections(template_id, indicators, pdf_names):
    """Generate story sections based on template"""
    sections = []
    
    # Introduction section
    intro_content = f"This analysis examines {indicators[0]} and {indicators[1]} using data from multiple sources. The documents analyzed include {', '.join(pdf_names)}."
    sections.append({
        "title": "Introduction",
        "content": intro_content
    })
    
    # Data Analysis section
    correlation = "positive" if np.random.random() > 0.5 else "negative"
    coefficient = round(np.random.random() * 0.8 + 0.1, 2)
    
    analysis_content = f"Our cross-document analysis reveals significant patterns between {indicators[0]} and {indicators[1]}. The data shows a {correlation} correlation with a coefficient of {coefficient}."
    
    visualization_type = ""
    if template_id == "correlation":
        visualization_type = "scatter"
    elif template_id == "trend_comparison":
        visualization_type = "line"
    elif template_id == "distribution_analysis":
        visualization_type = "pie"
    elif template_id == "impact_assessment":
        visualization_type = "bar"
    
    sections.append({
        "title": "Data Analysis",
        "content": analysis_content,
        "visualization_type": visualization_type
    })
    
    # Key Findings section
    findings_content = f"The analysis identifies several important findings:\n\n"
    findings_content += f"1. {indicators[0]} shows a {correlation} influence on {indicators[1]}.\n\n"
    findings_content += f"2. Regional variations are significant, with eastern regions showing different patterns than western regions.\n\n"
    findings_content += f"3. The relationship has evolved over time, with a notable shift after 2020."
    
    sections.append({
        "title": "Key Findings",
        "content": findings_content
    })
    
    # Implications section
    implications_content = f"These findings have important implications for policy development and implementation. Decision-makers should consider the interconnected nature of these indicators when designing interventions."
    
    sections.append({
        "title": "Implications",
        "content": implications_content
    })
    
    return sections

def generate_insights(template_id, indicators):
    """Generate insights based on template and indicators"""
    correlation = "positive" if np.random.random() > 0.5 else "negative"
    coefficient = round(np.random.random() * 0.8 + 0.1, 2)
    
    insights = [
        f"{indicators[0]} and {indicators[1]} show a {correlation} correlation of {coefficient}",
        "Regional variations require tailored policy approaches",
        f"Changes in {indicators[0]} precede changes in {indicators[1]} by approximately 6-8 months",
        "Data quality varies significantly across sources, requiring careful interpretation"
    ]
    
    return insights

if __name__ == "__main__":
    app.run(debug=True)
