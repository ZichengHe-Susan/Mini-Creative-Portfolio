import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const creatorAPI = {
  getCreators: async (params = {}) => {
    try {
      const response = await api.get('/creators/', { params });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
  },

  getCreatorById: async (id) => {
    try {
      const response = await api.get(`/creators/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching creator by ID:', error);
      throw error;
    }
  },

  createCreator: async (creatorData) => {
    try {
      let payload = { ...creatorData };

      if (!(payload.profile_picture instanceof File)) {
        delete payload.profile_picture;
      }

      let data = payload;
      let headers = {};
      
      if (payload.profile_picture instanceof File) {
        data = new FormData();
        Object.keys(payload).forEach(key => {
          if (key === 'creative_fields' && Array.isArray(payload[key])) {
            payload[key].forEach(fieldId => {
              data.append('creative_field_ids', fieldId);
            });
          } else if (key !== 'creative_fields') { 
            data.append(key, payload[key]);
          }
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        if (payload.creative_fields) {
          data = { ...payload, creative_field_ids: payload.creative_fields };
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

  updateCreator: async (id, creatorData) => {
    try {
      let payload = { ...creatorData };

      if (!(payload.profile_picture instanceof File)) {
        delete payload.profile_picture;
      }

      let data = payload;
      let headers = {};

      if (payload.profile_picture instanceof File) {
        data = new FormData();
        Object.keys(payload).forEach(key => {
          if (key === 'creative_fields' && Array.isArray(payload[key])) {
            payload[key].forEach(fieldId => {
              data.append('creative_field_ids', fieldId);
            });
          } else if (key !== 'creative_fields') { 
            data.append(key, payload[key]);
          }
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        if (payload.creative_fields) {
          data = { ...payload, creative_field_ids: payload.creative_fields };
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

  deleteCreator: async (id) => {
    try {
      const response = await api.delete(`/creators/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting creator:', error);
      throw error;
    }
  },

  searchCreators: async (searchParams) => {
    try {
      const response = await api.get('/search/', { params: searchParams });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error searching creators:', error);
      throw error;
    }
  },
};

export const creativeFieldsAPI = {
  getCreativeFields: async () => {
    try {
      const response = await api.get('/creative-fields/', { 
        params: { page_size: 100 } 
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching creative fields:', error);
      throw error;
    }
  },

  getCreativeFieldById: async (id) => {
    try {
      const response = await api.get(`/creative-fields/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching creative field by ID:', error);
      throw error;
    }
  },

  createCreativeField: async (fieldData) => {
    try {
      const response = await api.post('/creative-fields/', fieldData);
      return response.data;
    } catch (error) {
      console.error('Error creating creative field:', error);
      throw error;
    }
  },

  updateCreativeField: async (id, fieldData) => {
    try {
      const response = await api.put(`/creative-fields/${id}/`, fieldData);
      return response.data;
    } catch (error) {
      console.error('Error updating creative field:', error);
      throw error;
    }
  },

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