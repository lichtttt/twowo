<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '210px'" class="aside">
      <div class="aside-logo">
        <el-icon :size="22"><Setting /></el-icon>
        <span v-show="!isCollapse">后台管理</span>
      </div>
      <el-menu :default-active="activeMenu" router :collapse="isCollapse" class="aside-menu">
        <el-menu-item index="/admin"><el-icon><DataLine /></el-icon><span>概览</span></el-menu-item>
        <el-menu-item index="/admin/users"><el-icon><User /></el-icon><span>用户管理</span></el-menu-item>
        <el-menu-item index="/admin/orders"><el-icon><List /></el-icon><span>订单管理</span></el-menu-item>
        <el-menu-item index="/admin/courses"><el-icon><Reading /></el-icon><span>课程管理</span></el-menu-item>
        <el-menu-item index="/admin/jobs"><el-icon><Briefcase /></el-icon><span>职位管理</span></el-menu-item>
        <el-menu-item index="/admin/applications"><el-icon><Document /></el-icon><span>申请管理</span></el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <el-icon class="clickable" @click="isCollapse = !isCollapse"><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
        <el-button text @click="$router.push('/course')"><el-icon><Back /></el-icon> 返回前台</el-button>
        <div style="flex:1"></div>
        <span>{{ userStore.user?.nickname }}</span>
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';

const route = useRoute();
const userStore = useUserStore();
const isCollapse = ref(window.innerWidth < 768);
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.admin-layout { height: 100vh; }
.aside { background: #001529; transition: width 0.3s; }
.aside-logo { height: 60px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #fff; font-size: 16px; font-weight: 600; }
.aside-menu { border-right: none; background: #001529; }
.aside-menu :deep(.el-menu-item) { color: #bfcbd9; }
.aside-menu :deep(.el-menu-item.is-active) { color: #fff; background: #409eff; }
.admin-header { display: flex; align-items: center; gap: 16px; background: #fff; border-bottom: 1px solid #e4e7ed; }
.admin-main { background: #f5f7fa; }
.clickable { cursor: pointer; }
</style>