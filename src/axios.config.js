import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL:  'http://localhost:2000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                await axios.post(
                    `${'http://localhost:2000'}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;