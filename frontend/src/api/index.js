import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';
import router from '../router';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 60000,
});

instance.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (resp) => {
    const data = resp.data;
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 0) return data;
      ElMessage.error(data.message || '请求失败');
      return Promise.reject(data);
    }
    return { code: 0, data };
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      router.push('/login');
      ElMessage.error('请先登录');
    } else {
      ElMessage.error(err.response?.data?.message || err.message || '网络错误');
    }
    return Promise.reject(err);
  }
);

export default instance;