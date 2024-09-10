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
        <el-text class="mx-1 typeText">操作系统类型</el-text>
        <el-text class="mx-1 typeTextStar">*</el-text>
      </div>
      <div class="fillContent">
        <el-input
          v-model="osType"
          style="max-width: 700px"
          placeholder="例如：Linux, Windows"
        ></el-input>
      </div>
    </el-row>
    <div class="bugType">
      <el-row class="w-150px mb-2">
        <el-text class="mx-1" type="primary">漏洞类型</el-text>
      </el-row>
      <el-checkbox-group v-model="checkList" class="parameter">
        <el-checkbox label="未打补丁" value="未打补丁" />
        <el-checkbox label="配置错误" value="配置错误" />
        <el-checkbox label="缓冲区溢出" value="缓冲区溢出" />
        <el-checkbox label="弱密码" value="弱密码" />
        <el-checkbox label="权限提升" value="权限提升" />
      </el-checkbox-group>
    </div>
  </div>
  <div class="buttonContent">
    <el-row justify="center">
      <el-col :span="2">
        <el-button type="primary" @click="sureBuildNewTask">创建</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="cancelBuildNewTask">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { ElInput, ElRow, ElText, ElCheckboxGroup, ElCheckbox, ElButton } from 'element-plus';

// 定义 emit 函数
const emit = defineEmits(['child-data']);

const ipRange = ref('');
const username = ref('');
const password = ref('');
const portRange = ref('');
const osType = ref('');
const checkList = ref([]);

const sureBuildNewTask = () => {
  console.log('Creating new task with:', {
    ipRange,
    username,
    password,
    portRange,
    osType,
    checkList
  });
  emit('child-data', { status: 'created', details: { ipRange, username, password, portRange, osType, checkList } });
}

const cancelBuildNewTask = () => {
  console.log('Task creation cancelled.');
  emit('child-data', { status: 'cancelled' });
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
  margin-top: 20px;
}
</style>

