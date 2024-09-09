<template>
  <!-- Vul Details -->
  <template v-if="selectedVul">
    <vulDetails :vul_ID="selectedVul" @back-to-taskList="selectedVul = null" />
  </template>
  <!-- Default view -->
  <template v-else>
    <div class="task-details">
      <h3>{{ task.name }}</h3>
      <el-link class="back-link" @click="$emit('back-to-list')">
        <el-icon class="el-icon--left"><ArrowLeftBold /></el-icon>
        返回任务列表
      </el-link>

      <div class="overview-container">
        <h4 class="title-with-line">任务概览</h4>
        <el-row>
          <el-col :span="12">
            <p><strong>任务名称:</strong> {{ task.name }}</p>
            <p><strong>目标范围:</strong> {{ task.ips.join(', ') }}</p>
            <p><strong>开始时间:</strong> {{ task.startTime }}</p>
            <p><strong>结束时间:</strong> {{ task.endTime }}</p>
          </el-col>
          <el-col :span="12">
            <p><strong>扫描状态:</strong> {{ task.status }}</p>
          </el-col>
        </el-row>
      </div>

      <div class="results-container">
        <h4 class="title-with-line">扫描结果</h4>
        <el-row>
          <el-col :span="17">
            <!-- <el-select v-model="selectedIP" placeholder="请选择IP地址" @change="filterResultsByIP" style="width:300px;margin-bottom:10px;">
              <el-option
                v-for="ip in task.ips"
                :key="ip"
                :label="ip"
                :value="ip"
              />
            </el-select> -->
            <el-select v-model="selectedIP" placeholder="请选择IP地址" @change="handleIPChange" style="width:300px;margin-bottom:10px;margin-right:10px;">
              <el-option v-for="ip in task.ips" :key="ip" :label="ip" :value="ip" />
            </el-select>

            <!-- 新增：如果selectedIP是局域网，显示第二个下拉框 -->
            <el-select v-if="shouldShowHostSelect" v-model="selectedHost" placeholder="请选择主机IP" @change="fetchResultsForHost" style="width:300px;margin-bottom:10px;">
              <el-option v-for="host in hosts" :key="host.hostname" :label="host.hostname" :value="host.hostname" />
            </el-select>

            <TableSkeleton :loading="isLoading" :rows="10">
              <el-table :data="filteredScanResults" height="400" max-height="400" style="width: 100%;" @row-click="handleRowClick">
                <el-table-column prop="index" type="index" label="序号" width="90"></el-table-column>
                <el-table-column prop="Nessus_vul_id" label="漏洞ID" width="90"></el-table-column>
                <el-table-column prop="level" label="等级" width="90"></el-table-column>
                <el-table-column prop="name" label="名称" width="420"></el-table-column>
                <el-table-column prop="num" label="数量"></el-table-column>
              </el-table>
            </TableSkeleton>
          </el-col>
          <el-col :span="7">
            <div id="vulnerability-chart" class="vulnerability-chart"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, nextTick, computed } from 'vue';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import TableSkeleton from '../loading/TableSkeleton.vue';
import vulDetails from '@/components/vulscan/vulDetails.vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const taskresult_url = `${apiUrl}/task/result`;

const userStore = useUserStore();
const selectedVul = ref(null);
const isLoading = ref(true);
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const selectedIP = ref(props.task.ips[0] || null);
const selectedHost = ref(null); // 新增：用于存储选择的局域网内主机IP
const taskResults = ref([]);
const scanResults = ref([]);
const levels = ref({});
const hosts = ref([]); // 新增：存储从服务器获取的局域网内主机列表
const initialIP = ref(null); // 初始化时为 null

const handleRowClick = (row) => {
  selectedVul.value = row.Nessus_vul_id;
};

