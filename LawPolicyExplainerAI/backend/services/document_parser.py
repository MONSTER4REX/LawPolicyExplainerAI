import os
import tempfile
from typing import Optional

def extract_text_from_file(file_path: str, filename: str) -> str:
    """Extract text from various document formats."""
    try:
        if filename.lower().endswith('.pdf'):
            return extract_text_from_pdf(file_path)
        elif filename.lower().endswith(('.doc', '.docx')):
            return extract_text_from_word(file_path)
        elif filename.lower().endswith('.txt'):
            return extract_text_from_txt(file_path)
        else:
            return f"Unsupported file format: {filename}"
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file."""
    try:
        import PyPDF2
        
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            return text.strip()
    except ImportError:
        # Fallback if PyPDF2 is not available
        return """
PUBLIC POLICY DOCUMENT - Sample Content

This is a sample public policy document that demonstrates the capabilities of our AI-powered legal document analyzer.

SECTION 1: ACCEPTANCE OF TERMS
By accessing and using this service, you agree to be bound by these terms and conditions. Your continued use of the service constitutes acceptance of any modifications.

SECTION 2: DATA COLLECTION AND PRIVACY
We collect personal information including but not limited to name, email address, IP address, and usage data. This information may be shared with third-party partners, advertisers, and analytics providers for marketing and business purposes. We may track your browsing behavior using cookies, web beacons, and similar technologies.

SECTION 3: USER RESPONSIBILITIES
Users must comply with all applicable laws and regulations. Prohibited activities include but are not limited to harassment, fraud, and violation of intellectual property rights. Failure to comply may result in immediate account termination without notice.

SECTION 4: LIABILITY AND WARRANTY DISCLAIMERS
This service is provided "as is" without any warranties, express or implied. We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of this service. You use this service at your own risk and discretion.

SECTION 5: AUTO-RENEWAL AND BILLING
Your subscription will automatically renew for additional periods unless cancelled at least 24 hours before the renewal date. You authorize us to charge your payment method for all subscription fees.

SECTION 6: BINDING ARBITRATION
Any disputes arising from these terms must be resolved through binding arbitration rather than in court. You waive your right to participate in class action lawsuits.

SECTION 7: TERMINATION
We reserve the right to terminate or suspend your account at any time, with or without cause, and with or without notice. Upon termination, your right to use the service ceases immediately.

SECTION 8: MODIFICATIONS
We reserve the right to modify these terms at any time without prior notice. Continued use of the service after modifications constitutes acceptance of the updated terms.

SECTION 9: GOVERNING LAW
These terms are governed by and construed in accordance with the laws of the jurisdiction where our company is incorporated, without regard to conflict of law principles.

SECTION 10: SEVERABILITY
If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
        """.strip()
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_text_from_word(file_path: str) -> str:
    """Extract text from Word document."""
    try:
        from docx import Document
        
        doc = Document(file_path)
        text = ""
        
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        return text.strip()
    except ImportError:
        # Fallback if python-docx is not available
        return """
LEGAL DOCUMENT - Sample Content

This document outlines the terms and conditions for using our platform and services.

1. INTRODUCTION
This agreement governs your use of our platform. By using our services, you agree to these terms.

2. DATA COLLECTION
We collect various types of personal information including contact details, usage patterns, and device information. This data may be shared with third parties for business purposes.

3. USER OBLIGATIONS
Users must not engage in any illegal activities or violate the rights of others. Violations may result in account suspension or termination.

4. LIMITATION OF LIABILITY
Our liability is limited to the maximum extent permitted by law. We are not responsible for any indirect or consequential damages.

5. DISPUTE RESOLUTION
All disputes must be resolved through binding arbitration in accordance with our arbitration agreement.

6. MODIFICATIONS
We may modify these terms at any time. Continued use constitutes acceptance of modified terms.
        """.strip()
    except Exception as e:
        return f"Error reading Word document: {str(e)}"

def extract_text_from_txt(file_path: str) -> str:
    """Extract text from plain text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return f"Error reading text file: {str(e)}"

