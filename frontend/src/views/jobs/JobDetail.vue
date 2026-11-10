<template>
  <div class="page-container" v-loading="loading">
    <el-page-header @back="$router.back()" class="mb-16" />
    <template v-if="job">
      <el-card class="mb-16">
        <div class="flex-between">
          <div>
            <h1 style="font-size:22px;margin-bottom:8px">{{ job.title }}</h1>
            <p class="salary">{{ job.salaryMin }}-{{ job.salaryMax }}K · {{ job.city }} · {{ job.category }}</p>
          </div>
          <div class="company-box">
            <el-avatar :size="48">{{ job.company?.name?.[0] }}</el-avatar>
            <div>
              <p style="font-weight:600">{{ job.company?.name }}</p>
              <p style="color:#909399;font-size:13px">{{ job.company?.scale }}</p>
            </div>
          </div>
        </div>
        <div class="actions mt-16">
          <el-button type="primary" :disabled="applied" @click="onApply">{{ applied ? '已申请' : '申请职位' }}</el-button>
          <el-button :type="favorited ? 'danger' : 'default'" @click="onFavorite">{{ favorited ? '已收藏' : '收藏' }}</el-button>
          <el-button type="success" @click="showInterview = true"><el-icon><ChatDotRound /></el-icon> 申请 AI 面试</el-button>
        </div>
      </el-card>

      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <el-card class="mb-16">
            <template #header><span class="section-title">职位描述</span></template>
            <p style="line-height:1.8">{{ job.description }}</p>
          </el-card>
          <el-card>
            <template #header><span class="section-title">任职要求</span></template>
            <p style="line-height:1.8">{{ job.requirements }}</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-card>
            <template #header><span class="section-title">公司简介</span></template>
            <p style="line-height:1.8;color:#606266">{{ job.company?.intro }}</p>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <el-dialog v-model="showApply" title="申请职位" width="450px">
      <el-form label-position="top">
        <el-form-item label="简历（选填）"><el-input v-model="applyForm.resume" type="textarea" :rows="5" placeholder="粘贴简历或备注" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showApply = false">取消</el-button>
        <el-button type="primary" @click="doApply">确认申请</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showInterview" title="AI 模拟面试" width="600px">
      <el-alert type="info" :closable="false" class="mb-16">AI 将根据岗位要求对你的回答进行评分与反馈。</el-alert>
      <el-form label-position="top">
        <el-form-item label="你的回答 / 自我介绍">
          <el-input v-model="interviewForm.answers" type="textarea" :rows="6" placeholder="请输入你的回答" />
        </el-form-item>
      </el-form>
      <div v-if="interviewResult" class="mt-16">
        <el-descriptions title="面试结果" :column="1" border>
          <el-descriptions-item label="评分">{{ interviewResult.score }} / 100</el-descriptions-item>
          <el-descriptions-item label="反馈">{{ interviewResult.feedback }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showInterview = false">关闭</el-button>
        <el-button type="success" :loading="interviewing" @click="doInterview">开始 AI 面试</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';
import { detail, toggleFavorite, apply, aiInterview } from '../../api/job';

const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const job = ref(null);
const userState = ref(null);
const showApply = ref(false);
const showInterview = ref(false);
const applyForm = reactive({ resume: '' });
const interviewForm = reactive({ answers: '' });
const interviewResult = ref(null);
const interviewing = ref(false);

const favorited = computed(() => userState.value?.favorited);
const applied = computed(() => userState.value?.applied);

async function load() {
  loading.value = true;
  try {
    const res = await detail(route.params.id);
    job.value = res.data.job;
    userState.value = res.data.userState;
  } finally {
    loading.value = false;
  }
}
function onApply() {
  if (!userStore.isLogin) return ElMessage.warning('请先登录');
  showApply.value = true;
}
async function doApply() {
  await apply(route.params.id, applyForm);
  ElMessage.success('申请成功');
  showApply.value = false;
  load();
}
async function onFavorite() {
  if (!userStore.isLogin) return ElMessage.warning('请先登录');
  const res = await toggleFavorite(route.params.id);
  userState.value = { ...userState.value, favorited: res.data.isFavorited };
  ElMessage.success(res.data.isFavorited ? '已收藏' : '已取消收藏');
}
async function doInterview() {
  if (!userStore.isLogin) return ElMessage.warning('请先登录');
  interviewing.value = true;
  try {
    const res = await aiInterview(route.params.id, { answers: interviewForm.answers });
    interviewResult.value = res.data;
    ElMessage.success('AI 面试完成');
  } finally {
    interviewing.value = false;
  }
}
onMounted(load);
</script>

<style scoped>
.salary { color: #f56c6c; font-weight: 600; font-size: 16px; }
.company-box { display: flex; gap: 12px; align-items: center; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; }
</style>