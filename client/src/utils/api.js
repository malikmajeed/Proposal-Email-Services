// API Configuration and Interceptor
const API_BASE_URL = 'https://blue-wolf-proposal-gen-backend.vercel.app';

// Default headers
const getDefaultHeaders = () => {
  const token = localStorage.getItem('bluewolf_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getDefaultHeaders(),
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses (like PDF downloads)
    if (response.headers.get('content-type')?.includes('application/pdf')) {
      return response;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Specific API methods
export const authAPI = {
  login: (credentials) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    
  logout: () => 
    apiRequest('/api/auth/logout', {
      method: 'POST'
    }),
    
  verify: () => 
    apiRequest('/api/auth/verify', {
      method: 'GET'
    })
};

export const proposalAPI = {
  generate: (proposalData) => 
    apiRequest('/api/generate-proposal', {
      method: 'POST',
      body: JSON.stringify(proposalData)
    })
};

export default {
  API_BASE_URL,
  apiRequest,
  authAPI,
  proposalAPI
};
