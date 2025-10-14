import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Upload, FileText, Folder, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SettingsModal from '../components/SettingsModal';
import { API_ENDPOINTS } from '../config/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [aiQueryCount, setAiQueryCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);

  const fetchRecentDocuments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DOCUMENTS(user.email));
      const data = await response.json();
      if (response.ok) {
        setRecentDocuments(data.documents.slice(0, 6)); // Show only 6 most recent
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchRecentDocuments();
      fetchAiQueryCount();
      fetchGroupsCount();
    }
  }, [user?.email]);

  useEffect(() => {
    // Listen for AI query count updates
    const handleAiQueryCountUpdate = (event) => {
      setAiQueryCount(event.detail);
    };

    // Listen for groups count updates
    const handleGroupsCountUpdate = (event) => {
      setGroupsCount(event.detail);
    };

    window.addEventListener('aiQueryCountUpdated', handleAiQueryCountUpdate);
    window.addEventListener('groupsCountUpdated', handleGroupsCountUpdate);

    return () => {
      window.removeEventListener('aiQueryCountUpdated', handleAiQueryCountUpdate);
      window.removeEventListener('groupsCountUpdated', handleGroupsCountUpdate);
    };
  }, []);

  const fetchAiQueryCount = () => {
    // Load AI query count from localStorage
    const savedCount = localStorage.getItem('aiQueryCount');
    if (savedCount) {
      setAiQueryCount(parseInt(savedCount));
    }
  };

  const fetchGroupsCount = () => {
    // Load groups count from localStorage
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      try {
        const groups = JSON.parse(savedGroups);
        setGroupsCount(groups.length);
      } catch (error) {
        console.error('Error parsing groups:', error);
        setGroupsCount(0);
      }
    } else {
      setGroupsCount(0);
    }
  };

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Analyze a new legal document',
      icon: Upload,
      link: '/upload',
      color: 'blue'
    },
    {
      title: 'View All Documents',
      description: 'Browse your document library',
      icon: FileText,
      link: '/documents',
      color: 'green'
    },
    {
      title: 'Manage Groups',
      description: 'Organize documents by category',
      icon: Folder,
      link: '/groups',
      color: 'purple'
    }
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Manage your legal documents and analysis</p>
        </div>
        <div className="header-right">
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="action-card">
              <div className={`action-icon ${action.color}`}>
                <action.icon size={24} />
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Documents */}
      <section className="recent-documents">
        <div className="section-header">
          <h2>Recent Documents</h2>
          <Link to="/documents" className="view-all-link">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading documents...</p>
          </div>
        ) : recentDocuments.length > 0 ? (
          <div className="documents-grid">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="document-header">
                  <FileText className="document-icon" />
                  <span className="document-date">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="document-title">{doc.filename}</h3>
                {doc.summary && (
                  <p className="document-summary">{doc.summary}</p>
                )}
                {doc.risks && (
                  <div className="document-risks">
                    <span className="risk-label">Risks detected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <h3>No documents yet</h3>
            <p>Upload your first legal document to get started</p>
            <Link to="/upload" className="upload-btn">
              <Upload size={20} />
              Upload Document
            </Link>
          </div>
        )}
      </section>

      {/* Stats Overview */}
      <section className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <h3>{recentDocuments.length}</h3>
            <p>Total Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Folder size={20} />
          </div>
          <div className="stat-content">
            <h3>{groupsCount}</h3>
            <p>Groups Created</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <HelpCircle size={20} />
          </div>
          <div className="stat-content">
            <h3>{aiQueryCount}</h3>
            <p>AI Queries</p>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default Dashboard;
