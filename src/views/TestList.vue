<template>
  <!-- Record Details -->
  <template v-if="selectedRecord">
    <RecordDetails :record="selectedRecord" @back-to-list="selectedRecord = null" />
  </template>
  <!-- Default view -->
  <template v-else>
    <div class="test-list">
      <h3 class="title-with-line">防护任务列表</h3>
      <TableSkeleton :loading="isLoading" :rows="10">
        <el-table :data="paginatedData" style="width: 100%">
          <el-table-column prop="index" label="序号" width="120">
            <template v-slot="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="testname" label="防护名称" width="210">
            <template v-slot="scope">
              <span>{{ scope.row.testname || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="testname" label="IP地址" width="250">
            <template v-slot="scope">
              <span>{{ scope.row.ip || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="完成时间" width="250">
            <template v-slot="scope">
              <span>{{ scope.row.date || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="230">
            <template v-slot="scope">
              <el-button type="text" @click="viewDetails(scope.row)">查看</el-button>
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
import RecordDetails from '@/components/deviceprotection/protectionDetails.vue';
import TableSkeleton from '@/components/loading/TableSkeleton.vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const testlist_url = `${apiUrl}/function_test/get_list`;

const userStore = useUserStore();
const isLoading = ref(false);
const testRecords = ref([]);
const selectedRecord = ref(null);

// 添加时间格式化辅助函数
function formatDate(dateString) {
  const date = new Date(dateString);
  
  // 提取日期部分
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // 提取原始的小时、分钟和秒
  const hours = dateString.slice(17, 19);
  const minutes = dateString.slice(20, 22);
  const seconds = dateString.slice(23, 25);
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const fetchTestRecords = async () => {
  isLoading.value = true;
  try {
    const response = await axios.post(testlist_url,{
          userID: userStore.currentUser.userID
    });
    testRecords.value = response.data.result.map((record, index) => ({
      index: index + 1,
      ip: record.ip ||'-',
      testname: record.testname || '-',
      date: record.date? formatDate(record.date) : '-',
      equipment: record.equipment || '-',
    }));
    totalItems.value = testRecords.value.length; // 更新总记录数
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching test records:', error);
    ElMessage.error('获取防护列表失败');
    isLoading.value = false;
  }
};

const viewDetails = (record) => {
  selectedRecord.value = record;
};

// Pagination
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示10行
const totalItems = ref(0);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return testRecords.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

onMounted(() => {
  fetchTestRecords();
});
</script>

<style scoped>
.test-list {
  background-color: white;
  padding: 20px 45px; 
  border-radius: 5px;
  min-height: 90%;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  */
}

.pagination-container{
  display: flex;
  justify-content: right;
  margin-top: 5px;
}
</style>
