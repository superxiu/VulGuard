<template>
  <el-link class="back-link" @click="$emit('back-to-taskList')">
    <el-icon class="el-icon--left"><ArrowLeftBold /></el-icon>
    返回
  </el-link>
  <div class="vulnerability-details">
    <div class="left-column">
      <div class="card card-blue">
        <h1>{{ vulDetails.plugin_name || "漏洞详情加载中..." }}</h1>
      </div>
      <div class="card card-blue">
        <h3 class="title-with-line-1">描述</h3>
        <p>{{ vulDetails.description || "描述信息加载中..." }}</p>
      </div>
      <div class="card card-blue">
        <h3 class="title-with-line-1">解决方案</h3>
        <p>{{ vulDetails.solution || "解决方案信息加载中..." }}</p>
        <h3 class="title-with-line-1">另请参见</h3>
        <ul v-if="vulDetails.see_also">
          <li v-for="link in vulDetails.see_also.split('\n')" :key="link">
            <a :href="link" target="_blank">{{ link }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-column">
      <div class="card card-lan">
        <h3 class="title-with-line-1">评分</h3>
        <ul>
          <li>CVSS3 基础分数: {{ vulDetails.cvss3_base_score || "无"}}</li>
          <li>CVSS3 时间评分: {{ vulDetails.cvss3_temporal_score || "无"}}</li>
          <li>CVSS 基础分数: {{ vulDetails.cvss_base_score || "无"}}</li>
          <li>CVSS 时间评分: {{ vulDetails.cvss_temporal_score|| "无" }}</li>
        </ul>
      </div>
      <div class="card card-purple">
        <h3 class="title-with-line-1">细节</h3>
        <ul>
          <li>家族名称: {{ vulDetails.family_name || "无" }}</li>
          <li>插件修改日期: {{ vulDetails.plugin_modification_date || "无" }}</li>
          <li>插件发布日期: {{ vulDetails.plugin_publication_date || "无" }}</li>
          <li>插件类型: {{ vulDetails.plugin_type || "无" }}</li>
          <li>风险因素: {{ vulDetails.risk_factor || "无" }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import axios from 'axios';

export default {
  props: {
    vul_ID: {
      type: String,
      required: true
    }
  },
  
  setup(props) {
    const vulDetails = ref({});

    const fetchVulnerabilityDetails = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        // 构建请求的完整URL
        const getleak_url = `${apiUrl}/leak/get_leak?leakid=${props.vul_ID}`;
        const response = await axios.get(getleak_url);

        if (response.status === 200) {
          vulDetails.value = response.data;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        vulDetails.value = response.data;
      } catch (error) {
        console.error("Failed to fetch vulnerability details:", error);
        ElMessage.error('未能加载漏洞详情，请稍后重试。');
        vulDetails.value = {
          plugin_name: "漏洞详情未能加载",
          description: "未能加载描述信息。",
          family_name: "无",
          plugin_modification_date: "无",
          plugin_publication_date: "无",
          plugin_type: "无",
          risk_factor: "无",
          solution: "未能加载解决方案信息。",
          see_also: ""
        };
      }
    };

    onMounted(() => {
      fetchVulnerabilityDetails();
    });

    return {
      vulDetails
    };
  }
};
</script>

<style scoped>
.vulnerability-details {
  display: flex;
  gap: 40px;
  margin-left:20px;
  margin-right:20px;
}

.left-column {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  padding: 15px;
  padding-top:5px;
  background-color: white;
  border-radius: 10px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
}

.card-blue {
  background-color: #ffffff; /* 淡蓝色 */
}

.card-green {
  background-color: #B8F9F0; /* 淡绿色 */
}

.card-lan {
  background-color: #c8ecfb; /* 白色 */
}

.card-purple {
  background-color: #DCE2FF; /* 淡紫色 */
}

h1, h3 {
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

a {
  color: #0645AD;
}

.back-link{
  margin-left: 20px;
  margin-bottom: 20px;
}
</style>