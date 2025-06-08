import { api } from './api';

export const getAdminStatus = async () => {
    const res = await api.get('/admin/status', { withCredentials: true });
    return res.data;
};

export const loginAdmin = async (username, password) => {
    const res = await api.post('/admin/login', { username, password }, { withCredentials: true });
    return res.data;
};

export const logoutAdmin = async () => {
    const res = await api.post('/admin/logout', {}, { withCredentials: true });
    return res.data;
}; 