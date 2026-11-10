<template>
  <div class="page-container">
    <h2 class="section-title">职位管理</h2>
    <div class="flex-between mb-16">
      <el-select v-model="status" placeholder="状态" clearable @change="load" style="width:160px">
        <el-option label="已上架" :value="1" /><el-option label="已下架" :value="0" />
      </el-select>
      <el-button type="primary" @click="openEdit()">新增职位</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="职位名称" />
      <el-table-column prop="company.name" label="公司" width="120" />
      <el-table-column prop="category" label="分类" width="90" />
      <el-table-column label="薪资" width="120">
        <template #default="{ row }">{{ row.salaryMin }}-{{ row.salaryMax }}K</template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="80" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }"><el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '上架' : '下架' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button text type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button text :type="row.status === 1 ? 'warning' : 'success'" @click="toggle(row)">{{ row.status === 1 ? '下架' : '上架' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showEdit" :title="form.id ? '编辑职位' : '新增职位'" width="600px">
      <el-form label-position="top">
        <el-form-item label="职位名称"><el-input v-model="form.title" /></el-form-item>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="公司ID"><el-input v-model="form.companyId" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="分类"><el-input v-model="form.category" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8"><el-form-item label="最低薪资(K)"><el-input-number v-model="form.salaryMin" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="最高薪资(K)"><el-input-number v-model="form.salaryMax" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="城市"><el-input v-model="form.city" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="职位描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="任职要求"><el-input v-model="form.requirements" type="textarea" :rows="3" /></el-form-item>
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
import { ElMessage } from 'element-plus';
import { jobs, setJobStatus, saveJob, updateJob } from '../../api/admin';
const list = ref([]);
const loading = ref(false);
const status = ref('');
const showEdit = ref(false);
const form = reactive({ id: null, title: '', companyId: '', category: '', salaryMin: 0, salaryMax: 0, city: '', description: '', requirements: '' });
async function load() {
  loading.value = true;
  try { const res = await jobs({ status: status.value }); list.value = res.data.list; } finally { loading.value = false; }
}
function openEdit(row) {
  Object.assign(form, row || { id: null, title: '', companyId: '', category: '', salaryMin: 0, salaryMax: 0, city: '', description: '', requirements: '' });
  showEdit.value = true;
}
async function save() {
  const data = { ...form, companyId: Number(form.companyId) };
  if (form.id) { await updateJob(form.id, data); } else { await saveJob(data); }
  ElMessage.success('已保存'); showEdit.value = false; load();
}
async function toggle(row) { await setJobStatus(row.id, { status: row.status === 1 ? 0 : 1 }); load(); }
onMounted(load);
</script>