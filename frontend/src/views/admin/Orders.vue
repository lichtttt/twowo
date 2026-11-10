<template>
  <div class="page-container">
    <h2 class="section-title">订单管理</h2>
    <el-select v-model="status" placeholder="订单状态" clearable @change="load" class="mb-16">
      <el-option label="待支付" value="pending" /><el-option label="已支付" value="paid" /><el-option label="已取消" value="cancelled" /><el-option label="已退款" value="refunded" />
    </el-select>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="orderNo" label="订单号" width="200" />
      <el-table-column prop="User.username" label="用户" />
      <el-table-column prop="Course.title" label="课程" />
      <el-table-column prop="amount" label="金额" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }"><el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button text type="success" @click="set(row, 'paid')">标记已付</el-button>
          <el-button text type="warning" @click="set(row, 'refunded')">退款</el-button>
          <el-button text type="danger" @click="set(row, 'cancelled')">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { orders, updateOrder } from '../../api/admin';
const list = ref([]);
const loading = ref(false);
const status = ref('');
const statusLabel = (s) => ({ pending: '待支付', paid: '已支付', cancelled: '已取消', refunded: '已退款' }[s] || s);
const statusType = (s) => ({ pending: 'warning', paid: 'success', cancelled: 'info', refunded: 'danger' }[s]);
async function load() {
  loading.value = true;
  try { const res = await orders({ status: status.value }); list.value = res.data.list; } finally { loading.value = false; }
}
async function set(row, s) { await updateOrder(row.id, { status: s }); ElMessage.success('已更新'); load(); }
onMounted(load);
</script>