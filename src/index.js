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

}

module.exports = ApiClient;

  