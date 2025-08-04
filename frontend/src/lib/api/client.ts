import ky from 'ky';

// Create the main API client
export const api = ky.create({
  prefixUrl: '/api',
  timeout: 30000,
  credentials: 'include', // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// For now, we use the basic client since error handling is done via resolveRequest
export const apiWithErrorHandling = api;

export default api;
