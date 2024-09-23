class ApiClient {
    constructor(baseURL) {
      this.baseURL = baseURL || '';
      this.defaultHeaders = {
        'Content-Type': 'application/json'
      };
    }
}
  