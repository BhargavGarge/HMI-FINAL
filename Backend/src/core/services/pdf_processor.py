"""PDF processing utilities for text extraction and analysis"""
import PyPDF2
import re
from datetime import datetime

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
        "Health Expenditure": r"health spending|healthcare cost|medical expenditure",
        "Trade Balance": r"trade balance|export|import|trade surplus|trade deficit",
        "Labor Productivity": r"labor productivity|worker productivity|output per worker",
        "Housing Prices": r"housing price|real estate|property price|home price",
        "Digital Infrastructure": r"digital infrastructure|broadband|internet|digitalization",
        "Education Investment": r"education spending|school funding|university investment",
        "Social Security": r"social security|pension|welfare|social benefits",
        "Innovation Index": r"innovation|R&D|research and development|patents",
        "Environmental Quality": r"environmental quality|air quality|water quality|pollution"
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
    category_keywords = {
        "macroeconomy": ["GDP", "inflation", "economic", "fiscal", "monetary", "growth", "recession", "trade"],
        "energy": ["energy", "electricity", "power", "renewable", "grid", "infrastructure", "emission"],
        "labour": ["employment", "job", "worker", "wage", "labor", "unemployment", "productivity"],
        "gender": ["gender", "women", "equality", "female", "diversity", "inclusion", "pay gap"],
        "health": ["health", "hospital", "medical", "care", "patient", "doctor", "healthcare"],
        "finance": ["finance", "banking", "investment", "market", "financial", "capital", "credit"],
        "transport": ["transport", "mobility", "traffic", "infrastructure", "public transport", "logistics"],
        "education": ["education", "school", "university", "learning", "student", "teacher", "academic"],
        "environment": ["environment", "climate", "pollution", "sustainability", "green", "carbon"]
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

def extract_key_statistics(text):
    """Extract numerical statistics from text"""
    statistics = []
    
    # Pattern to find percentages
    percentage_pattern = r'(\d+(?:\.\d+)?)\s*%'
    percentages = re.findall(percentage_pattern, text)
    
    # Pattern to find monetary values
    money_pattern = r'€\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|trillion)?'
    monetary_values = re.findall(money_pattern, text, re.IGNORECASE)
    
    # Pattern to find years
    year_pattern = r'\b(19|20)\d{2}\b'
    years = re.findall(year_pattern, text)
    
    return {
        "percentages": percentages[:5],  # Limit to first 5
        "monetary_values": monetary_values[:5],
        "years": list(set(years))[:10]  # Unique years, limit to 10
    }
