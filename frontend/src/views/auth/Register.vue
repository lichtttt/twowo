<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <el-icon :size="36" color="#409eff"><School /></el-icon>
        <h2>注册账号</h2>
        <p>加入智慧教育平台</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="专业"><el-input v-model="form.major" placeholder="如：计算机科学" /></el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio value="student">学生</el-radio>
            <el-radio value="teacher">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" style="width:100%" @click="onRegister">注 册</el-button>
        <div class="auth-footer"><router-link to="/login">已有账号？去登录</router-link></div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';
import { register } from '../../api/auth';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref();
const loading = ref(false);
const form = reactive({ username: '', password: '', nickname: '', email: '', phone: '', major: '', role: 'student' });
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '至少6位', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

async function onRegister() {
  await formRef.value.validate();
  loading.value = true;
  try {
    const res = await register(form);
    userStore.setAuth(res.data.token, res.data.user);
    ElMessage.success('注册成功');
    router.push('/course');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; }
.auth-card { background: #fff; border-radius: 12px; padding: 36px; width: 100%; max-width: 420px; box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
.auth-header { text-align: center; margin-bottom: 24px; }
.auth-header h2 { margin: 12px 0 4px; }
.auth-header p { color: #909399; font-size: 14px; }
.auth-footer { text-align: center; margin-top: 16px; font-size: 14px; }
</style>