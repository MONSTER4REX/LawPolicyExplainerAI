import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleHome = () => {
    navigate('/'); // Go to dashboard
  };

  return (
    <div className="navigation-bar">
      <div className="nav-buttons">
        <button className="nav-btn back-btn" onClick={handleBack} title="Go Back">
          ←
        </button>
        <button className="nav-btn home-btn" onClick={handleHome} title="Go to Dashboard">
          🏠
        </button>
      </div>
    </div>
  );
};

export default Navigation;
