<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-select v-model="filter.category" placeholder="职位分类" clearable @change="loadData">
        <el-option label="算法" value="算法" />
        <el-option label="数据" value="数据" />
        <el-option label="前端" value="前端" />
        <el-option label="后端" value="后端" />
        <el-option label="测试" value="测试" />
        <el-option label="运维" value="运维" />
      </el-select>
      <el-input v-model="filter.keyword" placeholder="搜索职位或公司名称" clearable style="width:240px" @clear="loadData" @keyup.enter="loadData">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="loadData">搜索</el-button>
    </div>

    <el-row :gutter="16" v-loading="loading">
      <el-col :xs="24" :sm="12" :md="8" v-for="j in list" :key="j.id">
        <el-card class="job-card" shadow="hover" @click="$router.push(`/job/${j.id}`)">
          <div class="flex-between">
            <h3 class="text-ellipsis" style="max-width:60%">{{ j.title }}</h3>
            <span class="salary">{{ j.salaryMin }}-{{ j.salaryMax }}K</span>
          </div>
          <p class="company">{{ j.company?.name }} · {{ j.city }}</p>
          <div class="tags">
            <el-tag size="small" effect="plain">{{ j.category }}</el-tag>
            <el-tag size="small" effect="plain" type="info">{{ j.company?.scale || '规模未知' }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!loading && list.length === 0" description="暂无职位" />

    <div class="pager" v-if="total > pageSize">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="page" @current-change="loadData" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list as fetchJobs } from '../../api/job';

const list = ref([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = 12;
const filter = reactive({ category: '', keyword: '' });

async function loadData() {
  loading.value = true;
  try {
    const params = { page: page.value, pageSize };
    if (filter.category) params.category = filter.category;
    if (filter.keyword) params.keyword = filter.keyword;
    const res = await fetchJobs(params);
    list.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}
onMounted(loadData);
</script>

<style scoped>
.filter-bar { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.job-card { cursor: pointer; margin-bottom: 16px; transition: transform 0.2s; }
.job-card:hover { transform: translateY(-3px); }
.salary { color: #f56c6c; font-weight: 600; }
.company { color: #909399; margin: 8px 0; font-size: 14px; }
.tags { display: flex; gap: 6px; }
.pager { display: flex; justify-content: center; margin-top: 24px; }
</style>