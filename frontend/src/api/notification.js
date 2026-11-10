import http from './index';

export const list = () => http.get('/notification');
export const markRead = (id) => http.put(`/notification/${id}/read`);
export const markAllRead = () => http.put('/notification/all/read');