import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import './DocumentDetailPage.css';

const DocumentDetailPage = () => {
  const { user } = useAuth();
  const { docId } = useParams();
  const navigate = useNavigate();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email && docId) {
      fetchDocument();
    }
  }, [user?.email, docId]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DOCUMENT_BY_ID(user.email, docId));
      const data = await response.json();
      if (response.ok) {
        setDocData(data.document);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (docData) {
      // Create a downloadable text file
      const content = `Document: ${docData.filename}\n\n` +
                     `Summary:\n${docData.summary || 'No summary available'}\n\n` +
                     `Risk Analysis:\n${docData.risks || 'No risk analysis available'}\n\n` +
                     `Full Content:\n${docData.content || 'No content available'}`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${docData.filename}_analysis.txt`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="document-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="document-detail-page">
        <div className="error-state">
          <FileText size={64} className="error-icon" />
          <h3>Document not found</h3>
          <p>The document you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const getRiskLevel = (risks) => {
    if (!risks || risks.trim() === '') return 'none';
    const riskText = risks.toLowerCase();
    if (riskText.includes('high') || riskText.includes('critical')) return 'high';
    if (riskText.includes('medium') || riskText.includes('moderate')) return 'medium';
    if (riskText.includes('low') || riskText.includes('minor')) return 'low';
    return 'low';
  };

  const riskLevel = getRiskLevel(docData.risks);

  return (
    <div className="document-detail-page">
      <div className="page-header">
        <div className="header-actions">
          <button className="download-btn" onClick={handleDownload}>
            <Download size={16} />
            Download Analysis
          </button>
        </div>
      </div>

      <div className="document-container">
        <div className="document-info-card">
          <div className="document-header">
            <div className="document-icon">
              <FileText size={32} />
            </div>
            <div className="document-meta">
              <h1 className="document-title">{docData.filename}</h1>
              <div className="document-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Uploaded {new Date(docData.created_at).toLocaleDateString()}</span>
                </div>
                <div className={`risk-badge ${riskLevel}`}>
                  {riskLevel === 'none' ? (
                    <><CheckCircle size={16} /> No Risks</>
                  ) : riskLevel === 'low' ? (
                    <><AlertTriangle size={16} /> Low Risk</>
                  ) : riskLevel === 'medium' ? (
                    <><AlertTriangle size={16} /> Medium Risk</>
                  ) : (
                    <><AlertTriangle size={16} /> High Risk</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-sections">
          <div className="content-section">
            <h2>Document Summary</h2>
            <div className="content-box">
              {docData.summary ? (
                <p>{docData.summary}</p>
              ) : (
                <p className="no-content">No summary available for this document.</p>
              )}
            </div>
          </div>

          <div className="content-section">
            <h2>Risk Analysis</h2>
            <div className="content-box">
              {docData.risks ? (
                <div className="risks-content">
                  {docData.risks.split('\n').map((risk, index) => (
                    risk.trim() && (
                      <div key={index} className="risk-item">
                        <AlertTriangle size={16} />
                        <span>{risk.trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <p className="no-content">No risk analysis available for this document.</p>
              )}
            </div>
          </div>

          <div className="content-section">
            <h2>Full Document Content</h2>
            <div className="content-box full-content">
              {docData.content ? (
                <div className="document-content">
                  {docData.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="content-paragraph">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              ) : (
                <p className="no-content">No content available for this document.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
