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
        return response;
    }

}

module.exports = ApiClient;

