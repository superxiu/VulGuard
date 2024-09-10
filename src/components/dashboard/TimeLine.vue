<template>
  <n-timeline class="time-container">
    <div class="content scroll-container">
      <n-timeline-item v-for="(task, index) in tasks" :key="index" :type="getType(task.status)" :title="`漏洞扫描：${task.taskname}`" :content="task.status" :time="task.starttime || '未开始'" />
    </div>
  </n-timeline>
</template>

<script>
import { defineComponent } from 'vue'
import { NTimeline, NTimelineItem } from 'naive-ui'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const gettask_url = `${apiUrl}/task/get_task`;

const userStore = useUserStore()

export default defineComponent({
  components: {
    NTimeline,
    NTimelineItem
  },
  data() {
    return {
      tasks: []
    }
  },
  created() {
    this.fetchTasks()
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.post(gettask_url, {
          userID: userStore.currentUser.userID,
          taskname: ''
        })
        this.tasks = response.data.tasks
      } catch (error) {
        console.error('获取任务失败:', error)
      }
    },
    getType(status) {
      switch (status) {
        case '进行中':
          return 'success'
        case '已结束':
          return 'info'
        case '未开始':
          return 'warning'
        default:
          return 'default'
      }
    }
  }
})
</script>

<style scoped>
.time-container {
  padding: 5px 20px;
  max-height: 65%; /* 设置最大高度 */
}
h2 {
  color: #08395a;
}
.content {
  padding: 5px;
  width: 85%;
  overflow-y: auto; /* 添加垂直滚动条 */
}

/* 自定义滚动条样式 */
.content::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.content::-webkit-scrollbar-thumb {
  background-color: #20848c; /* 滚动条颜色 */
  border-radius: 6px; /* 滚动条圆角 */
  border: 3px solid transparent; /* 滚动条与内容间的间距 */
  background-clip: content-box; /* 滚动条背景 */
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #8ccec5; /* 滚动条悬停颜色 */
}

.content::-webkit-scrollbar-track {
  background: #e8ecea; /* 滚动条轨道颜色 */
  border-radius: 6px; /* 滚动条轨道圆角 */
}
</style>
