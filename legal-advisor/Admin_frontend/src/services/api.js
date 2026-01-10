import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend taking too long');
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

// Document APIs
export const documentAPI = {
  list: (folder) => api.get('/documents', { params: { folder } }),
  upload: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (filename, folder) => api.delete('/documents', { data: { filename, folder } }),
};

// Reprocess API
export const reprocessAPI = {
  reprocess: (filename, folder, chunk_config) => 
    api.post('/reprocess', { filename, folder, chunk_config }),
};

// Config APIs
export const configAPI = {
  getAll: () => api.get('/config'),
  getChunkConfig: () => api.get('/config/chunking'),
  updateChunkConfig: (config) => api.put('/config/chunking', config),
  getEmbeddingConfig: () => api.get('/config/embedding'),
  updateEmbeddingConfig: (config) => api.put('/config/embedding', config),
  getRetrievalConfig: () => api.get('/config/retrieval'),
  updateRetrievalConfig: (config) => api.put('/config/retrieval', config),
};

// Vector Store APIs
export const vectorStoreAPI = {
  stats: () => api.get('/vectorstore/stats'),
  search: (searchRequest) => 
    api.post('/vectorstore/search', searchRequest),
  rebuild: (rebuildRequest) => 
    api.post('/vectorstore/rebuild', rebuildRequest),
  getRebuildStatus: (job_id) => api.get(`/vectorstore/rebuild/${job_id}`),
  clear: (clearRequest) => api.delete('/vectorstore/clear', { data: clearRequest }),
};

// System APIs
export const systemAPI = {
  health: () => api.get('/health'),
};

export default api;
