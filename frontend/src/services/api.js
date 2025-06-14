import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Creator API functions
export const creatorAPI = {
  // Get all creators with optional search/filter parameters
  getCreators: async (params = {}) => {
    try {
      const response = await api.get('/creators/', { params });
      // Extract results from paginated response
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
  },

  // Get creator by ID
  getCreatorById: async (id) => {
    try {
      const response = await api.get(`/creators/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching creator by ID:', error);
      throw error;
    }
  },

  // Create new creator
  createCreator: async (creatorData) => {
    try {
      // Handle file upload with FormData if profile_picture exists
      let data = creatorData;
      let headers = {};
      
      if (creatorData.profile_picture instanceof File) {
        data = new FormData();
        Object.keys(creatorData).forEach(key => {
          if (key === 'creative_fields' && Array.isArray(creatorData[key])) {
            // Handle many-to-many field for creative_fields - backend expects 'creative_field_ids'
            creatorData[key].forEach(fieldId => {
              data.append('creative_field_ids', fieldId);
            });
          } else if (key !== 'creative_fields') { // Skip creative_fields since we handle it as creative_field_ids
            data.append(key, creatorData[key]);
          }
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // For non-file uploads, rename creative_fields to creative_field_ids
        if (creatorData.creative_fields) {
          data = { ...creatorData, creative_field_ids: creatorData.creative_fields };
          delete data.creative_fields;
        }
      }

      const response = await api.post('/creators/', data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating creator:', error);
      throw error;
    }
  },

  // Update creator
  updateCreator: async (id, creatorData) => {
    try {
      // Handle file upload with FormData if profile_picture exists
      let data = creatorData;
      let headers = {};
      
      if (creatorData.profile_picture instanceof File) {
        data = new FormData();
        Object.keys(creatorData).forEach(key => {
          if (key === 'creative_fields' && Array.isArray(creatorData[key])) {
            // Handle many-to-many field for creative_fields - backend expects 'creative_field_ids'
            creatorData[key].forEach(fieldId => {
              data.append('creative_field_ids', fieldId);
            });
          } else if (key !== 'creative_fields') { // Skip creative_fields since we handle it as creative_field_ids
            data.append(key, creatorData[key]);
          }
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // For non-file uploads, rename creative_fields to creative_field_ids
        if (creatorData.creative_fields) {
          data = { ...creatorData, creative_field_ids: creatorData.creative_fields };
          delete data.creative_fields;
        }
      }

      const response = await api.put(`/creators/${id}/`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating creator:', error);
      throw error;
    }
  },

  // Delete creator
  deleteCreator: async (id) => {
    try {
      const response = await api.delete(`/creators/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting creator:', error);
      throw error;
    }
  },

  // Search creators with advanced parameters
  searchCreators: async (searchParams) => {
    try {
      const response = await api.get('/search/', { params: searchParams });
      // Extract results from paginated response
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error searching creators:', error);
      throw error;
    }
  },
};

// Creative Fields API functions
export const creativeFieldsAPI = {
  // Get all creative fields
  getCreativeFields: async () => {
    try {
      // Get all creative fields by setting a high page size limit
      const response = await api.get('/creative-fields/', { 
        params: { page_size: 100 } // Get up to 100 fields in one request
      });
      // Extract results from paginated response
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching creative fields:', error);
      throw error;
    }
  },

  // Get creative field by ID
  getCreativeFieldById: async (id) => {
    try {
      const response = await api.get(`/creative-fields/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching creative field by ID:', error);
      throw error;
    }
  },

  // Create new creative field
  createCreativeField: async (fieldData) => {
    try {
      const response = await api.post('/creative-fields/', fieldData);
      return response.data;
    } catch (error) {
      console.error('Error creating creative field:', error);
      throw error;
    }
  },

  // Update creative field
  updateCreativeField: async (id, fieldData) => {
    try {
      const response = await api.put(`/creative-fields/${id}/`, fieldData);
      return response.data;
    } catch (error) {
      console.error('Error updating creative field:', error);
      throw error;
    }
  },

  // Delete creative field
  deleteCreativeField: async (id) => {
    try {
      const response = await api.delete(`/creative-fields/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting creative field:', error);
      throw error;
    }
  },
};

export default api; 