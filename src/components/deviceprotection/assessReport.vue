<template>
  <el-link class="back-link" @click="goBack">
    <el-icon><ArrowLeftBold /></el-icon>
    返回
  </el-link>
  <div class="assess-report">
    <div class="assess-report-inner">
      <h3 class="title-with-line">评估报告</h3>
      <div class="report-actions">
        <el-button type="primary" @click="exportToPDF" style="margin-bottom: 10px;">
          <el-icon style="margin-right:5px;"><Download /></el-icon>
          导出PDF
        </el-button>
      </div>
      <div class="report-container" id="pdfDom">
        <h2 class="main-title">设备防护成效分析评估报告</h2>
        <p class="task-info">任务名称: {{ props.testname }} | 防护IP: {{ props.ip }} | 防护设备: {{ props.equipment }} </p>
        <h3 class="title-with-line-1">图表分析</h3>
        <div class="chart-content">
          <TableSkeleton :loading="isChartLoading" :rows="10">
            <div v-if="chartImageUrl">
              <img :src="chartImageUrl" alt="Chart Image" class="chart-image" @click="showLightbox = true" />
              <vue-easy-lightbox
                :visible="showLightbox"
                :imgs="[chartImageUrl]"
                @hide="showLightbox = false"
              />
            </div>
          </TableSkeleton>
        </div>
        <h3 class="title-with-line-1">报告内容</h3>
        <div class="report-content" id="report-content">
          <TableSkeleton :loading="isLoading" :rows="10">
            <div v-if="reportData">
              <div v-if="reportData.summary">
                <h4>报告摘要</h4>
                <vue3-markdown-it :source="reportData.summary"></vue3-markdown-it>
              </div>
              <div v-html="formatReportData('before')"></div>
              <div v-html="formatReportData('after')"></div>
            </div>
          </TableSkeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { ElMessage } from 'element-plus';
import { ArrowLeftBold, Download } from '@element-plus/icons-vue';
import TableSkeleton from '@/components/loading/TableSkeleton.vue';
import Vue3MarkdownIt from 'vue3-markdown-it';
import VueEasyLightbox from 'vue-easy-lightbox';
import htmlToPdf from '@/utils/html2pdf';
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const testassessment_url = `${apiUrl}/function_test/assessment`;
const testgetpicture_url = `${apiUrl}/function_test/get_picuter`;

const isLoading = ref(false);
const isChartLoading = ref(true); // 初始状态为 true，表示图表正在加载
const showLightbox = ref(false); // 控制灯箱的显示

const props = defineProps({
  testname: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  equipment: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['child-data']);

const userStore = useUserStore();
const reportData = ref(null);
const chartImageUrl = ref(null);

const fetchReportData = async () => {
  isLoading.value = true;
  ElMessage.info('正在加载评估报告，请耐心等待...');
  try {
    const response = await axios.post(testassessment_url, {
      testname: props.testname,
      userID: userStore.currentUser.userID
    });
    reportData.value = response.data;
    
    isLoading.value = false;
    ElMessage.success('评估报告加载成功');
  } catch (error) {
    console.error('Error fetching report data:', error);
    ElMessage.error('评估报告加载失败，请重试');
    isLoading.value = false;
  }
};

const fetchChartData = async (retries = 3) => {
  if (retries <= 0) {
    ElMessage.error('图表加载失败，请重试');
    isChartLoading.value = false;
    return;
  }

  try {
    const response = await axios.post(testgetpicture_url, {
      testname: props.testname,
      userID: userStore.currentUser.userID
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

    isChartLoading.value = false;
    ElMessage.success('图表加载成功');
  } catch (error) {
    console.error('Error fetching chart data:', error);
    fetchChartData(retries - 1); // 重试
  }
};

const goBack = () => {
  emit('child-data', false);
};

// const exportToPDF = async () => {
//   await htmlToPdf.getPdf('设备防护成效分析评估报告');
// };
const exportToPDF = async () => {
  const fileName = `设备防护成效分析评估报告_${props.testname}`;
  await htmlToPdf.getPdf(fileName);
};
const vulnerabilityLevels = {
  High_Vulnerability: '高风险漏洞',
  Medium_Vulnerability: '中风险漏洞',
  Low_Vulnerability: '低风险漏洞',
  Serious_Vulnerability: '严重漏洞'
};

const formatReportData = (timeframe) => {
  if (!reportData.value || !reportData.value[timeframe]) return '';

  const report = reportData.value[timeframe];
  let formattedContent = `<h4>${timeframe === 'before' ? '防护前' : '防护后'}</h4>`;
  
  if (report.Conclude) {
    formattedContent += `
      <div>
        <h5>结论</h5>
        <p>风险等级: ${report.Conclude.level}</p>
        <p>评分: ${report.Conclude.score}</p>
      </div>
    `;
  }

  if (report.Vulnerability_Details) {
    for (const [key, value] of Object.entries(report.Vulnerability_Details)) {
      const chineseLevel = vulnerabilityLevels[key] || key;
      formattedContent += `<h5>${chineseLevel}</h5>`;
      if (value.length > 0) {
        value.forEach((item, index) => {
          formattedContent += `<h6>漏洞 ${index + 1}</h6>`;
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
      } else {
        formattedContent += `<p>无</p>`;
      }
    }
  }

  return formattedContent;
};

onMounted(() => {
  fetchReportData();
  fetchChartData(); // 将 fetchChartData 调用移到这里
});
</script>

<style scoped>
.assess-report {
  display: flex;
  justify-content: center; /* 水平方向居中 */
  align-items: flex-start; /* 垂直方向顶对齐，可以根据需要调整 */
}
.assess-report-inner {
  background-color: white;
  padding: 20px 45px;
  border-radius: 15px;
  margin-bottom: 20px;
  min-height: 90vh;
  width: 838px; /* 调整宽度以适应新的布局 */
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}
/* hover样式会影响图片灯箱的全屏显示！！！ */
.assess-report-inner:hover {
  
}
.report-container {
  border-top: 1px solid #a7b9f7;
  padding: 20px;
  min-height: 297mm;
  width: 210mm; /* A4 size */
  overflow-y: auto; /* 超出内容滚动 */
}
.main-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}
.chart-content {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止图片溢出容器 */
}
.report-content {
  flex: 1;
  overflow-y: scroll;
}
.chart-image {
  width: 400px;
  max-height: 400px;
  object-fit: contain; /* 保持图像的纵横比并适应容器 */
  cursor: pointer; /* 添加手型光标，表示可点击 */
}
.report-actions{
  display: flex;
  justify-content: right; /* 水平方向居中 */
}
.task-info {
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
