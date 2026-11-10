<template>
  <div class="page-container">
    <div class="flex-between mb-16">
      <h2 class="section-title">学习社区</h2>
      <el-button type="primary" @click="showPost = true">发帖</el-button>
    </div>
    <el-radio-group v-model="filter.type" @change="load" class="mb-16">
      <el-radio-button value="discuss">讨论区</el-radio-button>
      <el-radio-button value="qa">问答区</el-radio-button>
    </el-radio-group>
    <div v-loading="loading">
      <el-card v-for="p in list" :key="p.id" class="post-card" shadow="hover" @click="open(p)">
        <div class="flex-between">
          <h3>{{ p.title || p.content.slice(0, 30) }}</h3>
          <el-tag size="small" :type="p.type === 'qa' ? 'warning' : ''">{{ p.type === 'qa' ? '问答' : '讨论' }}</el-tag>
        </div>
        <p class="post-content">{{ p.content }}</p>
        <p class="post-meta">{{ p.user?.nickname || '匿名' }} · {{ p.created_at }}</p>
      </el-card>
      <el-empty v-if="!loading && list.length === 0" description="暂无帖子" />
    </div>

    <el-dialog v-model="showPost" title="发帖" width="500px">
      <el-form label-position="top">
        <el-form-item label="类型">
          <el-radio-group v-model="form.type"><el-radio value="discuss">讨论</el-radio><el-radio value="qa">问答</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="form.content" type="textarea" :rows="5" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPost = false">取消</el-button>
        <el-button type="primary" @click="onPost">发布</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDetail" title="帖子详情" width="600px">
      <template v-if="current">
        <h3>{{ current.title || '帖子' }}</h3>
        <p style="color:#909399;margin:8px 0">{{ current.user?.nickname }} · {{ current.created_at }}</p>
        <p style="line-height:1.8">{{ current.content }}</p>
        <el-divider />
        <h4>回复 ({{ replies.length }})</h4>
        <div v-for="r in replies" :key="r.id" class="reply">
          <span style="font-weight:600">{{ r.user?.nickname }}：</span>{{ r.content }}
        </div>
        <el-input v-model="replyText" type="textarea" :rows="3" placeholder="写下你的回复" class="mt-16" />
        <el-button type="primary" @click="onReply" class="mt-16">回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { list as fetchList, detail as fetchDetail, create } from '../../api/community';

const list = ref([]);
const loading = ref(false);
const filter = reactive({ type: 'discuss' });
const showPost = ref(false);
const showDetail = ref(false);
const form = reactive({ type: 'discuss', title: '', content: '' });
const current = ref(null);
const replies = ref([]);
const replyText = ref('');

async function load() {
  loading.value = true;
  try {
    const res = await fetchList({ type: filter.type });
    list.value = res.data.list;
  } finally {
    loading.value = false;
  }
}
async function open(p) {
  const res = await fetchDetail(p.id);
  current.value = res.data.post;
  replies.value = res.data.replies;
  showDetail.value = true;
}
async function onPost() {
  await create(form);
  ElMessage.success('发布成功');
  showPost.value = false;
  form.title = ''; form.content = '';
  load();
}
async function onReply() {
  await create({ parentId: current.value.id, content: replyText.value, type: current.value.type, courseId: current.value.courseId });
  ElMessage.success('回复成功');
  replyText.value = '';
  const res = await fetchDetail(current.value.id);
  replies.value = res.data.replies;
}
onMounted(load);
</script>
<style scoped>
.post-card { cursor: pointer; margin-bottom: 12px; }
.post-content { color: #606266; margin: 8px 0; }
.post-meta { color: #909399; font-size: 13px; }
.reply { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
</style>