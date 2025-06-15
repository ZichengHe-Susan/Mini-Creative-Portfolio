import React, { useState, useEffect } from 'react';
import { creatorAPI, creativeFieldsAPI } from '../services/api';
import Modal from './Modal';
import '../styles/SearchForm.css';
import '../styles/CreatorForm.css';

const SearchForm = ({ onSearchResults, onLoading }) => {
  const [searchData, setSearchData] = useState({
    q: '',
    name: '',
    bio: '',
    creative_fields: []
  });
  
  const [availableFields, setAvailableFields] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFieldsModalOpen, setIsFieldsModalOpen] = useState(false);
  const [fieldsError, setFieldsError] = useState('');

  useEffect(() => {
    loadCreativeFields();
  }, []);

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
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showFieldsError = (msg) => {
    setFieldsError(msg);
    setTimeout(() => setFieldsError(''), 3000);
  };

  const handleFieldSelection = (fieldId) => {
    setSearchData(prev => {
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
    setSearchData(prev => ({
      ...prev,
      creative_fields: prev.creative_fields.filter(id => id !== fieldId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (onLoading) onLoading(true);

    try {
      const params = {};

      if (searchData.q.trim()) {
        params.q = searchData.q.trim();
      }

      if (searchData.name.trim()) {
        params.name = searchData.name.trim();
      }
      if (searchData.bio.trim()) {
        params.bio = searchData.bio.trim();
      }

      if (searchData.creative_fields.length > 0) {
        params.creative_fields = searchData.creative_fields;
      }

      const results = await creatorAPI.searchCreators(params);
      if (onSearchResults) onSearchResults(results);
    } catch (error) {
      console.error('Error searching creators:', error);
      if (onSearchResults) onSearchResults([]);
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  };

  const handleClearFilters = async () => {
    const clearedData = {
      q: '',
      name: '',
      bio: '',
      creative_fields: []
    };

    setSearchData(clearedData);

    setLoading(true);
    if (onLoading) onLoading(true);

    try {
      const results = await creatorAPI.searchCreators({});
      if (onSearchResults) onSearchResults(results);
    } catch (error) {
      console.error('Error fetching all creators:', error);
      if (onSearchResults) onSearchResults([]);
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  };

  return (
    <div className="search-form">
      <div className="search-form-header">
        <h2>Find Creative Talent</h2>
        <p>Search for creators by name, creative fields, or by bio</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="search-inputs">
          <div className="search-input-group">
            <label htmlFor="q">General Search</label>
            <input
              type="text"
              id="q"
              name="q"
              value={searchData.q}
              onChange={handleInputChange}
              placeholder="Search across name and bio..."
            />
          </div>

          <div className="search-input-group">
            <label>Creative Fields</label>
            <button
              type="button"
              className="select-fields-button"
              onClick={() => setIsFieldsModalOpen(true)}
            >
              Select Fields
            </button>
            
            <div className="selected-fields">
              {searchData.creative_fields.map((fieldId) => (
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
        </div>

        <div className="search-filters">
          <div className="filters-header">
            <h3>Advanced Filters</h3>
            <button
              type="button"
              className="toggle-filters"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showAdvanced && (
            <div className="filters-content">
              <div className="search-input-group">
                <label htmlFor="name">Search by Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={searchData.name}
                  onChange={handleInputChange}
                  placeholder="Search by name only..."
                />
              </div>

              <div className="search-input-group">
                <label htmlFor="bio">Search by Bio</label>
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  value={searchData.bio}
                  onChange={handleInputChange}
                  placeholder="Search by bio only..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="search-actions">
          <button
            type="button"
            className="clear-filters"
            onClick={handleClearFilters}
          >
            Clear All
          </button>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? (
              <>
                <span>Searching</span>
                <div className="loading-indicator" />
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

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
                checked={searchData.creative_fields.includes(field.id)}
                onChange={() => handleFieldSelection(field.id)}
              />
              {field.name}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SearchForm;