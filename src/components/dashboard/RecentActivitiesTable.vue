<template>
  <div class="activity-list-wrapper">
    <n-data-table class="activity-list" :columns="columns" :data="tableData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NDataTable } from 'naive-ui'

const createColumns = () => {
  return [
    { title: 'IP', key: 'ip', width: '120px' },
    { title: 'ID', key: 'id', width: '80px' },
    { title: 'Name', key: 'name', width: '280px' },
    { title: 'Count', key: 'count', width: '80px' },
    { title: 'Time', key: 'time' },
    { title: 'Grade', key: 'grade' }
  ]
}

const columns = createColumns()

const tableData = ref([
  { ip: '192.168.0.1', id: '10150', name: 'Windows NetBIOS/SMB Remote Host Information Disclosure', count: '*7', time: '2024-07-23 15:38:37', grade: '1' },
  { ip: '192.168.0.1', id: '11219', name: 'Nessus SYN scanner', count: '*1', time: '2024-07-23 15:38:37', grade: '2' },
  { ip: '192.168.0.1', id: '22964', name: 'Service Detection', count: '*5', time: '2024-07-23 15:38:37', grade: '3' },
  { ip: '192.168.0.1', id: '11219', name: 'Nessus SYN scanner', count: '*2', time: '2024-07-23 15:38:37', grade: '1' },
  { ip: '192.168.0.1', id: '85602', name: 'Web Application Cookies Not Marked Secure', count: '*4', time: '2024-07-23 15:38:37', grade: '2' },
  { ip: '192.168.0.1', id: '24260', name: 'HyperText Transfer Protocol (HTTP) Information', count: '*5', time: '2024-07-23 15:38:37', grade: '3' },
  { ip: '192.168.0.1', id: '91815', name: 'Web Application Sitemap', count: '*6', time: '2024-07-23 15:38:37', grade: '1' },
  { ip: '192.168.0.1', id: '50345', name: 'Missing or Permissive X-Frame-Options HTTP Response Header', count: '*2', time: '2024-07-23 15:38:37', grade: '2' },
  { ip: '192.168.0.1', id: '50344', name: 'Missing or Permissive Content-Security-Policy frame-ancestors HTTP Response Header', count: '*1', time: '2024-07-23 15:38:37', grade: '2' },
  { ip: '192.168.0.1', id: '10107', name: 'HTTP Server Type and Version', count: '*6', time: '2024-07-23 15:38:37', grade: '2' },
  { ip: '192.168.0.1', id: '85582', name: 'Web Application Potentially Vulnerable to Clickjacking', count: '*7', time: '2024-07-23 15:38:37', grade: '2' }
])

// 复制数据使其长度加倍，以实现滚动效果
tableData.value = tableData.value.concat(tableData.value)
</script>

<style scoped>
.activity-list-wrapper {
  height: 75%;
  margin: 0 20px;
  overflow: hidden;
  position: relative;
}

.activity-list {
  position: absolute;
  top: 0;
  animation: scrollTable 10s linear infinite;
}

/* 改变表头颜色 */
/* :deep(table thead tr th) {
  background-color: #f5f5f5 !important;
} */

/* :deep(.n-data-table) {
  --n-border-color: none !important;
} */

/* :deep(table tbody tr td) {
  background-color: #f9fafe !important;
  color: #08395a !important;
} */

@keyframes scrollTable {
  0% {
    top: 0;
  }
  100% {
    top: -100%;
  }
}
</style>
