import React, { useState, useEffect } from 'react';
import { creatorAPI, creativeFieldsAPI } from '../services/api';

const CreatorForm = ({ creator = null, isEdit = false, onSuccess, onCancel, onError, onLoadingChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profile_picture: null,
    creative_fields: [],
    portfolio_link_1: '',
    portfolio_link_2: '',
    portfolio_link_3: ''
  });
  const [availableFields, setAvailableFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Initialize form data on component mount
  useEffect(() => {
    // Load available creative fields first
    loadCreativeFields();
  }, []);

  // Initialize form data when creator data is available
  useEffect(() => {
    if (isEdit && creator) {
      console.log('Creator data:', creator); // Debug log
      console.log('Creative fields:', creator.creative_fields); // Debug log
      
      const creativeFieldIds = creator.creative_fields?.map(field => field.id) || [];
      console.log('Extracted creative field IDs:', creativeFieldIds); // Debug log
      
      setFormData({
        name: creator.name || '',
        bio: creator.bio || '',
        profile_picture: null, // File input will be handled separately
        creative_fields: creativeFieldIds,
        portfolio_link_1: creator.portfolio_link_1 || '',
        portfolio_link_2: creator.portfolio_link_2 || '',
        portfolio_link_3: creator.portfolio_link_3 || ''
      });
      
      // Set image preview if editing
      if (creator.profile_picture) {
        const imageUrl = creator.profile_picture.startsWith('http') 
          ? creator.profile_picture 
          : `http://localhost:8000${creator.profile_picture}`;
        setImagePreview(imageUrl);
      }
    }
  }, [creator, isEdit]);

  const loadCreativeFields = async () => {
    try {
      const fields = await creativeFieldsAPI.getCreativeFields();
      setAvailableFields(Array.isArray(fields) ? fields : []);
    } catch (error) {
      console.error('Error loading creative fields:', error);
      setAvailableFields([]); // Ensure it's always an array even on error
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle creative field selection
  const handleFieldSelection = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      creative_fields: prev.creative_fields.includes(fieldId)
        ? prev.creative_fields.filter(id => id !== fieldId)
        : [...prev.creative_fields, fieldId]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Notify parent component of loading state change
    if (onLoadingChange) {
      onLoadingChange(true);
    }

    try {
      let result;
      if (isEdit && creator) {
        result = await creatorAPI.updateCreator(creator.id, formData);
      } else {
        result = await creatorAPI.createCreator(formData);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      console.error('Error saving creator:', error);
      
      // Notify parent component of error if callback provided
      if (onError) {
        onError({ message: errorMessage, originalError: error });
      }
    } finally {
      setLoading(false);
      
      // Notify parent component of loading state change
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  };

  return (
    <div className="creator-form">
      <h2>{isEdit ? 'Edit' : 'Create'} Creator Profile</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows="4"
            maxLength="500"
          />
          <small>{formData.bio.length}/500 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="profile_picture">Profile Picture</label>
          <input
            type="file"
            id="profile_picture"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Creative Fields</label>
          <div className="field-selection">
            {Array.isArray(availableFields) && availableFields.map((field) => (
              <label key={field.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.creative_fields.includes(field.id)}
                  onChange={() => handleFieldSelection(field.id)}
                />
                {field.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="portfolio_link_1">Portfolio Link 1</label>
          <input
            type="url"
            id="portfolio_link_1"
            name="portfolio_link_1"
            value={formData.portfolio_link_1}
            onChange={handleInputChange}
            placeholder="https://your-website.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="portfolio_link_2">Portfolio Link 2</label>
          <input
            type="url"
            id="portfolio_link_2"
            name="portfolio_link_2"
            value={formData.portfolio_link_2}
            onChange={handleInputChange}
            placeholder="https://your-instagram.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="portfolio_link_3">Portfolio Link 3</label>
          <input
            type="url"
            id="portfolio_link_3"
            name="portfolio_link_3"
            value={formData.portfolio_link_3}
            onChange={handleInputChange}
            placeholder="https://your-portfolio.com"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : (isEdit ? 'Update Profile' : 'Create Profile')}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatorForm; 