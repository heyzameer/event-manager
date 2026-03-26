// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (request) => {

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => {

        return response.data;
    },
    (error) => {

        const customError = new Error();
        customError.message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        customError.status = error.response?.status || 500;

        toast.error(customError.message);

        console.error(`[API Error ${customError.status}]:`, customError.message);

        return Promise.reject(customError);
    }
);

export default api;
