<template>
<!-- View Report -->
  <template v-if="isViewReport">
    <AssessReport :testname="record.testname" :ip="record.ip" :equipment="record.equipment" @child-data="handleChildData" />
  </template>
  <!-- Default view -->
  <template v-else>
    <div class="protection-details">
      <el-link class="back-link" @click="$emit('back-to-list')">
        <el-icon class="el-icon--left"><ArrowLeftBold /></el-icon>
        返回防护列表
      </el-link>
      <el-col class="test-info-row"> 
        <el-col>
          <h3 class="title-with-line">防护详情</h3>
        </el-col>
        <div>
          <el-row>
            <el-col :span="12">
              <p>任务名称: {{ record.testname }}</p>
              <p>防护IP: {{ record.ip }}</p>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-button type="primary" @click="handleViewReport">查看评估报告</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-row :gutter="30" class="dynamic-height">
        <el-col :span="12" class="pro-before">
          <h4 class="title-with-line-1">防护前渗透结果</h4>
          <div class="table-container">
            <TableSkeleton :loading="isLoading" :rows="10">
              <el-table :data="protectionBefore" max-height="calc(65vh - 50px)" style="width: 100%">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="plugin_name" label="插件名称" width="250"></el-table-column>
                <el-table-column prop="plugin_family" label="插件家族"></el-table-column>
                <el-table-column prop="severity" label="严重性"></el-table-column>
              </el-table>
            </TableSkeleton>
          </div>
        </el-col>

        <el-col :span="12" class="pro-after">
          <h4 class="title-with-line-1">防护后渗透结果</h4>
          <div class="table-container">
            <TableSkeleton :loading="isLoading" :rows="10">
              <el-table :data="protectionAfter" max-height="calc(65vh - 50px)" style="width: 100%;">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="plugin_name" label="插件名称" width="250"></el-table-column>
                <el-table-column prop="plugin_family" label="插件家族"></el-table-column>
                <el-table-column prop="severity" label="严重性"></el-table-column>
              </el-table>
            </TableSkeleton>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import TableSkeleton from '@/components/loading/TableSkeleton.vue';
import { useUserStore } from '@/stores/userStore';
import AssessReport from '@/components/deviceprotection/assessReport.vue';
import { useProtectionStore } from '@/stores/useProtectionStore';  // 引入 Pinia Store
import { useTestStore } from '@/stores/testStore';

const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const gettest_url = `${apiUrl}/function_test/get_test`;

// 定义 emits
const emit = defineEmits(['child-data']);
const isViewReport = ref(false);

const userStore = useUserStore();
const testStore = useTestStore();

const protectionStore = useProtectionStore();  // 使用 Pinia store
const isLoading = ref(false);
// 接收 props
const props = defineProps({
  record: {
    type: Object,
    required: true
  }
});

const protectionBefore = ref([]);
const protectionAfter = ref([]);

// 统计严重性等级的漏洞数量
const calculateSeverityCount = (data) => {
  const severityCounts = [0, 0, 0, 0, 0];
  data.forEach(item => {
    severityCounts[item.severity]++;
  });
  return severityCounts;
};

const fetchTestDetails = async () => {
  isLoading.value = true;
  try {
    const response = await axios.post(gettest_url, {
      testname: props.record.testname,
      userID: userStore.currentUser.userID
    });
    const data = response.data.result;

    // 检查 "防护前" 数据
    if (data['防护前'] && Array.isArray(data['防护前']) && data['防护前'][1] !== "Data Error") {
      protectionBefore.value = data['防护前'];
    } else {
      protectionBefore.value = [];
      ElMessage.warning('防护前的渗透结果没有数据。');
    }

    // 检查 "防护后" 数据
    if (data['防护后'] && Array.isArray(data['防护后']) && data['防护后'][1] !== "Data Error") {
      protectionAfter.value = data['防护后'];
      testStore.removeTaskIP(props.record.ip);
    } else {
      protectionAfter.value = [];
      ElMessage.warning('防护后的渗透结果没有数据。');
    }

    // 计算防护前后的漏洞数量
    const severityBefore = calculateSeverityCount(protectionBefore.value);
    const severityAfter = calculateSeverityCount(protectionAfter.value);

    // 将数据提交到 Pinia Store
    protectionStore.setSeverityData({ severityBefore, severityAfter });

    // 如果有其他数据需要存储，可以类似地调用 protectionStore.setOtherData
    // protectionStore.setOtherData(otherData);
    // 打印日志确认数据已存储
    console.log('Severity data stored in Pinia:', protectionStore.severityData);

    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching test details:', error);
    ElMessage.error('获取防护详情失败');
    isLoading.value = false;
  }
};

// 处理查看评估报告按钮点击事件
const handleViewReport = () => {
  isViewReport.value = true;
};

const handleChildData = async (data) => {
  isViewReport.value = data;
  emit('child-data', data);
}

watch(() => props.record.testname, fetchTestDetails);

onMounted(() => {
  fetchTestDetails();
});
</script>

<style scoped>
.protection-details {
  /* padding: 20px 45px;  */
  /* border-radius: 5px;
  margin-bottom: 25px;
  min-height: 90vh;
  max-height: 90vh; */
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  */
}

.test-info p {
  padding-left: 10px;
}
.test-info-row{
  background-color: white;
  padding: 10px 30px;
  border-radius: 5px;
  margin-bottom: 10px;
}

h3 {
  margin-top: 20px;
}
.table-container {
  height: 50vh;
}

.dynamic-height {
  /* background-color: white; */
  height: calc(90vh - 150px); /* Adjust based on other content height */
  padding:10px 30px;
  background-color: white;
}
.pro-before,.pro-after{
  background-color: white;
}
</style>
