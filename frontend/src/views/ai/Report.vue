<template>
  <div class="page-container">
    <h2 class="section-title">学习报告</h2>
    <el-radio-group v-model="period" @change="load" class="mb-16">
      <el-radio-button value="week">周报</el-radio-button>
      <el-radio-button value="month">月报</el-radio-button>
    </el-radio-group>
    <div v-loading="loading">
      <el-row :gutter="16" v-if="summary" class="mb-16">
        <el-col :xs="12" :md="6"><el-card><el-statistic title="学习课程" :value="summary.totalCourses" /></el-card></el-col>
        <el-col :xs="12" :md="6"><el-card><el-statistic title="进行中" :value="summary.learningCourses" /></el-card></el-col>
        <el-col :xs="12" :md="6"><el-card><el-statistic title="平均进度" :value="summary.avgProgress" suffix="%" /></el-card></el-col>
        <el-col :xs="12" :md="6"><el-card><el-statistic title="作业均分" :value="summary.avgScore" /></el-card></el-col>
      </el-row>
      <el-card v-if="summary && summary.weakPoints && summary.weakPoints.length" class="mb-16">
        <template #header><span class="section-title">薄弱点</span></template>
        <el-tag v-for="w in summary.weakPoints" :key="w" type="danger" class="mr-8">{{ w }}</el-tag>
      </el-card>
      <el-card v-if="analysis">
        <template #header><span class="section-title">AI 结构化分析</span></template>
        <div class="markdown-body" v-html="renderMd(analysis)"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';
import { report } from '../../api/ai';
const period = ref('week');
const loading = ref(false);
const summary = ref(null);
const analysis = ref('');
function renderMd(t) { try { return marked(t || ''); } catch (e) { return t; } }
async function load() {
  loading.value = true;
  try {
    const res = await report({ period: period.value });
    summary.value = res.data.summary;
    analysis.value = res.data.analysis;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<style scoped>
.mr-8 { margin-right: 8px; }
</style>