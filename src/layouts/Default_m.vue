<template>
  <div class="body">
    <el-container class="full-height" direction="horizontal">
      <Sidebar :default-active="defaultActive" @menu-select="addTab" :active-tab="activeTab" class="sidebar" />
      <el-container v-if="shouldShow()" direction="vertical" class="content-container">
        <Header class="headerbar" />
        <!-- 主内容区域容器，保持垂直方向 -->
        <el-main class="main-content">
          <!-- 添加 el-backtop 组件 -->
          <el-backtop class="custom-backtop" target=".main-content">
            <n-icon size="30" color="#4E74F5" class="custom-icon">
              <MdArrowRoundUp />
            </n-icon>
          </el-backtop>
          <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="switchTab">
            <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.title" :name="tab.name" closable>
              <router-view :key="tab.name" />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <div v-else>
        <router-view />
      </div>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdArrowRoundUp } from '@vicons/ionicons4'

import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const defaultActive = ref('dashboard')
const activeTab = ref('Dashboard')
const tabs = ref([{ name: 'Dashboard', title: '工作台' }])

function shouldShow() {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const result = isLoggedIn === 'true' ? (route.path === '/' ? false : true) : route.path !== '/' ? true : false
  console.log('shouldShow:', result)
  return result
}

function addTab(tabName, tabTitle) {
  const existingTab = tabs.value.find((tab) => tab.name === tabName)
  if (!existingTab) {
    tabs.value.push({ name: tabName, title: tabTitle })
  }
  activeTab.value = tabName
  router.push({ name: tabName })
}

function removeTab(tabName) {
  const tabIdx = tabs.value.findIndex((tab) => tab.name === tabName)
  if (tabIdx !== -1) {
    tabs.value.splice(tabIdx, 1)
    if (tabs.value.length > 0) {
      activeTab.value = tabs.value[Math.max(tabIdx - 1, 0)].name
      router.push({ name: activeTab.value })
    } else {
      activeTab.value = null
    }
  }
}

function switchTab(tab) {
  router.push({ name: tab.props.name })
}

onMounted(() => {
  defaultActive.value = route.name || 'dashboard'
})
</script>

<style scoped>
.full-height {
  height: 100vh;
  display: flex;
  z-index: 100; /* 内容层，值较高 */
  overflow-x: hidden;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #eff4fe; /* 侧边栏背景色 */
  margin-top: 0; /* 确保表格不被顶栏遮住 */
  z-index: 100; /* 内容层，值较高 */
  position: relative; /* 需要添加相对定位，以便 el-backtop 正确工作 */
}

.sidebar {
  height: 100vh;
  width: 240px; /* 侧边栏宽度，可根据需要调整 */
  position: relative;
  z-index: 100; /* 确保侧边栏在背景之上 */
  background-color: #f9fafe;
  display: flex;
  flex-direction: column;
}

.headerbar {
  height: 60px; /* 顶栏高度，可根据需要调整 */
  background-color: #eff4fe;
  z-index: 99; /* 确保顶栏在背景之上 */
  border-bottom: 1px solid #cbd7fe;
  width: 98%;
}

.body {
  position: relative;
  overflow: hidden;
}

/* 自定义 el-backtop 的样式 */
.custom-backtop {
  width: 50px; /* 修改为你希望的宽度 */
  height: 50px; /* 修改为你希望的高度 */
}

.custom-icon {
  font-size: 30px; /* 修改图标的大小 */
}
</style>
