<template>
  <div class="content">
    <div demo-bg>
      <dv-scroll-board :config="config" style="width: 100%; height: 300px" @mouseover="mouseoverHandler" @click="clickHandler" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue' // 确保从 'vue' 导入 reactive

const config = reactive({
  header: ['漏洞序号', '风险', '扫描时间', '状态'],
  data: [
    ['11219', '0', '07-23 08:30', '待防护'],
    ['22964', '1', ' 07-23 15:45', '已防护'],
    ['11219', '3', ' 07-23 11:00', '待防护'],
    ['85602', '1', ' 07-23 09:20', '待防护'],
    ['24260', '0', ' 07-23 14:10', '已防护'],
    ['91815', '2', ' 07-22 10:05', '待防护'],
    ['50345', '1', ' 07-22 12:30', '待防护'],
    ['50344', '2', ' 07-22 16:40', '已防护'],
    ['10107', '0', ' 07-22 13:55', '待防护'],
    ['85582', '4', ' 07-22 17:25', '待防护']
  ],
  index: false,
  align: ['center'],
  oddRowBGC: '#041928',
  evenRowBGC: 'black',
  headerBGC: '#08395A',
  columnWidth: [200, 75, 190, 100]
})

const mouseoverHandler = (e: any) => {
  console.log('Mouseover event:', e)
}

const clickHandler = (e: any) => {
  console.log('Click event:', e)
}
</script>

<style scoped>
.content {
  margin: 20px 5px;
}
.dv-scroll-board {
  color: aqua;
}
.dv-scroll-board .rows .row-item {
  font-size: 2px !important;
}
</style>
