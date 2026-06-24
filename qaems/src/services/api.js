const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const getHeaders = (options = {}) => {
  const token = localStorage.getItem("qaems_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getHeaders(options);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      let json = {};
      try {
        json = await response.json();
      } catch (e) {
        // Handle non-JSON responses
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("qaems_token");
          localStorage.removeItem("qaems_user");
        }
        throw new Error(json.message || json.errors?.[0] || `Request failed with status ${response.status}`);
      }
      
      // Return the data property if present, otherwise the full json
      return json.data !== undefined ? json.data : json;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },

  get: (endpoint, options = {}) => api.request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => api.request(endpoint, { ...options, method: "DELETE" }),
};
