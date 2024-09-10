<!-- TitleComponent.vue -->
<template>
  <div class="item_title" v-if="title !== ''">
    <div class="zuo"></div>
    <span class="title-inner"> &nbsp;&nbsp;{{ title }}&nbsp;&nbsp; </span>
    <div class="you"></div>
  </div>
  <div :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: number | string
  }>(),
  {
    title: ''
  }
)
</script>

<style scoped>
.item_title {
  height: 38px;
  line-height: 38px;
  width: 100%;
  color: #31abe3;
  text-align: center;
  padding: 1%;
  /* background: linear-gradient(to right, transparent, #0f0756, transparent); */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item_title .zuo,
.item_title .you {
  width: 58px;
  height: 14px;
  background-image: url('@/assets/images/img/titles/zuo.png');
}

.item_title .you {
  transform: rotate(180deg);
}

.item_title .title-inner {
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
