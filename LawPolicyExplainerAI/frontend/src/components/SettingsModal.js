import React, { useState } from 'react';
import { useAuth, useTheme } from '../App';
import { X, User, Moon, Sun, HelpCircle, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [helpQuery, setHelpQuery] = useState('');
  const [helpResponse, setHelpResponse] = useState('');

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    if (!helpQuery.trim()) return;

    setHelpResponse('Thinking...');
    
    try {
      // Increment AI query count
      const currentCount = parseInt(localStorage.getItem('aiQueryCount') || '0');
      const newCount = currentCount + 1;
      localStorage.setItem('aiQueryCount', newCount.toString());
      
      // Trigger a custom event to update the dashboard
      window.dispatchEvent(new CustomEvent('aiQueryCountUpdated', { detail: newCount }));
      
      // Call the backend AI service
      const response = await fetch(API_ENDPOINTS.AI_HELP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: helpQuery,
          user_email: user?.email
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHelpResponse(data.response || 'I apologize, but I couldn\'t generate a response at this time. Please try again.');
      } else {
        setHelpResponse('I\'m having trouble connecting to the AI service. Please try again later or contact support.');
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
      setHelpResponse('I\'m having trouble connecting to the AI service. Please try again later or contact support.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: theme === 'dark' ? Sun : Moon },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-left">
            <SettingsIcon size={24} />
            <h2>Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-sidebar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <h3>Profile Information</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Name</label>
                    <div className="info-value">{user?.name || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <div className="info-value">{user?.email || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label>Role</label>
                    <div className="info-value capitalize">{user?.role || 'Not specified'}</div>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <div className="info-value">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="appearance-section">
                <h3>Appearance</h3>
                <div className="theme-settings">
                  <div className="theme-option">
                    <div className="theme-info">
                      <h4>Theme</h4>
                      <p>Choose between light and dark mode</p>
                    </div>
                    <button className="theme-toggle" onClick={toggleTheme}>
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="help-section">
                <h3>Help & Support</h3>
                <div className="help-content">
                  <div className="help-ai">
                    <h4>Ask AI Assistant</h4>
                    <p>Get instant help with your legal document analysis questions</p>
                    <form onSubmit={handleHelpSubmit} className="help-form">
                      <textarea
                        value={helpQuery}
                        onChange={(e) => setHelpQuery(e.target.value)}
                        placeholder="Ask me anything about legal documents, risk analysis, or how to use this platform..."
                        rows={4}
                        className="help-input"
                      />
                      <button type="submit" className="help-submit">
                        Ask AI
                      </button>
                    </form>
                    {helpResponse && (
                      <div className="help-response">
                        <h5>AI Response:</h5>
                        <p>{helpResponse}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="help-resources">
                    <h4>Quick Help</h4>
                  <div className="help-links">
                    <button 
                      className="help-link" 
                      onClick={() => setHelpQuery("How to upload documents")}
                    >
                      How to upload documents
                    </button>
                    <button 
                      className="help-link"
                      onClick={() => setHelpQuery("Understanding risk analysis")}
                    >
                      Understanding risk analysis
                    </button>
                    <button 
                      className="help-link"
                      onClick={() => setHelpQuery("Creating document groups")}
                    >
                      Creating document groups
                    </button>
                    <button 
                      className="help-link"
                      onClick={() => setHelpQuery("Privacy and security")}
                    >
                      Privacy and security
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
