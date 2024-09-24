class ApiClient {
    constructor(baseURL) {
      this.baseURL = baseURL || '';
      this.defaultHeaders = {
        'Content-Type': 'application/json'
      };
      this.errorHandler = null;
    }
  
    setHeaders(headers) {
      this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }
  
    setErrorHandler(handler) {
      this.errorHandler = handler;
    }
  
    buildQueryParams(params) {
      const queryString = new URLSearchParams(params).toString();
      return queryString ? `?${queryString}` : '';
    }
  
    async handleError(error) {
      if (this.errorHandler) {
        this.errorHandler(error);
      }
      throw error;
    }
  
    async request(endpoint, { method = 'GET', headers = {}, body, timeout = 5000, retries = 3, params = {} } = {}) {
      const config = {
        method,
        headers: { ...this.defaultHeaders, ...headers },
      };
  
      if (body) {
        config.body = JSON.stringify(body);
      }
  
      const query = this.buildQueryParams(params);
  
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      config.signal = controller.signal;
  
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(this.baseURL + endpoint + query, config);
          clearTimeout(id);
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
          }
  
          return response.json();
        } catch (error) {
          if (i === retries - 1 || error.name === 'AbortError') {
            await this.handleError(error);
          }
        }
      }
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
  