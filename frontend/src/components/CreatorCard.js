import React from 'react';

const CreatorCard = ({ creator, onViewProfile, onEditProfile }) => {
  // Handle view profile action
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(creator.id);
    }
  };

  // Handle edit profile action
  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile(creator.id);
    }
  };

  // Get profile picture URL or use placeholder
  const getProfilePicture = () => {
    if (creator.profile_picture) {
      // Handle both full URLs and relative paths
      return creator.profile_picture.startsWith('http') 
        ? creator.profile_picture 
        : `http://localhost:8000${creator.profile_picture}`;
    }
    return '/default-avatar.png'; // Fallback image
  };

  // Truncate bio for card display
  const truncateBio = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="creator-card">
      <div className="creator-card-header">
        <img 
          src={getProfilePicture()} 
          alt={creator.name}
          className="creator-avatar"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <h3 className="creator-name">{creator.name}</h3>
      </div>
      
      <div className="creator-card-body">
        {creator.bio && (
          <p className="creator-bio">{truncateBio(creator.bio)}</p>
        )}
        
        {creator.creative_fields && creator.creative_fields.length > 0 && (
          <div className="creative-fields">
            {creator.creative_fields.map((field) => (
              <span key={field.id} className="field-tag">
                {field.name}
              </span>
            ))}
          </div>
        )}
        
        {creator.portfolio_links && creator.portfolio_links.length > 0 && (
          <div className="portfolio-links">
            <h4>Portfolio:</h4>
            {creator.portfolio_links.map((link, index) => (
              <a 
                key={index} 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="portfolio-link"
              >
                Link {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
      
      <div className="creator-card-actions">
        <button onClick={handleViewProfile} className="btn btn-primary">
          View Profile
        </button>
        <button onClick={handleEditProfile} className="btn btn-secondary">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default CreatorCard; 