import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorForm from '../components/CreatorForm';

const CreateCreatorPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle successful creator creation
  const handleCreateSuccess = (newCreator) => {
    setIsLoading(false);
    setError('');
    // Navigate to the newly created creator's detail page
    navigate(`/creator/${newCreator.id}`, { 
      state: { message: 'Profile created successfully!' }
    });
  };

  // Handle creation errors
  const handleCreateError = (error) => {
    setIsLoading(false);
    setError(error.message || 'Failed to create profile');
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Create Your Creative Profile</h1>
        <p>Join our creative community and showcase your talents to the world!</p>
      </div>
      
      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      
      {isLoading && (
        <div className="loading-banner">
          <p>Creating your profile...</p>
        </div>
      )}
      
      <CreatorForm 
        isEdit={false}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
        onCancel={handleCancel}
        onLoadingChange={setIsLoading}
      />
    </div>
  );
};

export default CreateCreatorPage; 