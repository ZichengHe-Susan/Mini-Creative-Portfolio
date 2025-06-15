import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { creatorAPI } from '../services/api';
import CreatorForm from '../components/CreatorForm';
import '../styles/CreatorForm.css';

const EditCreatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCreatorData();
  }, [id]);

  const fetchCreatorData = async () => {
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

  const handleUpdateSuccess = (updatedCreator) => {
    setFormLoading(false);
    setError('');
    navigate(`/creator/${updatedCreator.id}`, { 
      state: { message: 'Profile updated successfully!' }
    });
  };

  const handleUpdateError = (error) => {
    setFormLoading(false);
    setError(error.message || 'Failed to update profile');
  };

  const handleCancel = () => {
    navigate(`/creator/${id}`);
  };

  const handleLoadingChange = (isLoading) => {
    setFormLoading(isLoading);
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

  if (error && !creator) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchCreatorData} className="btn btn-primary">
            Try Again
          </button>
          <button onClick={() => navigate(`/creator/${id}`)} className="btn btn-secondary">
            Back to Profile
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
          <p>The creator profile you're trying to edit doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Your Creative Profile</h1>
        <p>Update your information and showcase your talents to the world!</p>
      </div>
      
      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      {formLoading && (
        <div className="loading-banner">
          <p>Updating your profile...</p>
        </div>
      )}
      
      <CreatorForm 
        creator={creator}
        isEdit={true}
        onSuccess={handleUpdateSuccess}
        onError={handleUpdateError}
        onCancel={handleCancel}
        onLoadingChange={handleLoadingChange}
      />
    </div>
  );
};

export default EditCreatorPage; 