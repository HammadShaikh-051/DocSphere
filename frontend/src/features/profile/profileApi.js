import api from '../../lib/axios';

export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.put('/users/me/password', data);
    return response.data;
};