"""
File parsing utilities for product specs
"""
from fastapi import UploadFile
import PyPDF2
from docx import Document
import io
import logging

logger = logging.getLogger(__name__)

async def parse_uploaded_file(file: UploadFile) -> str:
    """
    Parse uploaded file and extract text content
    Supports PDF, DOCX, and plain text
    """
    content = await file.read()
    file_extension = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    
    try:
        if file_extension == "pdf":
            return _parse_pdf(content)
        elif file_extension in ["docx", "doc"]:
            return _parse_docx(content)
        else:
            # Assume plain text
            return content.decode("utf-8")
    except Exception as e:
        logger.error(f"Error parsing file: {e}")
        raise ValueError(f"Failed to parse file: {str(e)}")

def _parse_pdf(content: bytes) -> str:
    """Parse PDF file content"""
    pdf_file = io.BytesIO(content)
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    
    return text

def _parse_docx(content: bytes) -> str:
    """Parse DOCX file content"""
    docx_file = io.BytesIO(content)
    doc = Document(docx_file)
    
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    
    return text

