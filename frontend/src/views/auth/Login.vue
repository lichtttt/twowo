<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <el-icon :size="36" color="#409eff"><School /></el-icon>
        <h2>智慧教育平台</h2>
        <p>登录你的账号</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="onLogin">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" :prefix-icon="Lock" size="large" @keyup.enter="onLogin" />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" style="width:100%" @click="onLogin">登 录</el-button>
        <div class="auth-footer">
          <router-link to="/register">没有账号？去注册</router-link>
          <el-link type="primary" @click="showReset = true">忘记密码</el-link>
        </div>
      </el-form>
      <el-alert type="info" :closable="false" class="demo-tip">
        演示账号：admin/admin123、teacher/teacher123、student/student123
      </el-alert>
    </div>

    <el-dialog v-model="showReset" title="密码重置" width="400px">
      <el-form :model="resetForm" label-position="top">
        <el-form-item label="用户名"><el-input v-model="resetForm.username" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="resetForm.email" /></el-form-item>
        <el-form-item label="新密码"><el-input v-model="resetForm.newPassword" type="password" show-password /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReset = false">取消</el-button>
        <el-button type="primary" @click="onReset">重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '../../stores/user';
import { login, resetPassword } from '../../api/auth';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref();
const loading = ref(false);
const showReset = ref(false);
const form = reactive({ username: '', password: '' });
const resetForm = reactive({ username: '', email: '', newPassword: '' });
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

async function onLogin() {
  await formRef.value.validate();
  loading.value = true;
  try {
    const res = await login(form);
    userStore.setAuth(res.data.token, res.data.user);
    ElMessage.success('登录成功');
    router.push(userStore.isAdmin ? '/admin' : '/course');
  } finally {
    loading.value = false;
  }
}

async function onReset() {
  await resetPassword(resetForm);
  ElMessage.success('密码重置成功');
  showReset.value = false;
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; }
.auth-card { background: #fff; border-radius: 12px; padding: 36px; width: 100%; max-width: 420px; box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
.auth-header { text-align: center; margin-bottom: 24px; }
.auth-header h2 { margin: 12px 0 4px; }
.auth-header p { color: #909399; font-size: 14px; }
.auth-footer { display: flex; justify-content: space-between; margin-top: 16px; font-size: 14px; }
.demo-tip { margin-top: 16px; }
</style>