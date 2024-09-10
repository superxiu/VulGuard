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
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              closable
            >
              <template #label>
                <span>
                  <span :class="['circle', { active: tab.name === activeTab }]" />
                  <span style="margin-left: 10px;">{{ tab.title }}</span>
                </span>
              </template>
              <keep-alive>
                <router-view :key="tab.name" />
              </keep-alive>
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
import { ref, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import { MdArrowRoundUp } from '@vicons/ionicons4'

const route = useRoute();
const router = useRouter();
const defaultActive = ref('dashboard');
const activeTab = ref('Dashboard');

// 定义标签页数组
const tabs = ref([
  { name: 'Dashboard', title: '仪表盘' }
]);

// 从 localStorage 加载标签页和当前活动的标签页
function loadTabsFromLocalStorage() {
  const storedTabs = JSON.parse(localStorage.getItem('tabs'));
  const storedActiveTab = localStorage.getItem('activeTab');

  if (storedTabs) {
    tabs.value = storedTabs;
  }
  if (storedActiveTab) {
    activeTab.value = storedActiveTab;
  }
}

// 保存标签页和当前活动的标签页到 localStorage
function saveTabsToLocalStorage() {
  localStorage.setItem('tabs', JSON.stringify(tabs.value));
  localStorage.setItem('activeTab', activeTab.value);
}

// 判断是否应该显示内容区域
function shouldShow() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const result = isLoggedIn === 'true' ? (route.path === '/' ? false : true) : (route.path !== '/' ? true : false);
  console.log('shouldShow:', result);
  return result;
}

// 添加新标签页
function addTab(tabName, tabTitle) {
  const existingTab = tabs.value.find(tab => tab.name === tabName);
  if (!existingTab) {
    tabs.value.push({ name: tabName, title: tabTitle });
  }
  activeTab.value = tabName;
  saveTabsToLocalStorage();  // 添加标签页后保存到 localStorage
  router.push({ name: tabName });
}

// 移除标签页
function removeTab(tabName) {
  const tabIdx = tabs.value.findIndex(tab => tab.name === tabName);
  if (tabIdx !== -1) {
    tabs.value.splice(tabIdx, 1);
    if (tabs.value.length > 0) {
      activeTab.value = tabs.value[Math.max(tabIdx - 1, 0)].name;
      router.push({ name: activeTab.value });
    } else {
      activeTab.value = null;
    }
    saveTabsToLocalStorage();  // 移除标签页后保存到 localStorage
  }
}

// 切换标签页
function switchTab(tab) {
  activeTab.value = tab.props.name;
  saveTabsToLocalStorage();  // 切换标签页时保存到 localStorage
  router.push({ name: tab.props.name });
}

// 组件挂载时加载本地存储中的标签页信息
onMounted(() => {
  loadTabsFromLocalStorage();  // 从 localStorage 加载标签页和当前活动的标签页
  defaultActive.value = route.name || 'dashboard';
});
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
  background-color: #EFF4FE; /* 侧边栏背景色 */
  margin-top: 0; /* 确保表格不被顶栏遮住 */
  z-index: 100; /* 内容层，值较高 */
}

.sidebar {
  height: 100vh;
  width: 240px; /* 侧边栏宽度，可根据需要调整 */
  position: relative;
  z-index: 100; /* 确保侧边栏在背景之上 */
  /* background-color: #EFF4FE;  */
  background-color: #F9FAFE;   
  display: flex;
  flex-direction: column;
}

.headerbar {
  height: 60px; /* 顶栏高度，可根据需要调整 */
  /* background-color: #F9FAFE; */
  background-color: #EFF4FE; 
  z-index: 99; /* 确保顶栏在背景之上 */
  /* box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1); */
  border-bottom: 1px solid #cbd7fe;
  /* border-radius: 28px; */
  width: 98%;
}

.body {
  position: relative;
  overflow: hidden;
}

.circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #bbbbbb; /* 默认颜色 */
}

.circle.active {
  background-color: #4E74F5; /* 活动状态颜色 */
}

.el-icon {
  display: inline-flex;
  align-items: center;
}

.n-icon {
  display: inline-flex;
  align-items: center;
}
</style>
