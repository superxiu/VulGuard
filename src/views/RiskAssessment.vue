<template>
  <!-- Task Details -->
  <template v-if="selectedTask">
    <RiskDetails :Task="selectedTask" @back-to-list="selectedTask = null" />
  </template>
  <!-- Default view -->
  <template v-else>
    <div class="risk-evaluation">
      <h3 class="title-with-line">安全性评估</h3>
      <TableSkeleton :loading="isLoading" :rows="10">
        <el-table :data="paginatedData" class="risk-table" :fit="false">
          <el-table-column prop="index" label="序号" width="250"></el-table-column>
          <el-table-column prop="taskname" label="任务名称" width="250"></el-table-column>
          <el-table-column prop="starttime" label="开始时间" width="300"></el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button type="text" @click="viewDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- Pagination -->
          <div class="pagination-container">
            <el-pagination
              size="small"
              layout="prev, pager, next"
              class="mt-4"
              :total="totalItems"
              :page-size="pageSize"
              @current-change="handlePageChange"
              :current-page="currentPage"
            />
          </div>
      </TableSkeleton>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import RiskDetails from '@/components/riskassess/RiskDetails.vue';
import TableSkeleton from '@/components/loading/TableSkeleton.vue';
import { ElMessage } from 'element-plus';

const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const gettask_url = `${apiUrl}/task/get_task`;

const isLoading = ref(false);
const userStore = useUserStore();
const router = useRouter();
const selectedTask = ref(null);
const tasks = ref([]);
const filteredTasks = ref([]);

const fetchTasks = async () => {
  isLoading.value = true;
  try {
    const response = await axios.post(gettask_url, {
      userID: userStore.currentUser.userID
    });
    isLoading.value = false;
    tasks.value = response.data.tasks.filter(task => task.status === '已结束').map((task, index) => ({
      ...task,
      index: index + 1
    }));
    filteredTasks.value = tasks.value;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    ElMessage.error('获取任务失败');
    isLoading.value = false;
  }
};

const viewDetails = (task) => {
  selectedTask.value = task;
};
// Pagination
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTasks.value.slice(start, end);
});

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.risk-evaluation {
  border-radius: 5px;
  background-color: white;
  padding: 20px 45px;
  min-height: 90%;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
}

.risk-table {
  margin-bottom: 20px;
  background-color: #fff;
  table-layout: auto;
  min-width: 600px;
}
.pagination-container{
  display: flex;
  justify-content: right;
  margin-top: 5px;
}
</style>
