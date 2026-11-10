import http from './index';

export const updateProfile = (data) => http.put('/user/profile', data);
export const updatePassword = (data) => http.put('/user/password', data);
export const myCourses = () => http.get('/user/courses');
export const myFavorites = () => http.get('/user/favorites');
export const myOrders = () => http.get('/user/orders');