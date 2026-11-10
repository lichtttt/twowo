<template>
  <div class="page-container">
    <h2 class="section-title">AI 学习路径推荐</h2>
    <el-alert type="info" :closable="false" class="mb-16">根据你的学习记录与测试情况，AI 自动生成个性化学习计划。</el-alert>
    <el-button type="primary" :loading="loading" @click="generate" class="mb-16">生成学习计划</el-button>
    <div v-if="plan && plan.length">
      <el-timeline>
        <el-timeline-item v-for="(p, i) in plan" :key="i" :timestamp="`阶段 ${i + 1}`" placement="top" type="primary">
          <el-card>
            <h4>{{ p.stage || p.goal || ('阶段' + (i + 1)) }}</h4>
            <p style="color:#606266;margin:8px 0">目标：{{ p.goal }}</p>
            <p style="color:#606266;margin:8px 0">推荐资源：{{ p.resources }}</p>
            <p style="color:#909399">预计时长：{{ p.duration }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <p v-if="expireAt" style="color:#909399">计划到期时间：{{ expireAt }}</p>
    </div>
    <el-empty v-else description="点击上方按钮生成学习计划" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { learningPath } from '../../api/ai';
const loading = ref(false);
const plan = ref(null);
const expireAt = ref('');
async function generate() {
  loading.value = true;
  try {
    const res = await learningPath({});
    plan.value = res.data.plan;
    expireAt.value = res.data.expireAt;
  } finally {
    loading.value = false;
  }
}
</script>