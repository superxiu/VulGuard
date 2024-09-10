<template>
  <div class="webNewTaskContent">
    <el-row class="w-150px mb-2">
      <el-text class="mx-1" type="primary">参数</el-text>
    </el-row>
    <el-row class="parameter">
      <div class="contentText">
        <el-text class="mx-1 typeText">目标IP地址范围</el-text>
        <el-text class="mx-1 typeTextStar">*</el-text>
      </div>
      <div class="fillContent">
        <el-input
          v-model="ipRange"
          style="max-width: 700px"
          placeholder="例：192.168.1.0/24"
        ></el-input>
      </div>
    </el-row>
    <el-row class="parameter twoPart">
      <div class="contentText">
        <el-text class="mx-1 typeText">认证信息</el-text>
        <el-text class="mx-1 typeTextStar">*</el-text>
      </div>
      <div class="fillContent">
        <el-text class="mx-1">用户名</el-text>
        <el-input
          v-model="username"
          style="width: 240px"
          placeholder="请输入用户名"
          class="twoInput"
        />
        <el-text class="mx-1">密码</el-text>
        <el-input
          v-model="password"
          style="width: 240px"
          placeholder="请输入密码"
          type="password"
          class="twoInput"
        />
      </div>
    </el-row>
    <el-row class="parameter">
      <div class="contentText">
        <el-text class="mx-1 typeText">端口范围</el-text>
        <el-text class="mx-1 typeTextStar">*</el-text>
      </div>
      <div class="fillContent">
        <el-input
          v-model="portRange"
          style="max-width: 700px"
          placeholder="支持单个端口、端口范围（例如：80, 443, 1000-2000）"
        ></el-input>
      </div>
    </el-row>
    <el-row class="parameter">
      <div class="contentText">
        <el-text class="mx-1 typeText">应用类型</el-text>
        <el-text class="mx-1 typeTextStar">*</el-text>
      </div>
      <div class="fillContent">
        <el-input
          v-model="appType"
          style="max-width: 700px"
          placeholder="请输入应用类型"
        ></el-input>
      </div>
    </el-row>
    <div class="bugType">
      <el-row class="w-150px mb-2">
        <el-text class="mx-1" type="primary">漏洞类型</el-text>
      </el-row>
      <el-checkbox-group v-model="checkList" class="parameter">
        <el-checkbox label="代码注入" value="代码注入" />
        <el-checkbox label="配置文件泄露" value="配置文件泄露" />
        <el-checkbox label="目录遍历" value="目录遍历" />
        <el-checkbox label="日志注入" value="日志注入" />
        <el-checkbox label="安全审计缺失" value="安全审计缺失" />
      </el-checkbox-group>
    </div>
  </div>
  <div class="buttonContent">
    <el-button type="primary" @click="sureBuildNewTask">创建</el-button>
    <el-button @click="cancelBuildNewTask">取消</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElInput, ElRow, ElText, ElCheckbox, ElCheckboxGroup, ElButton } from 'element-plus';

const ipRange = ref('');
const username = ref('');
const password = ref('');
const portRange = ref('');
const appType = ref('');
const checkList = ref([]);

const sureBuildNewTask = () => {
  console.log('Creating new task with:', { ipRange, username, password, portRange, appType, checkList });
  // 你可以在这里添加创建任务的逻辑
}

const cancelBuildNewTask = () => {
  console.log('Task creation cancelled.');
  // 你可以在这里添加取消任务的逻辑
}
</script>

<style scoped>
.el-row {
  align-items: center;
}
.webNewTaskContent {
  margin-left: 2%;
  margin-top: 3%;
}
.parameter {
  margin-top: 2.5%;
}
.typeText {
  margin-right: 3%;
  color: black;
}
.typeTextStar {
  color: red;
}
.contentText {
  flex: 1;
}
.fillContent {
  flex: 8;
}
.twoInput {
  margin: 0 3%;
}
.bugType {
  margin-top: 4%;
}
.buttonContent {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translate(-50%, 0%);
}
</style>
