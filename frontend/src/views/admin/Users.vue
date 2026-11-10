<template>
  <div class="page-container">
    <h2 class="section-title">用户管理</h2>
    <el-input v-model="keyword" placeholder="搜索用户名/昵称" style="width:240px" class="mb-16" @keyup.enter="load">
      <template #append><el-button @click="load">搜索</el-button></template>
    </el-input>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="major" label="专业" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="roleType(row.role)">{{ roleLabel(row.role) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button text type="primary" @click="edit(row)">编辑</el-button>
          <el-button text :type="row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
          <el-button text type="danger" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showEdit" title="编辑用户" width="450px">
      <el-form label-position="top">
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="专业"><el-input v-model="form.major" /></el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role"><el-option label="学生" value="student" /><el-option label="教师" value="teacher" /><el-option label="管理员" value="admin" /></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEdit = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { users, updateUser, deleteUser } from '../../api/admin';
const list = ref([]);
const loading = ref(false);
const keyword = ref('');
const showEdit = ref(false);
const form = reactive({ id: null, nickname: '', major: '', role: 'student' });
const roleLabel = (r) => ({ student: '学生', teacher: '教师', admin: '管理员' }[r] || r);
const roleType = (r) => ({ student: '', teacher: 'warning', admin: 'danger' }[r]);
async function load() {
  loading.value = true;
  try { const res = await users({ keyword: keyword.value }); list.value = res.data.list; } finally { loading.value = false; }
}
function edit(row) { Object.assign(form, row); showEdit.value = true; }
async function save() { await updateUser(form.id, form); ElMessage.success('已保存'); showEdit.value = false; load(); }
async function toggleStatus(row) { await updateUser(row.id, { status: row.status === 1 ? 0 : 1 }); load(); }
async function del(row) {
  await ElMessageBox.confirm('确认删除该用户？', '提示', { type: 'warning' });
  await deleteUser(row.id); ElMessage.success('已删除'); load();
}
onMounted(load);
</script>