import http from './index';

export const list = (params) => http.get('/community', { params });
export const detail = (id) => http.get(`/community/${id}`);
export const create = (data) => http.post('/community', data);