// API Configuration
// For production, update this to your backend URL
// Example: const API_BASE_URL = 'https://your-app.railway.app/api';
const API_BASE_URL = window.location.origin + '/api';

// Helper function to get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function to set auth token in localStorage
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Helper function to remove auth token
function removeAuthToken() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

// Helper function to get user from localStorage
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Helper function to set user in localStorage
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Authentication API calls
const authAPI = {
  async register(userData) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(email, password, userId, role) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userId, role })
    });
  },

  async verify() {
    return await apiRequest('/auth/verify');
  }
};

// Complaints API calls (for students)
const complaintsAPI = {
  async getMyComplaints() {
    return await apiRequest('/complaints/my-complaints');
  },

  async createComplaint(complaintData) {
    return await apiRequest('/complaints/create', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    });
  },

  async getComplaint(id) {
    return await apiRequest(`/complaints/${id}`);
  }
};

// Admin API calls
const adminAPI = {
  async getAllComplaints(status = 'all') {
    const query = status !== 'all' ? `?status=${status}` : '';
    return await apiRequest(`/admin/complaints${query}`);
  },

  async getStats() {
    return await apiRequest('/admin/stats');
  },

  async getComplaint(id) {
    return await apiRequest(`/admin/complaints/${id}`);
  },

  async updateStatus(id, status, adminNotes) {
    return await apiRequest(`/admin/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes })
    });
  },

  async resolveComplaint(id, adminNotes) {
    return await apiRequest(`/admin/complaints/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes })
    });
  }
};

// Export API functions
window.apiRequest = apiRequest;
window.authAPI = authAPI;
window.complaintsAPI = complaintsAPI;
window.adminAPI = adminAPI;
window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.removeAuthToken = removeAuthToken;
window.getUser = getUser;
window.setUser = setUser;

