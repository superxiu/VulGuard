<template>
  <div class="buildTaskContainer">
    <div class="buildTaskContent">
      <!-- 基本信息 -->
      <div class="basicInfoContainer">
        <h3 class="title-with-line">基本信息</h3>
        <div class="taskNameContainer">
          <el-text class="mx-1 typeText">任务名称</el-text>
          <el-text class="mx-1 typeTextStar">*</el-text>
          <el-input 
            v-model="taskName"
            placeholder="请输入任务名称"
            style="width: 240px;margin-left: 2%;"
          ></el-input>
        </div>
        <div class="taskDescriptionContainer">
          <el-text class="mx-1 typeText">任务描述</el-text>
          <el-text class="mx-1 typeTextStar">*</el-text>
          <el-input 
            v-model="taskDescription"
            placeholder="请输入任务描述"
            style="width: 240px;margin-left: 2%;"
          ></el-input>
        </div>
        <div class="taskTargetContainer">
          <el-text class="mx-1 typeText">目标</el-text>
          <el-text class="mx-1 typeTextStar">*</el-text>
          <el-input 
            v-model="taskTarget"
            placeholder="请输入目标"
            style="width: 360px; margin-left: 4.6%;max-height:200px;"
            type="textarea"
            :rows="5"
          />
          <el-text class="mx-1 targetTip">
              支持IP/域名批量输入，按回车分割，每行一个目标，如<br>
              192.168.1.1<br>
              192.168.1.1/24<br>
              www.example.com
          </el-text>
        </div>
        <div class="ScanPolicyContainer">
          <el-text class="mx-1 typeText">扫描策略</el-text>
          <el-text class="mx-1 typeTextStar">*</el-text>
          <el-radio-group v-model="ScanPolicy" style="margin-left: 2%;">
            <el-radio :label="1">全面扫描</el-radio>
            <el-radio :label="2">基本扫描</el-radio>
            <el-radio :label="3">web快速扫描</el-radio>
            <el-radio :label="4">web全面扫描</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="actionButtons">
        <el-button type="primary" @click="createTask" class="wider-button">创建</el-button>
        <el-button @click="cancelTask" class="wider-button">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const createtask_url = `${apiUrl}/task/create_task`;

const emit = defineEmits(['child-data']);
const textarea = ref('');
const taskName = ref('');
const taskDescription = ref('');
const taskTarget = ref('');
const ScanPolicy = ref(1); // 默认选择第一项
const userStore = useUserStore();

const scanPolicyMap = {
  1: '全面扫描',
  2: '基本扫描',
  3: 'web快速扫描',
  4: 'web全面扫描'
};

const createTask = async () => {
  if (!taskName.value || !taskTarget.value || !taskDescription.value) {
    ElMessage.error('任务名称、任务描述和目标不能为空');
    return;
  }

  // 分割 taskTarget 并验证格式
  const targets = taskTarget.value.split('\n').map(item => item.trim()).filter(item => item !== '');
  if (targets.length === 0) {
    ElMessage.error('请按格式输入目标，每个IP或域名使用回车分割');
    return;
  }

  const selectedScanPolicy = scanPolicyMap[ScanPolicy.value];

  try {
    const response = await axios.post(createtask_url, {
      userID: userStore.currentUser.userID,
      taskname: taskName.value,
      text_targets: targets,
      description: taskDescription.value,
      options: selectedScanPolicy
    });
    console.log(response);
    if (response.status === 200) {
      ElMessage.success('任务创建成功!');
      emit('child-data', { action: 'create', data: { taskName: taskName.value, taskDescription: taskDescription.value, taskTarget: taskTarget.value, ScanPolicy: selectedScanPolicy } });
      emit('child-data', false);
    } else {
      ElMessage.error('任务创建失败，请稍后重试');
      console.log(response.data);
    }
  } catch (error) {
    ElMessage.error('任务创建失败，请稍后重试');
    console.error('任务创建失败:', userStore.currentUser.userID, taskName.value, targets, taskDescription.value, selectedScanPolicy);
  }
};

const cancelTask = () => {
  ElMessage({
    type: 'info',
    message: '已取消创建',
  });
  emit('child-data', { action: 'cancel' });
  emit('child-data', false);
};

</script>

<style scoped>
.buildTaskContainer {
  position: relative;
  width: 95%;
  min-height: 90%;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
}
.buildTaskContent {
  margin-left: 2%;
}
.basicInfoContainer{
  display: flex;
  flex-direction: column;
  width: 1000px;
  min-height: 450px;
}
.taskNameContainer, .taskDescriptionContainer, .taskTargetContainer, .ScanPolicyContainer {
  display: flex;
  flex-direction: row;
  margin-bottom: 1%;
  max-height:200px;
}
.typeText {
  margin-left: 2%;
  margin-right: 0.5%;
  color: black;
}
.typeTextStar {
  color: red;
}
.targetTip {
  margin-left: 10px;
  padding: 10px;
  border: 1px solid white;
  border-radius: 10px;
  width: 430px;
  height: 96px;
  color: #4E74F5;
  background-color: #e0e8fe;
}

.actionButtons {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
</style>
