import http from './index';

export const list = (params) => http.get('/course', { params });
export const detail = (id) => http.get(`/course/${id}`);
export const toggleFavorite = (id) => http.post(`/course/${id}/favorite`);
export const startLearning = (id) => http.post(`/course/${id}/learn`);
export const updateProgress = (id, data) => http.put(`/course/${id}/progress`, data);
export const ratings = (id) => http.get(`/course/${id}/ratings`);
export const addRating = (id, data) => http.post(`/course/${id}/ratings`, data);