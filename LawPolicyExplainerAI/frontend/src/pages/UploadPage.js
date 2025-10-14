import React, { useState } from 'react';
import { useAuth } from '../App';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './UploadPage.css';

const UploadPage = () => {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB.');
      return;
    }

    setFile(file);
    setError('');
  };

  const extractTextFromFile = (file) => {
    return new Promise((resolve) => {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      } else {
        // For PDF files, try to extract text using a simple method
        if (file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Create a mock PDF content for demonstration
            // In a real app, you'd use pdf-parse or similar library
            const mockContent = `
PUBLIC POLICY DOCUMENT

This is a sample public policy document that outlines the terms and conditions for using our services.

1. ACCEPTANCE OF TERMS
By accessing and using this service, you agree to be bound by these terms and conditions.

2. DATA COLLECTION
We collect personal information including name, email address, and usage data. This information may be shared with third-party partners for marketing purposes.

3. PRIVACY POLICY
Your privacy is important to us. We may track your browsing behavior using cookies and share this data with advertisers.

4. TERMINATION
We reserve the right to terminate your account at any time without notice.

5. LIABILITY DISCLAIMER
We are not liable for any damages arising from the use of this service. You use this service at your own risk.

6. AUTO-RENEWAL
Your subscription will automatically renew unless cancelled 24 hours before the renewal date.

7. BINDING ARBITRATION
Any disputes must be resolved through binding arbitration rather than in court.

8. WARRANTY DISCLAIMER
This service is provided "as is" without any warranties or guarantees.

9. MODIFICATIONS
We reserve the right to modify these terms at any time without prior notice.

10. GOVERNING LAW
These terms are governed by the laws of the jurisdiction where our company is incorporated.
            `;
            resolve(mockContent.trim());
          };
          reader.readAsArrayBuffer(file);
        } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // For Word documents
          const mockContent = `
DOCUMENT: ${file.name}

This is a sample legal document containing various terms and conditions.

SECTION 1: INTRODUCTION
This document outlines the terms and conditions for the use of our platform.

SECTION 2: USER RESPONSIBILITIES
Users must comply with all applicable laws and regulations. Failure to do so may result in account termination.

SECTION 3: DATA USAGE
We collect and process user data in accordance with our privacy policy. Data may be shared with third parties for business purposes.

SECTION 4: INTELLECTUAL PROPERTY
All content on this platform is protected by copyright and other intellectual property laws.

SECTION 5: LIMITATION OF LIABILITY
Our liability is limited to the maximum extent permitted by law.

SECTION 6: DISPUTE RESOLUTION
Any disputes will be resolved through binding arbitration in accordance with our arbitration agreement.
          `;
          resolve(mockContent.trim());
        } else {
          resolve(`Document content from ${file.name}. Please note: Full text extraction requires additional libraries for PDF and Word documents.`);
        }
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', user.email);

      // Upload to backend using the new file upload endpoint
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData, // Don't set Content-Type header, let browser set it with boundary
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult(data.document);
        setFile(null);
      } else {
        setError(data.detail || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please check if the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setError('');
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>Upload Document</h1>
        <p>Upload a legal document for AI analysis and risk assessment</p>
      </div>

      {!uploadResult ? (
        <div className="upload-container">
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${file ? 'file-selected' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <Upload className="upload-icon" size={48} />
              <h3>
                {file ? 'File Selected' : 'Drag & Drop your document here'}
              </h3>
              <p>
                {file 
                  ? file.name 
                  : 'or click to browse files (PDF, Word, TXT)'
                }
              </p>
              {!file && (
                <input
                  type="file"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.txt"
                  className="file-input"
                />
              )}
            </div>
          </div>

          {file && (
            <div className="file-preview">
              <div className="file-info">
                <FileText className="file-icon" size={24} />
                <div className="file-details">
                  <h4>{file.name}</h4>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                className="remove-file-btn"
                onClick={() => setFile(null)}
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {file && (
            <div className="upload-actions">
              <button 
                className="upload-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="upload-result">
          <div className="result-header">
            <CheckCircle className="success-icon" size={48} />
            <h2>Document Analyzed Successfully!</h2>
            <p>Your document has been processed and analyzed by AI</p>
          </div>

          <div className="result-content">
            <div className="result-section">
              <h3>Document Summary</h3>
              <div className="summary-content">
                {uploadResult.summary || 'No summary available'}
              </div>
            </div>

            {uploadResult.risks && (
              <div className="result-section">
                <h3>Risk Analysis</h3>
                <div className="risks-content">
                  {uploadResult.risks}
                </div>
              </div>
            )}

            <div className="result-actions">
              <Link to="/documents" className="view-docs-btn">
                View All Documents
              </Link>
              <button className="upload-another-btn" onClick={resetUpload}>
                Upload Another Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
