import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/auth/Login.vue'), meta: { guest: true } },
  { path: '/register', name: 'Register', component: () => import('../views/auth/Register.vue'), meta: { guest: true } },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/course' },
      { path: 'course', name: 'CourseList', component: () => import('../views/courses/CourseList.vue') },
      { path: 'course/:id', name: 'CourseDetail', component: () => import('../views/courses/CourseDetail.vue') },
      { path: 'job', name: 'JobList', component: () => import('../views/jobs/JobList.vue') },
      { path: 'job/:id', name: 'JobDetail', component: () => import('../views/jobs/JobDetail.vue') },
      { path: 'ai', name: 'AiAssistant', component: () => import('../views/ai/Assistant.vue') },
      { path: 'ai/path', name: 'AiPath', component: () => import('../views/ai/LearningPath.vue') },
      { path: 'ai/grade', name: 'AiGrade', component: () => import('../views/ai/Grade.vue') },
      { path: 'ai/report', name: 'AiReport', component: () => import('../views/ai/Report.vue') },
      { path: 'community', name: 'Community', component: () => import('../views/community/Index.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../views/profile/Index.vue') },
      { path: 'notifications', name: 'Notifications', component: () => import('../views/notifications/Index.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requireAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/Users.vue') },
      { path: 'orders', name: 'AdminOrders', component: () => import('../views/admin/Orders.vue') },
      { path: 'courses', name: 'AdminCourses', component: () => import('../views/admin/Courses.vue') },
      { path: 'jobs', name: 'AdminJobs', component: () => import('../views/admin/Jobs.vue') },
      { path: 'applications', name: 'AdminApplications', component: () => import('../views/admin/Applications.vue') },
    ],
  },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const userStore = useUserStore();
  if (to.meta.requireAdmin && !userStore.isAdmin) return '/login';
  if (to.meta.guest && userStore.isLogin) return '/course';
  return true;
});

export default router;