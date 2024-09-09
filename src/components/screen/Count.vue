<template>
  <n-row>
    <n-col :span="8">
      <n-statistic label="漏洞总数">325 个</n-statistic>
    </n-col>
    <n-col :span="8">
      <n-statistic label="漏洞种类"> 103 种 </n-statistic>
    </n-col>
    <n-col :span="8">
      <n-statistic label="防护个数"> 295 个 </n-statistic>
    </n-col>
  </n-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NRow, NCol, NStatistic } from 'naive-ui'

export default defineComponent({
  components: {
    NRow,
    NCol,
    NStatistic
  }
})
</script>
<style scoped>
.n-statistic {
  --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
  --n-label-font-size: 14px;
  --n-label-font-weight: 400;
  --n-label-text-color: aqua !important;
  --n-value-font-weight: 400;
  --n-value-font-size: 23px !important;
  --n-value-prefix-text-color: aqua !important;
  --n-value-suffix-text-color: aqua !important;
  --n-value-text-color: aqua !important;
  /* letter-spacing: 6px; */
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0px 10px 20px;
}
</style>
