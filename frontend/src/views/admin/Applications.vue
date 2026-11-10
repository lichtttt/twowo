<template>
  <div class="page-container">
    <h2 class="section-title">申请管理</h2>
    <el-select v-model="status" placeholder="申请状态" clearable @change="load" class="mb-16">
      <el-option label="已申请" value="applied" /><el-option label="面试中" value="interview" /><el-option label="Offer" value="offer" /><el-option label="已拒绝" value="rejected" />
    </el-select>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="User.username" label="申请人" />
      <el-table-column prop="Job.title" label="职位" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }"><el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="aiInterviewScore" label="AI面试分" width="100" />
      <el-table-column prop="created_at" label="申请时间" width="180" />
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button text type="success" @click="set(row, 'offer')">发Offer</el-button>
          <el-button text type="warning" @click="set(row, 'interview')">面试中</el-button>
          <el-button text type="danger" @click="set(row, 'rejected')">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showFeedback" title="AI 面试反馈" width="600px">
      <div class="markdown-body" v-if="current">{{ current.aiInterviewFeedback || '暂无反馈' }}</div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { applications, updateApplication } from '../../api/admin';
const list = ref([]);
const loading = ref(false);
const status = ref('');
const showFeedback = ref(false);
const current = ref(null);
const statusLabel = (s) => ({ applied: '已申请', interview: '面试中', offer: 'Offer', rejected: '已拒绝' }[s] || s);
const statusType = (s) => ({ applied: 'info', interview: 'warning', offer: 'success', rejected: 'danger' }[s]);
async function load() {
  loading.value = true;
  try { const res = await applications({ status: status.value }); list.value = res.data.list; } finally { loading.value = false; }
}
async function set(row, s) { await updateApplication(row.id, { status: s }); ElMessage.success('已更新'); load(); }
onMounted(load);
</script>