<template>
  <div class="page-container">
    <h2 class="section-title">AI 作业自动批改</h2>
    <el-alert type="info" :closable="false" class="mb-16">上传编程题目与代码，AI 自动评分并给出修改建议。</el-alert>
    <el-card>
      <el-form label-position="top">
        <el-form-item label="课程ID（选填）"><el-input v-model="form.courseId" placeholder="如 1" /></el-form-item>
        <el-form-item label="作业题目"><el-input v-model="form.title" placeholder="如：实现快速排序" /></el-form-item>
        <el-form-item label="提交代码">
          <el-input v-model="form.code" type="textarea" :rows="10" placeholder="粘贴你的代码" style="font-family:Consolas,monospace" />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="onGrade">提交批改</el-button>
      </el-form>
    </el-card>
    <el-card v-if="result" class="mt-16">
      <template #header><span class="section-title">批改结果</span></template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="评分"><el-rate :model-value="result.score / 20" disabled show-score :max="5" /> {{ result.score }} / 100</el-descriptions-item>
        <el-descriptions-item label="反馈"><div class="markdown-body" v-html="renderMd(result.feedback)"></div></el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { marked } from 'marked';
import { grade } from '../../api/ai';
const form = reactive({ courseId: '', title: '', code: '' });
const loading = ref(false);
const result = ref(null);
function renderMd(t) { try { return marked(t || ''); } catch (e) { return t; } }
async function onGrade() {
  loading.value = true;
  try {
    const res = await grade({ courseId: form.courseId ? Number(form.courseId) : null, title: form.title, code: form.code });
    result.value = res.data;
  } finally {
    loading.value = false;
  }
}
</script>