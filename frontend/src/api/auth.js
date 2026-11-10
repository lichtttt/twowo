import http from './index';

export const register = (data) => http.post('/auth/register', data);
export const login = (data) => http.post('/auth/login', data);
export const resetPassword = (data) => http.post('/auth/reset-password', data);
export const me = () => http.get('/auth/me');