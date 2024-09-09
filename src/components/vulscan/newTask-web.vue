<template>
  <div class="webNewTaskContent">
    <el-row class="w-150px mb-2">
      <el-text class="mx-1" type="primary">参数</el-text>
    </el-row>
    <el-row class="parameter">
      <div class="contentText">
        <el-text class="mx-1 typeText">目标URL</el-text>
        <el-text class="mx-1 typeTextStar">*</el-text>
      </div>
      <div class="fillContent">
        <el-input
          v-model="targetUrl"
          style="max-width: 700px"
          placeholder="www.example.com"
        ></el-input>
      </div>
    </el-row>
    <el-row class="parameter">
      <div class="contentText">
        <el-text class="mx-1 typeText">是否自定义</el-text>
      </div>
      <div class="fillContent">
        <el-radio-group v-model="isDefined" @change="forceUpdate">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
    </el-row>
    <el-row v-if="isDefined" class="parameter">
      <div class="contentText">
        <el-text class="mx-1 typeText">自定义扫描类型</el-text>
      </div>
      <div class="fillContent">
        <el-radio-group v-model="policyName" @change="forceUpdate">
          <el-radio label="web全面扫描">web全面扫描</el-radio>
          <el-radio label="web快速扫描">web快速扫描</el-radio>
        </el-radio-group>
      </div>
    </el-row>
    <div class="bugType">
      <el-row class="w-150px mb-2">
        <el-text class="mx-1" type="primary">漏洞类型</el-text>
      </el-row>
      <el-checkbox-group v-model="checkList" class="parameter">
        <el-checkbox label="SQL注入" value="SQL注入" />
        <el-checkbox label="跨站脚本（XSS）" value="跨站脚本（XSS）" />
        <el-checkbox label="跨站请求伪造（CSRF）" value="跨站请求伪造（CSRF）" />
        <el-checkbox label="文件包含漏洞" value="文件包含漏洞" />
        <el-checkbox label="安全配置错误" value="安全配置错误" />
        <el-checkbox label="未授权访问" value="未授权访问" />
      </el-checkbox-group>
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
  </div>
</template>

<script setup>
import { ref,defineProps } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';  

const userStore = useUserStore();
// 定义 emit 函数
const emit = defineEmits(['child-data']);
const props = defineProps({
  taskName: String
});

const targetUrl = ref('');
const isDefined = ref(0);
const policyName = ref('');
const checkList = ref([]);

const userID = userStore.currentUser.userID;

const forceUpdate = () => {
  targetUrl.value = targetUrl.value;
  isDefined.value = isDefined.value;
  policyName.value = policyName.value;
  checkList.value = [...checkList.value];
};

const sureBuildNewTask = () => {
  const data = {
    userID,
    taskname:props.taskName,
    policy: '快速扫描',
    text_targets: targetUrl.value,
    uuidname: 'webapp',
    is_defined: isDefined.value,
    policy_name: isDefined.value ? policyName.value : '',
  };

  fetch('http://172.18.186.221:5000/task/create_task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      ElMessage.success('任务创建成功');
      console.log('Success:', result);
      emit('child-data', false);
    })
    .catch((error) => {
      ElMessage.error('任务创建失败');
      console.error('Error:', error);
    });
};

const cancelBuildNewTask = () => {
  emit('child-data', false);
};
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
.bugType {
  margin-top: 4%;
}
.buttonContent {
  margin-top: 20px;
}
</style>
