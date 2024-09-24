class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.requestInterceptor = null;
    this.responseInterceptor = null;
    this.errorHandler = null;
    this.abortControllers = new Map();
  }

  setHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  setErrorHandler(handler) {
    this.errorHandler = handler;
  }

  setRequestInterceptor(interceptor) {
    this.requestInterceptor = interceptor;
  }

  setResponseInterceptor(interceptor) {
    this.responseInterceptor = interceptor;
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

  cancelRequest(key) {
    if (this.abortControllers.has(key)) {
      const controller = this.abortControllers.get(key);
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  async request(endpoint, { method = 'GET', headers = {}, body, timeout = 5000, retries = 3, params = {}, cancelKey = null } = {}) {
    let config = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
    };

    // Eğer body bir FormData nesnesiyse, headers'ı otomatik olarak ayarlamayalım
    if (body instanceof FormData) {
      delete config.headers['Content-Type']; // FormData için Content-Type otomatik olarak ayarlanır
      config.body = body;
    } else if (body) {
      config.body = JSON.stringify(body);
    }

    const query = this.buildQueryParams(params);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    if (cancelKey) {
      this.abortControllers.set(cancelKey, controller);
    }

    if (this.requestInterceptor) {
      config = this.requestInterceptor(config);
    }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(this.baseURL + endpoint + query, config);
        clearTimeout(id);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }

        let responseData = await response.json();

        if (this.responseInterceptor) {
          responseData = this.responseInterceptor(responseData);
        }

        if (cancelKey) {
          this.abortControllers.delete(cancelKey);
        }

        return responseData;
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

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  head(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'HEAD' });
  }

  options(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'OPTIONS' });
  }
}

module.exports = ApiClient;