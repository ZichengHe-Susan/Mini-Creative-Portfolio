import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import CreatorCard from '../components/CreatorCard';
import { creatorAPI } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch all creators on component mount
  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError('');
      const creatorsData = await creatorAPI.getCreators();
      setCreators(creatorsData);
    } catch (error) {
      setError('Failed to load creators');
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search results from SearchForm
  const handleSearchResults = (results) => {
    setCreators(results);
    setError('');
  };

  // Handle loading state changes from SearchForm
  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  // Handle view profile action
  const handleViewProfile = (creatorId) => {
    navigate(`/creator/${creatorId}`);
  };

  // Handle edit profile action
  const handleEditProfile = (creatorId) => {
    navigate(`/creator/${creatorId}/edit`);
  };

  // Handle create new profile action
  const handleCreateProfile = () => {
    navigate('/create');
  };

  if (loading && creators.length === 0) {
    return (
      <div className="container">
        <div className="loading-state">
          <h2>Loading creators...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Creative Portfolio Directory</h1>
        <p>Discover talented creatives and showcase your own work</p>
        
        <button 
          onClick={handleCreateProfile} 
          className="btn btn-primary create-profile-btn"
        >
          Create Your Profile
        </button>
      </div>

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
      
      <SearchForm 
        onSearchResults={handleSearchResults}
        onLoading={handleLoadingChange}
      />
      
      <div className="creators-section">
        <div className="creators-header">
          <h2>
            {creators.length > 0 
              ? `${creators.length} Creator${creators.length !== 1 ? 's' : ''} Found`
              : 'No Creators Found'
            }
          </h2>
          {loading && <span className="loading-indicator">Searching...</span>}
        </div>
        
        {creators.length > 0 ? (
          <div className="creators-grid">
            {creators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onViewProfile={handleViewProfile}
                onEditProfile={handleEditProfile}
              />
            ))}
          </div>
        ) : !loading && (
          <div className="empty-state">
            <h3>No creators found</h3>
            <p>Be the first to create a profile and showcase your creative work!</p>
            <button 
              onClick={handleCreateProfile} 
              className="btn btn-primary"
            >
              Create Your Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 