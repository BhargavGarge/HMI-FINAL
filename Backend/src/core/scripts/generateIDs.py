import os
import requests

API_KEY = "sec_loUyJX9O4X2dJNHWgyNLjbWIiCr0qAaN"
PDF_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
pdfs = ["construction_housing.pdf", "energy_climate.pdf"]

def upload_pdf(filename):
    filepath = os.path.join(PDF_DIR, filename)
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return

    url = "https://api.chatpdf.com/v1/sources/add-file"
    headers = {'x-api-key': API_KEY}
    with open(filepath, 'rb') as f:
        files = {'file': (filename, f, 'application/pdf')}
        response = requests.post(url, headers=headers, files=files)
        if response.status_code == 200:
            source_id = response.json()['sourceId']
            print(f"✅ {filename} → {source_id}")
        else:
            print(f"❌ Failed to upload {filename}")
            print("Status:", response.status_code)
            print("Response:", response.text)

for pdf in pdfs:
    upload_pdf(pdf)
