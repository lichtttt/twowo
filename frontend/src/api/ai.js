import http from './index';

export const chat = (data) => http.post('/ai/chat', data);
export const conversations = () => http.get('/ai/conversations');
export const conversationDetail = (id) => http.get(`/ai/conversations/${id}`);
export const learningPath = (data) => http.post('/ai/learning-path', data);
export const grade = (data) => http.post('/ai/grade', data);
export const report = (params) => http.get('/ai/report', { params });