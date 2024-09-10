<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <el-skeleton-item
        v-for="i in rows"
        :key="i"
        variant="text"
        style="width: 100%; height: 30px; margin-bottom: 10px;border-radius: 6px"
      ></el-skeleton-item>
    </template>
    <template #default>
      <slot />
    </template>
  </el-skeleton>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  rows: {
    type: Number,
    default: 5,
  },
});
</script>

<style scoped>
/* 自定义骨架屏样式 */
</style>
