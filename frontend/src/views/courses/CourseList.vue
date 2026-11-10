<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-select v-model="filter.techSystem" placeholder="技术体系" clearable @change="loadData">
        <el-option label="理论课程" value="theory" />
        <el-option label="实训课程" value="practice" />
        <el-option label="认证课程" value="cert" />
      </el-select>
      <el-select v-model="filter.techDirection" placeholder="技术方向" clearable @change="loadData">
        <el-option label="人工智能" value="ai" />
        <el-option label="大数据" value="bigdata" />
        <el-option label="云计算" value="cloud" />
        <el-option label="Web开发" value="web" />
        <el-option label="移动开发" value="mobile" />
        <el-option label="其他" value="other" />
      </el-select>
      <el-select v-model="filter.difficulty" placeholder="课程等级" clearable @change="loadData">
        <el-option label="L1 入门" :value="1" />
        <el-option label="L2 初级" :value="2" />
        <el-option label="L3 中级" :value="3" />
        <el-option label="L4 高级" :value="4" />
        <el-option label="L5 专家" :value="5" />
      </el-select>
      <el-select v-model="filter.isFree" placeholder="是否免费" clearable @change="loadData">
        <el-option label="免费" value="true" />
        <el-option label="付费" value="false" />
      </el-select>
      <el-input v-model="filter.keyword" placeholder="搜索课程名称或讲师" clearable style="width:220px" @clear="loadData" @keyup.enter="loadData">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="loadData">搜索</el-button>
      <div style="flex:1"></div>
      <el-radio-group v-model="filter.sort" @change="loadData">
        <el-radio-button value="newest">最新上架</el-radio-button>
        <el-radio-button value="students">学习人数</el-radio-button>
        <el-radio-button value="rating">评分最高</el-radio-button>
      </el-radio-group>
    </div>

    <div v-loading="loading" class="course-grid">
      <CourseCard v-for="c in list" :key="c.id" :course="c" />
      <el-empty v-if="!loading && list.length === 0" description="暂无课程" />
    </div>

    <div class="pager" v-if="total > pageSize">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="page" @current-change="loadData" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list as fetchCourses } from '../../api/course';
import CourseCard from '../../components/CourseCard.vue';

const list = ref([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = 12;
const filter = reactive({ techSystem: '', techDirection: '', difficulty: '', isFree: '', keyword: '', sort: 'newest' });

async function loadData() {
  loading.value = true;
  try {
    const params = { page: page.value, pageSize, sort: filter.sort };
    if (filter.techSystem) params.techSystem = filter.techSystem;
    if (filter.techDirection) params.techDirection = filter.techDirection;
    if (filter.difficulty) params.difficulty = filter.difficulty;
    if (filter.isFree !== '') params.isFree = filter.isFree;
    if (filter.keyword) params.keyword = filter.keyword;
    const res = await fetchCourses(params);
    list.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}
onMounted(loadData);
</script>

<style scoped>
.filter-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 20px; }
.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.pager { display: flex; justify-content: center; margin-top: 24px; }
@media (max-width: 768px) {
  .filter-bar .el-select, .filter-bar .el-input { width: 100% !important; }
  .course-grid { grid-template-columns: 1fr; }
}
</style>