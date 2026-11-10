<template>
  <div class="page-container">
    <div class="flex-between mb-16">
      <h2 class="section-title">消息通知</h2>
      <el-button text type="primary" @click="markAll">全部已读</el-button>
    </div>
    <div v-loading="loading">
      <el-card v-for="n in list" :key="n.id" class="mb-12" :class="{ unread: !n.isRead }">
        <div class="flex-between">
          <h4>{{ n.title }}</h4>
          <span style="color:#909399;font-size:13px">{{ n.created_at }}</span>
        </div>
        <p style="color:#606266;margin-top:6px">{{ n.content }}</p>
        <el-button v-if="!n.isRead" text type="primary" @click="markOne(n)">标记已读</el-button>
      </el-card>
      <el-empty v-if="!loading && list.length === 0" description="暂无通知" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { list as fetchList, markRead, markAllRead } from '../../api/notification';
const list = ref([]);
const loading = ref(false);
async function load() {
  loading.value = true;
  try { const res = await fetchList(); list.value = res.data; } finally { loading.value = false; }
}
async function markOne(n) { await markRead(n.id); n.isRead = true; }
async function markAll() { await markAllRead(); list.value.forEach(n => n.isRead = true); }
onMounted(load);
</script>
<style scoped>
.unread { border-left: 3px solid #409eff; }
.mb-12 { margin-bottom: 12px; }
</style>