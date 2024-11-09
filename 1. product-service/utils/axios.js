const axios = require('axios');

class Axios {
    constructor(baseURL, headers = {}) {

        if(!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        this.client = axios.create({
            baseURL,
            headers,
            timeout: 10000,
        });

        this.client.interceptors.request.use(
            config => {
            return config;
            },
            error => {
            return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            response => response,
            error => {
                // Handle response error
                if (error.response) {
                    console.error('Error status', error.response.status);
                    console.error('Error data', error.response.data);
                } else {
                    console.error('Error message', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    // GET request
    async get(url, params = {}, config = {}) {
        try {
            const response = await this.client.get(url, { params, ...config });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // POST request
    async post(url, data = {}, config = {}) {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // PUT request
    async put(url, data = {}, config = {}) {
        try {
            const response = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // DELETE request
    async delete(url, config = {}) {
        try {
            const response = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // PATCH request
    async patch(url, data = {}, config = {}) {
        try {
            const response = await this.client.patch(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Axios;
