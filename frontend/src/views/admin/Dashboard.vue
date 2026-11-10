<template>
  <div class="page-container">
    <h2 class="section-title">管理概览</h2>
    <el-row :gutter="16">
      <el-col :xs="12" :md="6"><el-card><el-statistic title="用户总数" :value="stats.users" /></el-card></el-col>
      <el-col :xs="12" :md="6"><el-card><el-statistic title="课程总数" :value="stats.courses" /></el-card></el-col>
      <el-col :xs="12" :md="6"><el-card><el-statistic title="职位总数" :value="stats.jobs" /></el-card></el-col>
      <el-col :xs="12" :md="6"><el-card><el-statistic title="订单总数" :value="stats.orders" /></el-card></el-col>
    </el-row>
    <el-card class="mt-16">
      <template #header><span class="section-title">快捷入口</span></template>
      <el-button v-for="m in menus" :key="m.path" @click="$router.push(m.path)" class="mr-12 mb-12">{{ m.label }}</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { users, courses, jobs, orders } from '../../api/admin';
const stats = ref({ users: 0, courses: 0, jobs: 0, orders: 0 });
const menus = [
  { path: '/admin/users', label: '用户管理' },
  { path: '/admin/courses', label: '课程上下架' },
  { path: '/admin/jobs', label: '职位上下架' },
  { path: '/admin/orders', label: '订单管理' },
  { path: '/admin/applications', label: '申请管理' },
];
onMounted(async () => {
  const [u, c, j, o] = await Promise.all([
    users({ pageSize: 1 }), courses({ pageSize: 1 }), jobs({ pageSize: 1 }), orders({ pageSize: 1 }),
  ]);
  stats.value = { users: u.data.total, courses: c.data.total, jobs: j.data.total, orders: o.data.total };
});
</script>
<style scoped>
.mr-12 { margin-right: 12px; }
.mb-12 { margin-bottom: 12px; }
</style>