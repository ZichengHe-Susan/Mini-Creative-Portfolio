import React, { useState, useEffect } from 'react';
import { creatorAPI, creativeFieldsAPI } from '../services/api';

const SearchForm = ({ onSearchResults, onLoading }) => {
  const [searchData, setSearchData] = useState({
    search: '',           // Basic search by name
    q: '',               // Advanced text search
    name: '',            // Search by name specifically
    bio: '',             // Search by bio specifically
    creative_fields: []  // Filter by creative fields
  });
  const [availableFields, setAvailableFields] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    showAdvanced: false,
    selectedFields: []
  });
  const [loading, setLoading] = useState(false);

  // Load available creative fields on component mount
  useEffect(() => {
    loadCreativeFields();
  }, []);

  const loadCreativeFields = async () => {
    try {
      const fields = await creativeFieldsAPI.getCreativeFields();
      setAvailableFields(Array.isArray(fields) ? fields : []);
    } catch (error) {
      console.error('Error loading creative fields:', error);
      setAvailableFields([]); // Ensure it's always an array even on error
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle basic search (search by name)
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    if (onLoading) onLoading(true);

    try {
      const params = {};
      
      // Add search parameters
      if (searchData.search.trim()) {
        params.search = searchData.search.trim();
      }
      
      // Add creative fields filter
      if (searchData.creative_fields.length > 0) {
        params.creative_fields = searchData.creative_fields;
      }

      const results = await creatorAPI.getCreators(params);
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching creators:', error);
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    if (onLoading) onLoading(true);

    try {
      const params = {};
      
      // Add search parameters
      if (searchData.q.trim()) {
        params.q = searchData.q.trim();
      }
      if (searchData.name.trim()) {
        params.name = searchData.name.trim();
      }
      if (searchData.bio.trim()) {
        params.bio = searchData.bio.trim();
      }
      
      // Add creative fields filter
      if (searchData.creative_fields.length > 0) {
        params.creative_fields = searchData.creative_fields;
      }

      const results = await creatorAPI.searchCreators(params);
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching creators:', error);
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  };

  // Handle creative field selection
  const handleFieldSelection = (fieldId) => {
    setSearchData(prev => ({
      ...prev,
      creative_fields: prev.creative_fields.includes(fieldId)
        ? prev.creative_fields.filter(id => id !== fieldId)
        : [...prev.creative_fields, fieldId]
    }));
    
    setActiveFilters(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(id => id !== fieldId)
        : [...prev.selectedFields, fieldId]
    }));
  };

  // Reset all filters
  const handleResetFilters = async () => {
    setSearchData({
      search: '',
      q: '',
      name: '',
      bio: '',
      creative_fields: []
    });
    setActiveFilters({
      showAdvanced: false,
      selectedFields: []
    });

    // Load all creators
    setLoading(true);
    if (onLoading) onLoading(true);
    try {
      const results = await creatorAPI.getCreators();
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  };

  return (
    <div className="search-form">
      <div className="search-form-header">
        <h3>Search Creators</h3>
        <button 
          type="button"
          className="btn btn-link"
          onClick={() => setActiveFilters(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
        >
          {activeFilters.showAdvanced ? 'Simple Search' : 'Advanced Search'}
        </button>
      </div>

      {!activeFilters.showAdvanced ? (
        // Basic Search Form
        <form onSubmit={handleSearch} className="basic-search">
          <div className="search-row">
            <input
              type="text"
              name="search"
              value={searchData.search}
              onChange={handleInputChange}
              placeholder="Search creators by name..."
              className="search-input"
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      ) : (
        // Advanced Search Form
        <form onSubmit={handleAdvancedSearch} className="advanced-search">
          <div className="form-group">
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

          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
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

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Searching...' : 'Advanced Search'}
            </button>
          </div>
        </form>
      )}

      {/* Creative Fields Filter */}
      <div className="creative-fields-filter">
        <h4>Filter by Creative Fields</h4>
        <div className="field-selection">
          {Array.isArray(availableFields) && availableFields.map((field) => (
            <label key={field.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={searchData.creative_fields.includes(field.id)}
                onChange={() => handleFieldSelection(field.id)}
              />
              {field.name}
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchData.search || searchData.q || searchData.name || searchData.bio || searchData.creative_fields.length > 0) && (
        <div className="active-filters">
          <h4>Active Filters:</h4>
          <div className="filter-tags">
            {searchData.search && <span className="filter-tag">Name: "{searchData.search}"</span>}
            {searchData.q && <span className="filter-tag">General: "{searchData.q}"</span>}
            {searchData.name && <span className="filter-tag">Name: "{searchData.name}"</span>}
            {searchData.bio && <span className="filter-tag">Bio: "{searchData.bio}"</span>}
            {searchData.creative_fields.map(fieldId => {
              const field = availableFields.find(f => f.id === fieldId);
              return field ? <span key={fieldId} className="filter-tag">Field: {field.name}</span> : null;
            })}
          </div>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchForm;