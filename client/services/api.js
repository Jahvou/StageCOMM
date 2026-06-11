import axios from 'axios';

const BASE_URL = __DEV__
    ? 'http://192.168.2.100:3000'
    : 'https://api.stagecomm.com';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
});
console.log('API BASE_URL:', BASE_URL);

// attach jwt token to each request
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;