<template>
  <div class="page-container">
    <h2 class="section-title">课程管理</h2>
    <div class="flex-between mb-16">
      <el-select v-model="status" placeholder="状态" clearable @change="load" style="width:160px">
        <el-option label="已上架" :value="1" /><el-option label="已下架" :value="0" />
      </el-select>
      <el-button type="primary" @click="openEdit()">新增课程</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="课程名称" />
      <el-table-column prop="instructor.name" label="讲师" width="100" />
      <el-table-column label="体系" width="100">
        <template #default="{ row }">{{ sysLabel(row.techSystem) }}</template>
      </el-table-column>
      <el-table-column label="方向" width="100">
        <template #default="{ row }">{{ dirLabel(row.techDirection) }}</template>
      </el-table-column>
      <el-table-column prop="difficulty" label="等级" width="70" />
      <el-table-column label="免费" width="70">
        <template #default="{ row }">{{ row.isFree ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="studentCount" label="学习人数" width="90" />
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

    <el-dialog v-model="showEdit" :title="form.id ? '编辑课程' : '新增课程'" width="600px">
      <el-form label-position="top">
        <el-form-item label="课程名称"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-row :gutter="12">
          <el-col :span="8"><el-form-item label="技术体系">
            <el-select v-model="form.techSystem"><el-option label="理论" value="theory" /><el-option label="实训" value="practice" /><el-option label="认证" value="cert" /></el-select>
          </el-form-item></el-col>
          <el-col :span="8"><el-form-item label="技术方向">
            <el-select v-model="form.techDirection"><el-option label="AI" value="ai" /><el-option label="大数据" value="bigdata" /><el-option label="云计算" value="cloud" /><el-option label="Web" value="web" /><el-option label="移动" value="mobile" /><el-option label="其他" value="other" /></el-select>
          </el-form-item></el-col>
          <el-col :span="8"><el-form-item label="难度"><el-input-number v-model="form.difficulty" :min="1" :max="5" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="是否免费"><el-switch v-model="form.isFree" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="价格"><el-input-number v-model="form.price" :min="0" :disabled="form.isFree" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="讲师ID"><el-input v-model="form.instructorId" /></el-form-item>
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
import { courses, setCourseStatus, saveCourse, updateCourse } from '../../api/admin';
const list = ref([]);
const loading = ref(false);
const status = ref('');
const showEdit = ref(false);
const form = reactive({ id: null, title: '', description: '', techSystem: 'theory', techDirection: 'ai', difficulty: 1, isFree: true, price: 0, instructorId: '' });
const sysLabel = (s) => ({ theory: '理论', practice: '实训', cert: '认证' }[s] || s);
const dirLabel = (d) => ({ ai: 'AI', bigdata: '大数据', cloud: '云计算', web: 'Web', mobile: '移动', other: '其他' }[d] || d);
async function load() {
  loading.value = true;
  try { const res = await courses({ status: status.value }); list.value = res.data.list; } finally { loading.value = false; }
}
function openEdit(row) {
  Object.assign(form, row || { id: null, title: '', description: '', techSystem: 'theory', techDirection: 'ai', difficulty: 1, isFree: true, price: 0, instructorId: '' });
  showEdit.value = true;
}
async function save() {
  const data = { ...form, instructorId: form.instructorId ? Number(form.instructorId) : null };
  if (form.id) { await updateCourse(form.id, data); } else { await saveCourse(data); }
  ElMessage.success('已保存'); showEdit.value = false; load();
}
async function toggle(row) { await setCourseStatus(row.id, { status: row.status === 1 ? 0 : 1 }); load(); }
onMounted(load);
</script>