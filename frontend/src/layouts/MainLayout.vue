<template>
  <el-container class="main-layout">
    <el-header class="header">
      <div class="header-inner">
        <div class="logo" @click="$router.push('/course')">
          <el-icon :size="24"><School /></el-icon>
          <span>智慧教育平台</span>
        </div>
        <el-menu :default-active="activeMenu" mode="horizontal" router class="nav-menu hide-mobile" :ellipsis="false">
          <el-menu-item index="/course">课程中心</el-menu-item>
          <el-menu-item index="/job">实习就业</el-menu-item>
          <el-sub-menu index="/ai">
            <template #title>AI 学习助手</template>
            <el-menu-item index="/ai">智能答疑</el-menu-item>
            <el-menu-item index="/ai/path">学习路径</el-menu-item>
            <el-menu-item index="/ai/grade">作业批改</el-menu-item>
            <el-menu-item index="/ai/report">学习报告</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/community">学习社区</el-menu-item>
        </el-menu>
        <div class="header-right">
          <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="mr-12">
            <el-icon :size="20" class="clickable" @click="$router.push('/notifications')"><Bell /></el-icon>
          </el-badge>
          <el-dropdown v-if="userStore.isLogin" @command="onCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.user?.avatar">{{ userStore.user?.nickname?.[0] }}</el-avatar>
              <span class="hide-mobile">{{ userStore.user?.nickname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="admin" v-if="userStore.isAdmin">后台管理</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-else type="primary" @click="$router.push('/login')">登录</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="main-content">
      <router-view />
    </el-main>
    <el-footer class="footer hide-mobile">
      智慧教育平台 © 2026 · 面向教育平台的智能体开发
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { list as fetchNotifications } from '../api/notification';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const unreadCount = ref(0);

const activeMenu = computed(() => route.path);

function onCommand(cmd) {
  if (cmd === 'profile') router.push('/profile');
  else if (cmd === 'admin') router.push('/admin');
  else if (cmd === 'logout') {
    userStore.logout();
    router.push('/login');
  }
}

onMounted(async () => {
  if (userStore.isLogin) {
    try {
      const res = await fetchNotifications();
      unreadCount.value = (res.data || []).filter((n) => !n.isRead).length;
    } catch (e) {}
  }
});
</script>

<style scoped>
.main-layout { min-height: 100vh; }
.header { background: #fff; border-bottom: 1px solid #e4e7ed; height: 60px; padding: 0; position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; height: 60px; gap: 24px; }
.logo { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; color: #409eff; cursor: pointer; white-space: nowrap; }
.nav-menu { flex: 1; border-bottom: none !important; }
.header-right { display: flex; align-items: center; gap: 12px; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.clickable { cursor: pointer; }
.mr-12 { margin-right: 12px; }
.main-content { padding: 0; min-height: calc(100vh - 120px); }
.footer { text-align: center; color: #909399; font-size: 13px; }
@media (max-width: 768px) {
  .header-inner { gap: 12px; }
  .logo span { font-size: 15px; }
}
</style>