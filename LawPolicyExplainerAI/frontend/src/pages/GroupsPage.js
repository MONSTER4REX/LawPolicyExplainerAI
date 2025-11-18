import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Folder, Plus, Search, FileText, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './GroupsPage.css';

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDescription, setEditGroupDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user?.email]);

  // Load groups from localStorage on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups));
      } catch (error) {
        console.error('Error loading groups from localStorage:', error);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      // Fetch documents
      const docsResponse = await fetch(API_ENDPOINTS.DOCUMENTS(user.email));
      const docsData = await docsResponse.json();
      if (docsResponse.ok) {
        setDocuments(docsData.documents);
      }

      // Load groups from localStorage or use default mock groups
      const savedGroups = localStorage.getItem('groups');
      const groupDocs = JSON.parse(localStorage.getItem('groupDocuments') || '{}');
      
      if (savedGroups) {
        try {
          let groupsData = JSON.parse(savedGroups);
          
          // Update document counts based on group-document relationships
          groupsData = groupsData.map(group => ({
            ...group,
            documentCount: groupDocs[group.id] ? groupDocs[group.id].length : 0
          }));
          
          setGroups(groupsData);
        } catch (error) {
          console.error('Error loading groups from localStorage:', error);
          setDefaultGroups();
        }
      } else {
        setDefaultGroups();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultGroups = () => {
    // Start with empty groups - no default groups
    setGroups([]);
    localStorage.setItem('groups', JSON.stringify([]));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      description: newGroupDescription,
      documentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      color: ['blue', 'green', 'purple', 'orange', 'red'][Math.floor(Math.random() * 5)]
    };

    const updatedGroups = [newGroup, ...groups];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
    // Trigger groups count update on dashboard
    window.dispatchEvent(new CustomEvent('groupsCountUpdated', { detail: updatedGroups.length }));
    
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateModal(false);
  };

  const handleDeleteGroup = (groupId) => {
    const updatedGroups = groups.filter(group => group.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
    // Trigger groups count update on dashboard
    window.dispatchEvent(new CustomEvent('groupsCountUpdated', { detail: updatedGroups.length }));
  };

  const handleAddDocumentToGroup = async (groupId) => {
    setSelectedGroup(groupId);
    // Refresh documents list when opening the modal
    try {
      const docsResponse = await fetch(API_ENDPOINTS.DOCUMENTS(user.email));
      const docsData = await docsResponse.json();
      if (docsResponse.ok) {
        setDocuments(docsData.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setShowAddDocModal(true);
  };

  const handleAddDocToGroup = (docId) => {
    // Ensure docId is a string for consistent comparison
    const docIdStr = String(docId);
    
    // Get group-document relationships from localStorage
    const groupDocs = JSON.parse(localStorage.getItem('groupDocuments') || '{}');
    
    // Add document to group
    if (!groupDocs[selectedGroup]) {
      groupDocs[selectedGroup] = [];
    }
    
    // Convert existing IDs to strings for comparison
    const docsInGroup = groupDocs[selectedGroup].map(id => String(id));
    
    if (!docsInGroup.includes(docIdStr)) {
      groupDocs[selectedGroup].push(docIdStr);
      localStorage.setItem('groupDocuments', JSON.stringify(groupDocs));
      
      // Update group document count
      const updatedGroups = groups.map(group => {
        if (group.id === selectedGroup) {
          return { ...group, documentCount: groupDocs[selectedGroup].length };
        }
        return group;
      });
      
      setGroups(updatedGroups);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      
      // Force re-render by updating state - this will refresh the modal display
      setDocuments([...documents]);
      
      // Show success message briefly
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Document added to group!';
      successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 2000);
    } else {
      alert(`Document is already in this group!`);
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setEditGroupDescription(group.description);
    setShowEditModal(true);
  };

  const handleUpdateGroup = () => {
    if (!editGroupName.trim()) return;

    const updatedGroups = groups.map(group => 
      group.id === editingGroup.id 
        ? { ...group, name: editGroupName, description: editGroupDescription }
        : group
    );
    
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setShowEditModal(false);
    setEditingGroup(null);
    setEditGroupName('');
    setEditGroupDescription('');
  };

  const handleShowMoreOptions = (group) => {
    // For now, just show a simple menu with options
    const options = ['Edit', 'Delete'];
    const choice = window.prompt(`Options for "${group.name}":\n1. Edit\n2. Delete\n\nEnter number (1 or 2):`);
    
    if (choice === '1') {
      handleEditGroup(group);
    } else if (choice === '2') {
      if (window.confirm(`Are you sure you want to delete "${group.name}"?`)) {
        handleDeleteGroup(group.id);
      }
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return (
      <div className="groups-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="groups-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Document Groups</h1>
          <p>Organize your documents into categories for easy management</p>
        </div>
        <button 
          className="create-group-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="groups-grid">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div key={group.id} className={`group-card ${group.color}`}>
              <div className="group-header">
                <div className="group-icon">
                  <Folder size={24} />
                </div>
                <div className="group-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleShowMoreOptions(group)}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="group-content">
                <h3 className="group-name">{group.name}</h3>
                <p className="group-description">{group.description}</p>
                
                <div className="group-stats">
                  <div className="stat">
                    <FileText size={16} />
                    <span>{group.documentCount} documents</span>
                  </div>
                  <div className="stat">
                    <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="group-footer">
                <Link to={`/groups/${group.id}`} className="view-btn">
                  View Documents
                </Link>
                <button 
                  className="add-btn"
                  onClick={() => handleAddDocumentToGroup(group.id)}
                >
                  <Plus size={16} />
                  Add Document
                </button>
                <div className="group-actions-menu">
                  <button 
                    className="menu-btn" 
                    title="Edit"
                    onClick={() => handleEditGroup(group)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="menu-btn delete" 
                    title="Delete"
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Folder size={64} className="empty-icon" />
            <h3>No groups found</h3>
            <p>
              {searchTerm 
                ? 'No groups match your search'
                : 'Create your first group to organize documents'
              }
            </p>
            {!searchTerm && (
              <button 
                className="create-group-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                Create Group
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Group</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="groupName">Group Name</label>
                <input
                  type="text"
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="groupDescription">Description (Optional)</label>
                <textarea
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document to Group Modal */}
      {showAddDocModal && (
        <div className="modal-overlay" onClick={() => setShowAddDocModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Document to Group</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddDocModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>Select a document to add to this group:</p>
              <div className="documents-list">
                {documents.length > 0 ? (
                  (() => {
                    const groupDocs = JSON.parse(localStorage.getItem('groupDocuments') || '{}');
                    const docsInGroup = groupDocs[selectedGroup] || [];
                    
                  return documents.map(doc => {
                    // Convert both to strings for consistent comparison
                    const docIdStr = String(doc.id);
                    const isInGroup = docsInGroup.some(id => String(id) === docIdStr);
                    return (
                        <div key={doc.id} className={`document-item ${isInGroup ? 'in-group' : ''}`}>
                          <div className="document-info">
                            <FileText size={20} />
                            <div>
                              <div className="document-name">{doc.filename}</div>
                              <div className="document-date">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </div>
                              {isInGroup && <div className="in-group-badge">Already in group</div>}
                            </div>
                          </div>
                          <button 
                            className={`add-doc-btn ${isInGroup ? 'disabled' : ''}`}
                            onClick={() => handleAddDocToGroup(doc.id)}
                            disabled={isInGroup}
                          >
                            {isInGroup ? 'Added' : 'Add'}
                          </button>
                        </div>
                      );
                    });
                  })()
                ) : (
                  <p className="no-docs">No documents available. Upload some documents first!</p>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddDocModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Group</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="editGroupName">Group Name</label>
                <input
                  type="text"
                  id="editGroupName"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editGroupDescription">Description (Optional)</label>
                <textarea
                  id="editGroupDescription"
                  value={editGroupDescription}
                  onChange={(e) => setEditGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={handleUpdateGroup}
                disabled={!editGroupName.trim()}
              >
                Update Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
