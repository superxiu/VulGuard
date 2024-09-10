<template>
  <el-link class="back-link" @click="$emit('back-to-list')">
    <el-icon class="el-icon--left"><ArrowLeftBold /></el-icon>
    返回列表
  </el-link>
  <div class="risk-details">
    <div class="risk-details-inner">
      <h3 class="title-with-line-1">{{ Task.taskname }}</h3>
      <div class="ip-selection">
        <el-select v-model="selectedIP" placeholder="选择目标IP" style="width: 250px; margin-right: 10px;">
          <el-option v-for="ip in ipData" :key="ip" :label="ip" :value="ip"></el-option>
        </el-select>
        <el-button type="primary" @click="viewReport">查看</el-button>
        <!-- 导出按钮 -->
        <el-button type="primary" @click="exportToPDF" style="margin-left: auto;">
          <el-icon style="margin-right:5px;"><Download /></el-icon>
          导出PDF
        </el-button>
      </div>

      <div class="report-container" id="pdfDom">
        <h2 class="main-title">安全性评估报告</h2>
        <p class="task-info">任务名称: {{ Task.taskname }} | 选择的IP: {{ selectedIP }}</p>
        <TableSkeleton :loading="isLoading || isChartLoading" :rows="10">
          <div v-if="!isLoading && !isChartLoading">
            <div>
              <h3 class="title-with-line-1">图表分析</h3>
              <div class="chart-content">
                <img v-if="chartImageUrl" :src="chartImageUrl" alt="Chart Image"  class="chart-image" @click="showLightbox = true" />
                <vue-easy-lightbox
                  :visible="showLightbox"
                  :imgs="[chartImageUrl]"
                  @hide="showLightbox = false"
                />
              </div>
              <h3 class="title-with-line-1">报告内容</h3>
              <div v-html="formattedReportContent"></div>
              <!-- <vue-markdown-it :source="formattedReportContent" /> -->
            </div>
          </div>
        </TableSkeleton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import TableSkeleton from '@/components/loading/TableSkeleton.vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import htmlToPdf from '@/utils/html2pdf';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { VueMarkdownIt } from 'vue3-markdown-it';
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const taskassessment_url = `${apiUrl}/task/assessment`;
const taskgetpicture_url = `${apiUrl}/task/get_picture`;

const props = defineProps({
  Task: Object
});

const ipData = ref([]);
const selectedIP = ref('');
const reportContent = ref('');
const isLoading = ref(false);
const isChartLoading = ref(false);
const showLightbox = ref(false);
const chartImageUrl = ref('');
const userStore = useUserStore();
const vulnerabilityLevels = {
  High_Vulnerability: '高危漏洞',
  Low_Vulnerability: '低危漏洞',
  Medium_Vulnerability: '中危漏洞',
  Serious_Vulnerability: '严重漏洞'
};

const formattedReportContent = computed(() => {
  if (!reportContent.value) return '';
  const report = JSON.parse(reportContent.value);
  let formattedContent = '';

  if (report.Conclude) {
    formattedContent += `<h3>总结</h3><p><strong>风险级别</strong>: ${report.Conclude.level}</p><p><strong>得分</strong>: ${report.Conclude.score}</p><p><strong>摘要</strong>: ${report.Conclude.summary.replace(/\n/g, '<br>')}</p>`;
  }

  if (report.Vulnerability_Details) {
    for (const [key, value] of Object.entries(report.Vulnerability_Details)) {
      const chineseLevel = vulnerabilityLevels[key] || key;
      if (value.length > 0) {
        formattedContent += `<h3>${chineseLevel}</h3>`;
        value.forEach((item, index) => {
          formattedContent += `<h4>漏洞 ${index + 1}</h4>`;
          if (item.description) {
            formattedContent += `<p><strong>描述</strong>: ${item.description.replace(/\n/g, '<br>')}</p>`;
          }
          if (item.range) {
            formattedContent += `<p><strong>范围</strong>: ${item.range.replace(/\n/g, '<br>')}</p>`;
          }
          if (item.suggestion) {
            formattedContent += `<p><strong>建议</strong>: ${item.suggestion.replace(/\n/g, '<br>')}</p>`;
          }
        });
      }
    }
  }

  return formattedContent;
});

const viewReport = async () => {
  if (!selectedIP.value) {
    ElMessage.warning('请选择一个目标IP');
    return;
  }
  isLoading.value = true;
  isChartLoading.value = true; // 开始加载图表
  fetchChartData(); // 加载报告成功后请求图表数据
  try {
    ElMessage.info('正在加载评估报告，请耐心等待...');
    const response = await axios.post(taskassessment_url, {   
        taskname: props.Task.taskname,
        userID: userStore.currentUser.userID,
        ip: selectedIP.value
    });
    reportContent.value = JSON.stringify(response.data);
    ElMessage.success('评估报告加载成功');
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching report:', error);
    ElMessage.error('评估报告加载失败，请重试');
    isLoading.value = false;
    isChartLoading.value = false; // 失败时停止图表加载动画
  } 
};

const fetchChartData = async () => {
  try {
    const response = await axios.post(taskgetpicture_url, {
      taskname: props.Task.taskname,
      userID: userStore.currentUser.userID,
      ip: selectedIP.value
    }, { responseType: 'blob' });
    
    const imageUrl = URL.createObjectURL(new Blob([response.data]));
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      chartImageUrl.value = imageUrl;
      isChartLoading.value = false; // 图表加载完成后关闭加载动画
      ElMessage.success('图表加载成功');
    };
    img.onerror = () => {
      console.error('Error loading chart image');
      ElMessage.error('图表加载失败，请重试');
      isChartLoading.value = false;
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    ElMessage.error('图表加载失败，请重试');
    isChartLoading.value = false;
  }
};

const exportToPDF = async () => {
  const fileName = `安全性评估报告_${props.Task.taskname}`;
  await htmlToPdf.getPdf(fileName);
};

const prepareIpData = () => {
  ipData.value = props.Task.ips;
};

onMounted(() => {
  prepareIpData();
});
</script>

<style scoped>
.risk-details{
  display: flex;
  justify-content: center; /* 水平方向居中 */
  align-items: flex-start;
}
.risk-details-inner {
  width: 835px;
  border-radius: 15px;
  background-color: white;
  padding: 10px 30px 20px 30px;
  min-height: 297mm; /* A4 size */
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}
.ip-selection {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.report-container {
  border-top: 1px solid #a7b9f7;
  /* border-radius: 15px; */
  padding: 20px 30px;
  min-height: 297mm;
  /* max-height: 297mm; */
  width: 210mm; /* A4 size */
  overflow-y: auto; /* 超出内容滚动 */
}
.report-content {
  min-height: 59vh;
}

pre {
  white-space: pre-wrap; /* 保证换行符正确显示 */
  word-wrap: break-word; /* 处理长单词或链接的换行 */
}
.chart-content{
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止图片溢出容器 */
}

.chart-image {
  width: 400px;
  max-height: 400px;
  object-fit: contain; /* 保持图像的纵横比并适应容器 */
  cursor: pointer; /* 添加手型光标，表示可点击 */
}

.main-title {
  text-align: center;
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: bold;
}
.task-info {
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>