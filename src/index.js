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

    buildQueryParams(params) {
        const queryString = new URLSearchParams(params).toString();
        return queryString ? `?${queryString}` : '';
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
                    throw error;
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
