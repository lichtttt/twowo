import http from './index';

export const list = (params) => http.get('/job', { params });
export const detail = (id) => http.get(`/job/${id}`);
export const toggleFavorite = (id) => http.post(`/job/${id}/favorite`);
export const apply = (id, data) => http.post(`/job/${id}/apply`, data);
export const aiInterview = (id, data) => http.post(`/job/${id}/ai-interview`, data);