// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // User endpoints
  USERS: `${API_BASE_URL}/users`,
  USER_BY_EMAIL: (email) => `${API_BASE_URL}/users/${email}`,
  
  // Document endpoints
  DOCUMENTS: (email) => `${API_BASE_URL}/documents/${email}`,
  DOCUMENT_BY_ID: (email, id) => `${API_BASE_URL}/documents/${encodeURIComponent(email)}/${id}`,
  DELETE_DOCUMENT: (docId) => `${API_BASE_URL}/documents/${docId}`,
  UPLOAD: `${API_BASE_URL}/upload`,
  
  // AI endpoints
  AI_HELP: `${API_BASE_URL}/ai-help`,
};

export default API_BASE_URL;









