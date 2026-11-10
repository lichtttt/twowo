<template>
  <div class="page-container" v-loading="loading">
    <el-page-header @back="$router.back()" class="mb-16" />
    <template v-if="course">
      <div class="detail-top">
        <div class="cover">
          <el-icon :size="64" color="#fff"><Reading /></el-icon>
        </div>
        <div class="detail-info">
          <h1>{{ course.title }}</h1>
          <p class="desc">{{ course.description }}</p>
          <div class="meta">
            <el-tag :type="course.isFree ? 'success' : 'warning'">{{ course.isFree ? '免费' : '¥' + course.price }}</el-tag>
            <el-tag effect="plain">L{{ course.difficulty }}</el-tag>
            <span><el-icon><User /></el-icon> {{ course.studentCount }} 人学习</span>
            <span><el-icon><Star /></el-icon> {{ course.ratingAvg }}</span>
            <span>讲师：{{ course.instructor?.name || '匿名' }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" @click="onLearn">开始学习</el-button>
            <el-button :type="favorited ? 'danger' : 'default'" @click="onFavorite">
              <el-icon><Star /></el-icon> {{ favorited ? '已收藏' : '收藏' }}
            </el-button>
            <el-button @click="$router.push(`/ai?courseId=${course.id}`)"><el-icon><ChatDotRound /></el-icon> AI 答疑</el-button>
          </div>
        </div>
      </div>

      <el-row :gutter="20" class="mt-16">
        <el-col :xs="24" :md="16">
          <el-card>
            <template #header><span class="section-title">课程章节</span></template>
            <el-collapse>
              <el-collapse-item v-for="ch in course.CourseChapters || []" :key="ch.id" :title="ch.title" :name="ch.id">
                <p>{{ ch.content }}</p>
                <el-progress :percentage="userState?.lastChapterId === ch.id ? userState.progress : 0" :stroke-width="8" class="mt-16" />
              </el-collapse-item>
            </el-collapse>
            <div v-if="userState?.isLearning" class="mt-16">
              <span>学习进度：</span>
              <el-slider v-model="progressVal" :max="100" show-input @change="onProgress" />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="8">
          <el-card class="mb-16">
            <template #header><span class="section-title">讲师信息</span></template>
            <div class="instructor">
              <el-avatar :size="48">{{ course.instructor?.name?.[0] }}</el-avatar>
              <div>
                <p style="font-weight:600">{{ course.instructor?.name }}</p>
                <p style="color:#909399;font-size:13px">{{ course.instructor?.title }}</p>
                <p style="color:#606266;font-size:13px;margin-top:4px">{{ course.instructor?.intro }}</p>
              </div>
            </div>
          </el-card>
          <el-card>
            <template #header>
              <div class="flex-between"><span class="section-title">评分评论</span>
                <el-button text type="primary" @click="showRate = true">我要评价</el-button>
              </div>
            </template>
            <div v-for="r in ratings" :key="r.id" class="rating-item">
              <div class="flex-between">
                <span style="font-weight:600">{{ r.user?.nickname || '匿名' }}</span>
                <el-rate :model-value="r.rating" disabled size="small" />
              </div>
              <p class="rating-comment">{{ r.comment }}</p>
            </div>
            <el-empty v-if="ratings.length === 0" description="暂无评价" :image-size="60" />
          </el-card>
        </el-col>
      </el-row>
    </template>

    <el-dialog v-model="showRate" title="评价课程" width="400px">
      <el-rate v-model="rateForm.rating" />
      <el-input v-model="rateForm.comment" type="textarea" :rows="4" placeholder="写下你的评价" class="mt-16" />
      <template #footer>
        <el-button @click="showRate = false">取消</el-button>
        <el-button type="primary" @click="onRate">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../stores/user';
import { detail, toggleFavorite, startLearning, updateProgress, addRating, ratings as fetchRatings } from '../../api/course';

const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const course = ref(null);
const ratings = ref([]);
const userState = ref(null);
const showRate = ref(false);
const rateForm = reactive({ rating: 5, comment: '' });
const progressVal = ref(0);

const favorited = computed(() => userState.value?.isFavorited);

async function load() {
  loading.value = true;
  try {
    const res = await detail(route.params.id);
    course.value = res.data.course;
    ratings.value = res.data.ratings;
    userState.value = res.data.userState;
    progressVal.value = userState.value?.progress || 0;
  } finally {
    loading.value = false;
  }
}

async function onLearn() {
  if (!userStore.isLogin) return ElMessage.warning('请先登录');
  await startLearning(route.params.id);
  ElMessage.success('已开始学习');
  load();
}
async function onFavorite() {
  if (!userStore.isLogin) return ElMessage.warning('请先登录');
  const res = await toggleFavorite(route.params.id);
  userState.value = { ...userState.value, isFavorited: res.data.isFavorited };
  ElMessage.success(res.data.isFavorited ? '已收藏' : '已取消收藏');
}
async function onProgress() {
  await updateProgress(route.params.id, { progress: progressVal.value });
  ElMessage.success('进度已保存');
}
async function onRate() {
  await addRating(route.params.id, rateForm);
  ElMessage.success('评价成功');
  showRate.value = false;
  const r = await fetchRatings(route.params.id);
  ratings.value = r.data;
}
onMounted(load);
</script>

<style scoped>
.detail-top { display: flex; gap: 24px; background: #fff; padding: 24px; border-radius: 8px; }
.cover { width: 200px; height: 130px; background: linear-gradient(135deg, #409eff, #66b1ff); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.detail-info { flex: 1; }
.detail-info h1 { font-size: 22px; margin-bottom: 8px; }
.desc { color: #606266; margin-bottom: 12px; }
.meta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; color: #606266; margin-bottom: 16px; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; }
.instructor { display: flex; gap: 12px; }
.rating-item { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.rating-comment { color: #606266; font-size: 14px; margin-top: 6px; }
@media (max-width: 768px) { .detail-top { flex-direction: column; } .cover { width: 100%; height: 120px; } }
</style>