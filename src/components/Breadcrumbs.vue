<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in items" :key="index" :to="item.to">
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  items: Array
})
</script>
