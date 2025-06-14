import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { creatorAPI } from '../services/api';

const CreatorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch creator details on component mount
  useEffect(() => {
    fetchCreatorDetails();
  }, [id]);

  const fetchCreatorDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const creatorData = await creatorAPI.getCreatorById(id);
      setCreator(creatorData);
    } catch (error) {
      setError('Failed to load creator profile');
      console.error('Error fetching creator:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit profile navigation
  const handleEditProfile = () => {
    navigate(`/creator/${id}/edit`);
  };

  // Handle delete profile with confirmation
  const handleDeleteProfile = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await creatorAPI.deleteCreator(id);
      navigate('/', { 
        state: { message: 'Profile deleted successfully' }
      });
    } catch (error) {
      setError('Failed to delete profile');
      console.error('Error deleting creator:', error);
    }
  };

  // Handle share profile functionality
  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${creator.name}'s Creative Profile`,
          text: `Check out ${creator.name}'s creative profile!`,
          url: profileUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(profileUrl);
        alert('Profile link copied to clipboard!');
      } catch (error) {
        // Final fallback
        prompt('Copy this link to share:', profileUrl);
      }
    }
  };

  // Get profile picture URL or use placeholder
  const getProfilePicture = () => {
    if (creator?.profile_picture) {
      return creator.profile_picture.startsWith('http') 
        ? creator.profile_picture 
        : `http://localhost:8000${creator.profile_picture}`;
    }
    return '/default-avatar.png';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchCreatorDetails} className="btn btn-primary">
            Try Again
          </button>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Creator Not Found</h2>
          <p>The creator profile you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {successMessage && (
        <div className="success-banner">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      <div className="creator-profile-detail">
        <div className="profile-header">
          <div className="profile-image">
            <img 
              src={getProfilePicture()} 
              alt={creator.name}
              className="profile-avatar-large"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
          
          <div className="profile-info">
            <h1>{creator.name}</h1>
            {creator.bio && (
              <p className="profile-bio">{creator.bio}</p>
            )}
            
            {creator.creative_fields && creator.creative_fields.length > 0 && (
              <div className="creative-fields">
                <h3>Creative Fields</h3>
                <div className="field-tags">
                  {creator.creative_fields.map((field) => (
                    <span key={field.id} className="field-tag">
                      {field.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {creator.portfolio_links && creator.portfolio_links.length > 0 && (
              <div className="portfolio-links">
                <h3>Portfolio</h3>
                <div className="portfolio-list">
                  {creator.portfolio_links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="portfolio-link"
                    >
                      Portfolio Link {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-actions">
        <button onClick={handleEditProfile} className="btn btn-primary">
          Edit Profile
        </button>
        <button onClick={handleShareProfile} className="btn btn-secondary">
          Share Profile
        </button>
        <button 
          onClick={handleDeleteProfile} 
          className={`btn ${showDeleteConfirm ? 'btn-danger' : 'btn-outline'}`}
        >
          {showDeleteConfirm ? 'Confirm Delete' : 'Delete Profile'}
        </button>
        {showDeleteConfirm && (
          <button 
            onClick={() => setShowDeleteConfirm(false)} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatorDetailPage; 