<template>
  <el-card class="course-card" shadow="hover" @click="$router.push(`/course/${course.id}`)">
    <div class="cover">
      <el-icon :size="48" class="cover-icon"><Reading /></el-icon>
      <el-tag v-if="course.isFree" type="success" class="cover-tag">免费</el-tag>
      <el-tag v-else type="warning" class="cover-tag">¥{{ course.price }}</el-tag>
    </div>
    <div class="info">
      <h3 class="title text-ellipsis">{{ course.title }}</h3>
      <p class="desc">{{ course.description }}</p>
      <div class="meta">
        <span class="instructor text-ellipsis">{{ course.instructor?.name || '匿名讲师' }}</span>
        <span class="stats">
          <el-icon><User /></el-icon> {{ course.studentCount }}
          <el-icon style="margin-left:8px"><Star /></el-icon> {{ course.ratingAvg }}
        </span>
      </div>
      <div class="tags">
        <el-tag size="small" effect="plain">{{ dirLabel }}</el-tag>
        <el-tag size="small" effect="plain" type="info">{{ sysLabel }}</el-tag>
        <el-tag size="small" effect="plain" type="warning">L{{ course.difficulty }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ course: { type: Object, required: true } });
const dirMap = { ai: '人工智能', bigdata: '大数据', cloud: '云计算', web: 'Web开发', mobile: '移动开发', other: '其他' };
const sysMap = { theory: '理论课程', practice: '实训课程', cert: '认证课程' };
const dirLabel = computed(() => dirMap[props.course.techDirection] || '其他');
const sysLabel = computed(() => sysMap[props.course.techSystem] || '理论课程');
</script>

<style scoped>
.course-card { cursor: pointer; transition: transform 0.2s; }
.course-card:hover { transform: translateY(-4px); }
.cover { height: 120px; background: linear-gradient(135deg, #409eff, #66b1ff); border-radius: 6px; display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 12px; }
.cover-icon { color: rgba(255,255,255,0.85); }
.cover-tag { position: absolute; top: 8px; right: 8px; }
.title { font-size: 16px; margin-bottom: 6px; }
.desc { font-size: 13px; color: #909399; line-height: 1.5; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 8px; }
.meta { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #606266; margin-bottom: 8px; }
.stats { display: flex; align-items: center; gap: 2px; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
</style>