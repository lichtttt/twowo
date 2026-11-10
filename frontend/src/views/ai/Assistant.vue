<template>
  <div class="ai-page">
    <div class="ai-sidebar hide-mobile">
      <div class="flex-between px-16 py-12">
        <span style="font-weight:600">会话列表</span>
        <el-button text type="primary" @click="newChat"><el-icon><Plus /></el-icon></el-button>
      </div>
      <div v-for="c in conversations" :key="c.id" class="conv-item" :class="{ active: c.id === currentId }" @click="loadConv(c.id)">
        <span class="text-ellipsis">{{ c.title }}</span>
      </div>
      <el-empty v-if="conversations.length === 0" description="暂无会话" :image-size="50" />
    </div>
    <div class="ai-main">
      <div class="ai-header">
        <h3>AI 智能答疑</h3>
        <span v-if="courseName" class="course-tag">当前课程：{{ courseName }}</span>
      </div>
      <div class="chat-box" ref="chatBox">
        <div v-for="m in messages" :key="m.id" class="msg" :class="m.role">
          <el-avatar :size="32" v-if="m.role === 'assistant'">AI</el-avatar>
          <div class="bubble">
            <div v-if="m.role === 'assistant'" class="markdown-body" v-html="renderMd(m.content)"></div>
            <div v-else>{{ m.content }}</div>
          </div>
          <el-avatar :size="32" v-if="m.role === 'user'">{{ userStore.user?.nickname?.[0] || '我' }}</el-avatar>
        </div>
        <el-empty v-if="messages.length === 0" description="向 AI 提问吧，支持多轮对话" />
      </div>
      <div class="input-box">
        <el-input v-model="input" type="textarea" :rows="2" placeholder="输入你的问题..." @keydown.enter.ctrl="send" />
        <el-button type="primary" :loading="sending" @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import { useUserStore } from '../../stores/user';
import { chat, conversations as fetchConvs, conversationDetail } from '../../api/ai';
import { detail as courseDetail } from '../../api/course';

const route = useRoute();
const userStore = useUserStore();
const conversations = ref([]);
const messages = ref([]);
const currentId = ref(null);
const input = ref('');
const sending = ref(false);
const chatBox = ref();
const courseId = ref(route.query.courseId ? Number(route.query.courseId) : null);
const courseName = ref('');

function renderMd(text) {
  try { return marked(text || ''); } catch (e) { return text; }
}

async function loadConvs() {
  const res = await fetchConvs();
  conversations.value = res.data;
}
function newChat() {
  currentId.value = null;
  messages.value = [];
}
async function loadConv(id) {
  currentId.value = id;
  const res = await conversationDetail(id);
  messages.value = res.data.messages;
  scrollBottom();
}
async function send() {
  if (!input.value.trim()) return;
  const msg = input.value;
  input.value = '';
  messages.value.push({ id: Date.now(), role: 'user', content: msg });
  sending.value = true;
  try {
    const res = await chat({ conversationId: currentId.value, message: msg, courseId: courseId.value });
    currentId.value = res.data.conversationId;
    messages.value.push({ id: Date.now() + 1, role: 'assistant', content: res.data.reply });
    loadConvs();
    scrollBottom();
  } finally {
    sending.value = false;
  }
}
function scrollBottom() {
  nextTick(() => { if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight; });
}
watch(() => route.query.courseId, async (v) => {
  if (v) {
    courseId.value = Number(v);
    const res = await courseDetail(v);
    courseName.value = res.data.course.title;
  }
});
onMounted(async () => {
  loadConvs();
  if (courseId.value) {
    const res = await courseDetail(courseId.value);
    courseName.value = res.data.course.title;
  }
});
</script>

<style scoped>
.ai-page { display: flex; height: calc(100vh - 60px); }
.ai-sidebar { width: 240px; background: #fff; border-right: 1px solid #e4e7ed; overflow-y: auto; }
.px-16 { padding: 0 16px; }
.py-12 { padding: 12px 0; }
.conv-item { padding: 10px 16px; cursor: pointer; border-bottom: 1px solid #f5f5f5; }
.conv-item:hover { background: #f5f7fa; }
.conv-item.active { background: #ecf5ff; color: #409eff; }
.ai-main { flex: 1; display: flex; flex-direction: column; }
.ai-header { padding: 12px 20px; border-bottom: 1px solid #e4e7ed; display: flex; align-items: center; gap: 12px; background: #fff; }
.course-tag { font-size: 13px; color: #409eff; }
.chat-box { flex: 1; overflow-y: auto; padding: 20px; }
.msg { display: flex; gap: 10px; margin-bottom: 16px; }
.msg.user { justify-content: flex-end; }
.bubble { max-width: 70%; padding: 10px 14px; border-radius: 8px; line-height: 1.6; }
.msg.assistant .bubble { background: #fff; border: 1px solid #e4e7ed; }
.msg.user .bubble { background: #409eff; color: #fff; }
.input-box { display: flex; gap: 10px; padding: 16px; background: #fff; border-top: 1px solid #e4e7ed; }
.input-box .el-button { align-self: flex-end; }
@media (max-width: 768px) { .msg .bubble { max-width: 85%; } }
</style>