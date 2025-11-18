import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { FileText, Search, Filter, Calendar, AlertTriangle, CheckCircle, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { getRiskLevel } from '../utils/riskUtils';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deletingDoc, setDeletingDoc] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchDocuments();
    }
  }, [user?.email]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DOCUMENTS(user.email));
      const data = await response.json();
      if (response.ok) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setDeletingDoc(docId);
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_DOCUMENT(docId)}?email=${encodeURIComponent(user.email)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the document from the local state
        setDocuments(documents.filter(doc => doc.id !== docId));
      } else {
        const errorData = await response.json();
        alert(`Error deleting document: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting document. Please try again.');
    } finally {
      setDeletingDoc(null);
    }
  };

  const handleDownloadDocument = (doc) => {
    // Create a downloadable text file
    const content = `Document: ${doc.filename}\n\n` +
                   `Summary:\n${doc.summary || 'No summary available'}\n\n` +
                   `Risk Analysis:\n${doc.risks || 'No risk analysis available'}\n\n` +
                   `Full Content:\n${doc.content || 'No content available'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.filename}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'with-risks') return matchesSearch && doc.risks;
    if (filterStatus === 'no-risks') return matchesSearch && !doc.risks;
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="documents-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="page-header">
        <div className="header-content">
          <h1>My Documents</h1>
          <p>View and manage your uploaded legal documents</p>
        </div>
        <Link to="/upload" className="upload-btn">
          <FileText size={20} />
          Upload New Document
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-dropdown">
          <Filter className="filter-icon" size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Documents</option>
            <option value="with-risks">With Risks</option>
            <option value="no-risks">No Risks</option>
          </select>
        </div>
      </div>

      <div className="documents-grid">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => {
            const riskLevel = getRiskLevel(doc.risks);
            return (
              <div key={doc.id} className="document-card">
                <div className="document-header">
                  <div className="document-icon">
                    <FileText size={24} />
                  </div>
                  <div className="document-meta">
                    <span className="document-date">
                      <Calendar size={16} />
                      {formatDate(doc.created_at)}
                    </span>
                    <div className={`risk-badge ${riskLevel}`}>
                      {riskLevel === 'none' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                      {riskLevel === 'none' ? 'No Risks' : `${riskLevel} Risk`}
                    </div>
                  </div>
                </div>

                <div className="document-content">
                  <h3 className="document-title">{doc.filename}</h3>
                  
                  {doc.summary && (
                    <div className="document-summary">
                      <h4>Summary</h4>
                      <p>{doc.summary}</p>
                    </div>
                  )}

                  {doc.risks && (
                    <div className="document-risks">
                      <h4>Risk Analysis</h4>
                      <div className="risks-list">
                        {doc.risks.split('\n').filter(line => line.trim()).map((risk, index) => (
                          <div key={index} className="risk-item">
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="document-actions">
                  <Link to={`/documents/${doc.id}`} className="action-btn primary">
                    View Details
                  </Link>
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleDownloadDocument(doc)}
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => handleDeleteDocument(doc.id)}
                    disabled={deletingDoc === doc.id}
                  >
                    {deletingDoc === doc.id ? (
                      <div className="spinner-small"></div>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <FileText size={64} className="empty-icon" />
            <h3>No documents found</h3>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'No documents match your current filters'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link to="/upload" className="upload-btn">
                <FileText size={20} />
                Upload Document
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
