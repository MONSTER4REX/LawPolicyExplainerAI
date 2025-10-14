import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, AlertTriangle, CheckCircle, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './GroupDetailPage.css';

const GroupDetailPage = () => {
  const { user } = useAuth();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [groupDocuments, setGroupDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email && groupId) {
      fetchGroupData();
    }
  }, [user?.email, groupId]);

  const fetchGroupData = async () => {
    try {
      // Load groups from localStorage
      const savedGroups = localStorage.getItem('groups');
      let groups = [];
      if (savedGroups) {
        groups = JSON.parse(savedGroups);
      }

      // Find the specific group
      const foundGroup = groups.find(g => g.id === parseInt(groupId));
      if (foundGroup) {
        setGroup(foundGroup);
      }

      // Fetch all documents
        const response = await fetch(API_ENDPOINTS.DOCUMENTS(user.email));
      const data = await response.json();
      if (response.ok) {
        // Get group-document relationships from localStorage
        const groupDocs = JSON.parse(localStorage.getItem('groupDocuments') || '{}');
        const docIdsInGroup = groupDocs[parseInt(groupId)] || [];
        
        // Filter documents that belong to this group
        const filteredDocs = data.documents.filter(doc => docIdsInGroup.includes(doc.id));
        setGroupDocuments(filteredDocs);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (risks) => {
    if (!risks || risks.trim() === '') return 'none';
    const riskText = risks.toLowerCase();
    if (riskText.includes('high') || riskText.includes('critical')) return 'high';
    if (riskText.includes('medium') || riskText.includes('moderate')) return 'medium';
    if (riskText.includes('low') || riskText.includes('minor')) return 'low';
    return 'low';
  };

  if (loading) {
    return (
      <div className="group-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-detail-page">
        <div className="error-state">
          <FileText size={64} className="error-icon" />
          <h3>Group not found</h3>
          <p>The group you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group-detail-page">
      <div className="page-header">
        {/* Navigation handled by global Navigation component */}
      </div>

      <div className="group-header">
        <div className="group-info">
          <div className={`group-icon ${group.color}`}>
            <FileText size={32} />
          </div>
          <div className="group-meta">
            <h1 className="group-name">{group.name}</h1>
            <p className="group-description">{group.description}</p>
            <div className="group-stats">
              <div className="stat">
                <FileText size={16} />
                <span>{groupDocuments.length} documents</span>
              </div>
              <div className="stat">
                <Calendar size={16} />
                <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="documents-section">
        <h2>Documents in this Group</h2>
        
        {groupDocuments.length > 0 ? (
          <div className="documents-grid">
            {groupDocuments.map(doc => {
              const riskLevel = getRiskLevel(doc.risks);
              return (
                <div key={doc.id} className="document-card">
                  <div className="document-header">
                    <div className="document-icon">
                      <FileText size={24} />
                    </div>
                    <div className="document-meta">
                      <div className="document-date">
                        <Calendar size={14} />
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className={`risk-badge ${riskLevel}`}>
                        {riskLevel === 'none' ? (
                          <><CheckCircle size={14} /> No Risks</>
                        ) : riskLevel === 'low' ? (
                          <><AlertTriangle size={14} /> Low Risk</>
                        ) : riskLevel === 'medium' ? (
                          <><AlertTriangle size={14} /> Medium Risk</>
                        ) : (
                          <><AlertTriangle size={14} /> High Risk</>
                        )}
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
                          {doc.risks.split('\n').slice(0, 2).map((risk, index) => (
                            risk.trim() && (
                              <div key={index} className="risk-item">
                                <AlertTriangle size={12} />
                                <span>{risk.trim()}</span>
                              </div>
                            )
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
                      onClick={() => {
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
                      }}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={64} className="empty-icon" />
            <h3>No documents in this group</h3>
            <p>Add some documents to this group to get started.</p>
            <button 
              className="add-docs-btn"
              onClick={() => navigate('/groups')}
            >
              Add Documents
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;
