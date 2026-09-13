import api from '../../lib/axios';

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
};