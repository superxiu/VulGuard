<template>
  <div w50rem h24rem p3 flex="~ col" justify-center items-center bg-dark>
    <div class="container">
      <dv-scroll-ranking-board :config="config" style="width: 100%; height: 330px">
        <template v-slot:item="{ name, value }">
          <div class="item" :title="name">
            <span class="name">{{ truncatedName(name) }}</span>
            <span class="value">{{ value }}</span>
          </div>
        </template>
      </dv-scroll-ranking-board>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const config = reactive({
  data: [
    {
      name: 'Nessus SYN scanner',
      value: 22
    },
    {
      name: 'Service Detection',
      value: 16
    },
    {
      name: 'Nessus SYN scanner',
      value: 12
    },
    {
      name: 'Web Application Cookies Not Marked...',
      value: 10
    },
    {
      name: 'HyperText Transfer Protocol (HTTP)...',
      value: 10
    },
    {
      name: 'Web Application Sitemap',
      value: 9
    },
    {
      name: 'Missing or Permissive X-Frame...',
      value: 5
    }
  ],
  unit: '个',
  color: '#235fa7',
  textColor: 'aqua'
})

const maxLength = 20 // 设置最大长度

const truncatedName = (name) => {
  return name.length > maxLength ? name.slice(0, maxLength) + '...' : name
}
</script>

<style scoped>
.container {
  padding: 0 20px 20px 20px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value {
  flex-shrink: 0;
}

/* div .ranking-value {
  color: red !important;
} */
</style>
