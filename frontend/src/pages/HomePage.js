import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import CreatorCard from '../components/CreatorCard';
import { creatorAPI } from '../services/api';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const creatorsPerPage = 6;

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError('');
      const creatorsData = await creatorAPI.getCreators();
      setCreators(creatorsData);
      setCurrentPage(1); 
    } catch (error) {
      setError('Failed to load creators');
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setCreators(results);
    setError('');
    setCurrentPage(1); 
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  const handleViewProfile = (creatorId) => {
    navigate(`/creator/${creatorId}`);
  };

  const handleEditProfile = (creatorId) => {
    navigate(`/creator/${creatorId}/edit`);
  };

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
            {creators
              .slice((currentPage - 1) * creatorsPerPage, currentPage * creatorsPerPage)
              .map((creator) => (
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

        {creators.length > creatorsPerPage && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: Math.ceil(creators.length / creatorsPerPage) }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {page}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(creators.length / creatorsPerPage)))}
              disabled={currentPage === Math.ceil(creators.length / creatorsPerPage)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 