const generateChart = () => {
  nextTick(() => {
    const chartData = [
      { value: levels.value.critical || 0, name: '严重' },
      { value: levels.value.high || 0, name: '高危' },
      { value: levels.value.medium || 0, name: '中危' },
      { value: levels.value.low || 0, name: '低危' },
      { value: levels.value.info || 0, name: '信息' },
    ];

    const chartDom = document.getElementById('vulnerability-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '漏洞等级分布',
          left: 'center',
          top: '0%',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'horizontal',
          bottom: '10%',
          left: 'center',
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            lineHeight: 20
          },
          data: [
            { name: '严重', icon: 'circle' },
            { name: '高危', icon: 'circle' },
            { name: '中危', icon: 'circle' },
            { name: '低危', icon: 'circle' },
            { name: '信息', icon: 'circle' }
          ]
        },
        series: [
          {
            name: '漏洞等级',
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['50%', '40%'],
            data: chartData,
            label: {
              position: 'inner',
              formatter: '{d}%'
            },
            labelLine: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#FF4500', '#FF6347', '#FFA500', '#FFFF00', '#4E74F5']
      };

      myChart.setOption(option);
    }
  });
};

const isLAN = (ip) => {
  return ip && ip.includes('/'); // 判断是否为局域网IP
};

const handleIPChange = async (ip) => {
  // selectedHost.value = null; // 清除之前选择的局域网内主机IP
  // initialIP.value = ip; // 更新初始IP
  // await fetchResultsForIP(ip, ""); // 获取结果
  // 如果选择的 IP 和 initialIP 不同，则更新 initialIP 和清除 selectedHost
  if (initialIP.value !== ip) {
    initialIP.value = ip;
    selectedHost.value = null; // 清除选择的主机 IP
    await fetchResultsForIP(ip, ""); // 获取新的主机 IP 列表
  }
};
const shouldShowHostSelect = computed(() => {
  // 只有在IP选择变化并且hosts.length > 0时才显示下拉框
  return (isLAN(initialIP.value) && hosts.value.length > 0) || isLAN(selectedIP.value);
  // return initialIP.value !== selectedIP.value;
});

const fetchResultsForIP = async (ip, select) => {
  isLoading.value = true;
  try {
    const userID = userStore.currentUser.userID;
    console.log('Fetching scan results with params:', { taskname: props.task.name, userID, ip, select });
    const response = await axios.post(taskresult_url, {
      taskname: props.task.name,
      userID,
      ip,
      select
    });

    const resultData = response.data.result || [];
    const results = resultData[0]?.existing_have_leaks || [];
    const levelsData = resultData[0]?.level || {};
    // const hostData = response.data.hosts || [];
    // hosts.value = response.data.hosts || []; // 获取局域网内主机列表
    if (initialIP.value !== ip) {
      hosts.value = response.data.hosts || []; // 仅在 IP 变化时更新 hosts
      initialIP.value = ip;
    }
    console.log('Hosts:', hosts.value);

    scanResults.value = results;
    levels.value = {
      critical: levelsData.four || 0,
      high: levelsData.three || 0,
      medium: levelsData.two || 0,
      low: levelsData.one || 0,
      info: levelsData.zero || 0,
    };

    generateChart();
  } catch (error) {
    ElMessage.error('获取扫描结果失败');
    console.error('Failed to fetch scan results:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchResultsForHost = async (hostIP) => {
  await fetchResultsForIP(selectedIP.value, hostIP);
};

const filteredScanResults = computed(() => scanResults.value);

onMounted(() => {
  if (selectedIP.value) {
    fetchResultsForIP(selectedIP.value, "");
  }
});

watch(() => selectedIP.value, (newIP) => {
  if (newIP) {
    handleIPChange(newIP);
  }
});

watch(() => props.task, (newTask) => {
  if (newTask && selectedIP.value) {
    fetchResultsForIP(selectedIP.value, "");
  }
}, { immediate: true });

watch(() => selectedVul.value, (newVal) => {
  if (newVal === null) {
    generateChart();
  }
});
</script>

<style scoped>
.task-details {
  padding-top: 0;
  margin: 10px;
}

h2 {
  margin-bottom: 20px;
  margin-top: 0;
}

p {
  margin: 5px 0;
  font-size: 12px;
}

.overview-container,
.results-container {
  background-color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 3px;
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.overview-container {
  margin-top: 5px;
}

.vulnerability-chart {
  width: 100%;
  height: 300px; 
}

::v-deep .el-table .el-table__row {
  height: 50px; 
}
</style>
