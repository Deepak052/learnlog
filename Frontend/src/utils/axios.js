import axios from 'axios';
import { Backend_URL } from './constant';

const API = axios.create({
    baseURL: `${Backend_URL}`,
    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;