import React, { useState, useEffect } from 'react';
import { creatorAPI, creativeFieldsAPI } from '../services/api';
import Modal from './Modal';
import '../styles/CreatorForm.css';

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
  const [isFieldsModalOpen, setIsFieldsModalOpen] = useState(false);
  const [fieldsError, setFieldsError] = useState('');

  useEffect(() => {
    loadCreativeFields();
  }, []);

  useEffect(() => {
    if (isEdit && creator) {
      console.log('Creator data:', creator); 
      console.log('Creative fields:', creator.creative_fields); 
      
      const creativeFieldIds = creator.creative_fields?.map(field => field.id) || [];
      console.log('Extracted creative field IDs:', creativeFieldIds); 
      
      setFormData({
        name: creator.name || '',
        bio: creator.bio || '',
        profile_picture: null, 
        creative_fields: creativeFieldIds,
        portfolio_link_1: creator.portfolio_link_1 || '',
        portfolio_link_2: creator.portfolio_link_2 || '',
        portfolio_link_3: creator.portfolio_link_3 || ''
      });
      
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
      setAvailableFields([]); 
    }
  };

  const getFieldNameById = (fieldId) => {
    const field = availableFields.find(f => f.id === fieldId);
    return field ? field.name : '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showFieldsError = (msg) => {
    setFieldsError(msg);
    setTimeout(() => setFieldsError(''), 3000);
  };

  const handleFieldSelection = (fieldId) => {
    setFormData(prev => {
      const alreadySelected = prev.creative_fields.includes(fieldId);

      if (alreadySelected) {
        return {
          ...prev,
          creative_fields: prev.creative_fields.filter(id => id !== fieldId)
        };
      }

      if (prev.creative_fields.length >= 4) {
        showFieldsError('You can select up to 4 creative fields.');
        return prev;
      }

      return {
        ...prev,
        creative_fields: [...prev.creative_fields, fieldId]
      };
    });
  };

  const handleRemoveField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      creative_fields: prev.creative_fields.filter(id => id !== fieldId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.creative_fields.length === 0) {
      setError('Please select at least one creative field.');
      return;
    }

    if (formData.bio.trim().length <= 5) {
      setError('Bio must be at least 6 characters long.');
      return;
    }

    if (!formData.portfolio_link_1.trim()) {
      setError('Portfolio Link 1 is required.');
      return;
    }

    setLoading(true);
    setError('');

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
      
      if (onError) {
        onError({ message: errorMessage, originalError: error });
      }
    } finally {
      setLoading(false);
      
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  };

  return (
    <div className="creator-form">
      <h2>{isEdit ? 'Edit' : 'Create'} Creator Profile</h2>
      

      
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
          <label htmlFor="bio">Bio*</label>
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
          <label>Profile Picture</label>
          <div className="profile-picture-section">
            {imagePreview && (
              <div className="profile-picture-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            <div className="profile-picture-upload">
              <input
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile_picture" className="upload-button">
                {imagePreview ? 'Change Picture' : 'Upload Picture'}
              </label>
            </div>
          </div>
        </div>

        <div className="form-group creative-fields-section">
          <label className="creative-fields-label">Creative Fields(select 1-4 creative fields)*</label>
          <button
            type="button"
            className="select-fields-button"
            onClick={() => setIsFieldsModalOpen(true)}
          >
            Select Creative Fields
          </button>
          
          <div className="selected-fields">
            {formData.creative_fields.map((fieldId) => (
              <span key={fieldId} className="selected-field-tag">
                {getFieldNameById(fieldId)}
                <button
                  type="button"
                  className="remove-field"
                  onClick={() => handleRemoveField(fieldId)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <Modal
          isOpen={isFieldsModalOpen}
          onClose={() => setIsFieldsModalOpen(false)}
          title="Select Creative Fields"
        >
          {fieldsError && <div className="error-message">{fieldsError}</div>}
          <div className="field-selection-grid">
            {availableFields.map((field) => (
              <label key={field.id} className="field-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.creative_fields.includes(field.id)}
                  onChange={() => handleFieldSelection(field.id)}
                />
                {field.name}
              </label>
            ))}
          </div>
        </Modal>

        <div className="form-group">
          <label htmlFor="portfolio_link_1">Portfolio Link 1*</label>
          <input
            type="url"
            id="portfolio_link_1"
            name="portfolio_link_1"
            value={formData.portfolio_link_1}
            onChange={handleInputChange}
            placeholder="https://your-website.com"
            required
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
            placeholder="optional to add"
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
            placeholder="optional to add"
          />
        </div>
        

        <div className="form-actions">
        {error && (
        <div className="error-message">
          {error}
        </div>
      )}
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