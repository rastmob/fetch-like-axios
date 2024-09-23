// src/index.js

class ApiClient {
    constructor(baseURL) {
      this.baseURL = baseURL || '';
      this.defaultHeaders = {
        'Content-Type': 'application/json'
      };
    }
  
    setHeaders(headers) {
      this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }
  
    async request(endpoint, options = {}) {
      let config = {
        method: options.method || 'GET',
        headers: { ...this.defaultHeaders, ...options.headers }
      };
  
      if (options.body) {
        config.body = JSON.stringify(options.body);
      }
  
      const response = await fetch(this.baseURL + endpoint, config);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      return response.json();
    }
  
    get(endpoint, options = {}) {
      return this.request(endpoint, { ...options, method: 'GET' });
    }
  
    post(endpoint, body, options = {}) {
      return this.request(endpoint, { ...options, method: 'POST', body });
    }
  
    put(endpoint, body, options = {}) {
      return this.request(endpoint, { ...options, method: 'PUT', body });
    }
  
    delete(endpoint, options = {}) {
      return this.request(endpoint, { ...options, method: 'DELETE' });
    }
  }
  
  module.exports = ApiClient;
  