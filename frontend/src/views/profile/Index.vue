<template>
  <div class="page-container">
    <h2 class="section-title">个人中心</h2>
    <el-row :gutter="20">
      <el-col :xs="24" :md="8">
        <el-card class="mb-16">
          <template #header><span class="section-title">个人信息</span></template>
          <el-form label-position="top">
            <el-form-item label="昵称"><el-input v-model="profile.nickname" /></el-form-item>
            <el-form-item label="头像URL"><el-input v-model="profile.avatar" /></el-form-item>
            <el-form-item label="专业"><el-input v-model="profile.major" /></el-form-item>
            <el-form-item label="邮箱"><el-input v-model="profile.email" /></el-form-item>
            <el-form-item label="手机号"><el-input v-model="profile.phone" /></el-form-item>
            <el-button type="primary" @click="saveProfile">保存</el-button>
          </el-form>
        </el-card>
        <el-card>
          <template #header><span class="section-title">修改密码</span></template>
          <el-form label-position="top">
            <el-form-item label="原密码"><el-input v-model="pwd.oldPassword" type="password" show-password /></el-form-item>
            <el-form-item label="新密码"><el-input v-model="pwd.newPassword" type="password" show-password /></el-form-item>
            <el-button type="primary" @click="savePwd">修改</el-button>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="16">
        <el-tabs v-model="tab">
          <el-tab-pane label="我的课程" name="courses">
            <el-table :data="courses" stripe>
              <el-table-column prop="Course.title" label="课程" />
              <el-table-column prop="progress" label="进度" width="120">
                <template #default="{ row }"><el-progress :percentage="row.progress" /></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="我的收藏" name="favorites">
            <el-table :data="favCourses" stripe>
              <el-table-column prop="Course.title" label="课程" />
            </el-table>
            <el-table :data="favJobs" stripe class="mt-16">
              <el-table-column prop="Job.title" label="职位" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="我的订单" name="orders">
            <el-table :data="orders" stripe>
              <el-table-column prop="orderNo" label="订单号" width="200" />
              <el-table-column prop="Course.title" label="课程" />
              <el-table-column prop="amount" label="金额" width="100" />
              <el-table-column prop="status" label="状态" width="100" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';
import { updateProfile, updatePassword, myCourses, myFavorites, myOrders } from '../../api/user';

const userStore = useUserStore();
const tab = ref('courses');
const profile = reactive({ nickname: '', avatar: '', major: '', email: '', phone: '' });
const pwd = reactive({ oldPassword: '', newPassword: '' });
const courses = ref([]);
const favCourses = ref([]);
const favJobs = ref([]);
const orders = ref([]);

async function saveProfile() {
  await updateProfile(profile);
  await userStore.fetchMe();
  ElMessage.success('保存成功');
}
async function savePwd() {
  await updatePassword(pwd);
  ElMessage.success('修改成功');
  pwd.oldPassword = ''; pwd.newPassword = '';
}
onMounted(async () => {
  Object.assign(profile, userStore.user || {});
  const [c, f, o] = await Promise.all([myCourses(), myFavorites(), myOrders()]);
  courses.value = c.data;
  favCourses.value = f.data.courses;
  favJobs.value = f.data.jobs;
  orders.value = o.data;
});
</script>