from flask import Blueprint, request, jsonify
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

# Download NLTK resources (only needed first time)
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except:
    pass

# Create blueprint for PDF analysis routes
pdf_analysis_bp = Blueprint('pdf_analysis', __name__, url_prefix='/api/pdf')

# Create directories for uploaded PDFs
os.makedirs('uploads/pdfs', exist_ok=True)

# Store uploaded PDFs and their metadata (in production, use database)
pdf_database = {}

@pdf_analysis_bp.route("/upload", methods=['POST'])
def upload_pdf():
    """Upload and process PDF files"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.pdf'):
        try:
            # Generate unique ID and filename
            pdf_id = str(uuid.uuid4())
            filename = f"{pdf_id}_{file.filename}"
            filepath = os.path.join('uploads/pdfs', filename)
            
            # Save the file
            file.save(filepath)
            
            # Extract text and metadata from PDF
            from .pdf_processor import extract_pdf_content, extract_indicators, determine_category
            
            text, metadata = extract_pdf_content(filepath)
            indicators = extract_indicators(text)
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
            
        except Exception as e:
            return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500
    
    return jsonify({"error": "Invalid file format"}), 400

@pdf_analysis_bp.route("/list", methods=['GET'])
def get_pdf_list():
    """Get list of uploaded PDFs"""
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

@pdf_analysis_bp.route("/generate_story", methods=['POST'])
def generate_cross_pdf_story():
    """Generate cross-PDF analysis story"""
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
        from .story_generator import generate_story
        story = generate_story(selected_pdfs, unique_indicators, template_id)
        
        return jsonify(story), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pdf_analysis_bp.route("/delete/<pdf_id>", methods=['DELETE'])
def delete_pdf(pdf_id):
    """Delete uploaded PDF"""
    if pdf_id not in pdf_database:
        return jsonify({"error": "PDF not found"}), 404
    
    try:
        # Delete file from filesystem
        filepath = pdf_database[pdf_id]["filepath"]
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # Remove from database
        del pdf_database[pdf_id]
        
        return jsonify({"message": "PDF deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pdf_analysis_bp.route("/search", methods=['GET'])
def search_pdfs():
    """Search PDFs by filename or category"""
    query = request.args.get('q', '').lower()
    category = request.args.get('category', '').lower()
    
    filtered_pdfs = []
    
    for pdf_id, pdf_data in pdf_database.items():
        # Filter by category if specified
        if category and pdf_data["category"].lower() != category:
            continue
            
        # Filter by search query if specified
        if query and query not in pdf_data["filename"].lower():
            continue
            
        filtered_pdfs.append({
            "id": pdf_id,
            "filename": pdf_data["filename"],
            "size": pdf_data["size"],
            "upload_date": pdf_data["upload_date"],
            "indicators": pdf_data["indicators"],
            "category": pdf_data["category"]
        })
    
    return jsonify({"pdfs": filtered_pdfs}), 200
