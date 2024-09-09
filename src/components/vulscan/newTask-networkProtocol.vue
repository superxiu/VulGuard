<template>
  <div class="webNewTaskContent">
    <div class="argument">
      <el-row class="w-150px mb-2">
        <el-text class="mx-1" type="primary">参数</el-text>
      </el-row>
      <el-row class="parameter">
        <div class="contentText">
          <el-text class="mx-1 typeText">IP地址</el-text>
          <el-text class="mx-1 typeTextStar">*</el-text>
        </div>
        <div class="fillContent">
          <el-input
            v-model="targetUrl"
            style="max-width: 700px"
            placeholder="例：192.168.1.0/24"
          ></el-input>
        </div>
      </el-row>
      <el-row class="parameter">
        <div class="contentText">
          <el-text class="mx-1 typeText">任务类型</el-text>
        </div>
        <div class="fillContent">
          <el-radio-group v-model="taskType" @change="forceUpdate">
            <el-radio label="basic">基础</el-radio>
            <el-radio label="advanced">高级</el-radio>
          </el-radio-group>
        </div>
      </el-row>
      <el-row class="parameter">
        <div class="contentText">
          <el-text class="mx-1 typeText">是否自定义</el-text>
        </div>
        <div class="fillContent">
          <el-radio-group v-model="isDefined" @change="forceUpdate">
            <el-radio label="1">是</el-radio>
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
            <el-radio label="全面扫描">全面扫描</el-radio>
            <el-radio label="基础扫描">基础扫描</el-radio>
          </el-radio-group>
        </div>
      </el-row>
      <!-- <el-row class="parameter">
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
          <el-text class="mx-1 typeText">协议类型</el-text>
          <el-text class="mx-1 typeTextStar">*</el-text>
        </div>
        <div class="fillContent">
          <el-input
            v-model="protocolType"
            style="max-width: 700px"
            placeholder="例如：HTTP, HTTPS, FTP"
          ></el-input>
        </div>
      </el-row> -->
    </div>
    <div class="bugType">
      <el-row class="w-150px mb-2">
        <el-text class="mx-1" type="primary">漏洞类型</el-text>
      </el-row>
      <el-checkbox-group v-model="checkList" class="parameter">
        <el-checkbox label="中间人攻击" value="中间人攻击" />
        <el-checkbox label="协议配置错误" value="协议配置错误" />
        <el-checkbox label="未加密通信" value="未加密通信" />
        <el-checkbox label="DNS欺骗" value="DNS欺骗" />
        <el-checkbox label="ARP欺骗" value="ARP欺骗" />
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
// import { ref, defineEmits } from 'vue';
// import { ElInput, ElRow, ElText, ElCheckbox, ElCheckboxGroup, ElButton } from 'element-plus';
// import { useTableData } from '@/services/dataService'; // 引入数据服务

// const props = defineProps({
//   taskName: String
// });

// // 定义 emit 函数
// const emit = defineEmits(['child-data']);

// // 使用 useTableData 钩子
// const { tableData, fetchData } = useTableData();

// const targetUrl = ref('');
// const portRange = ref('');
// const protocolType = ref('');
// const checkList = ref([]);

// const sureBuildNewTask = () => {

// // 添加新任务到表格数据
//   const newTask = {
//     name: props.taskName, // 这里可以根据需要从输入中获取或生成
//     startDate: new Date().toISOString().slice(0, 10),
//     status: '待开始',
//     progress: 0,
//     targetRange: targetUrl.value,
//     startTime: '-',
//     endTime: '-',
//     scanResults: [], // 初始没有扫描结果
//   };
//   tableData.value.push(newTask);

//   console.log('Creating new task:', { targetUrl, portRange, protocolType, checkList });
//   emit('child-data', { status: 'created', details: { targetUrl, portRange, protocolType, checkList } });
//   emit('child-data', false);
// }

// const cancelBuildNewTask = () => {
//   console.log('Task creation cancelled.');
//   emit('child-data', { status: 'cancelled' });
//   emit('child-data', false);
// }

///////////////////////////////////////////////////////////
import { ref, defineEmits } from 'vue';
import { ElInput, ElRow, ElText, ElCheckbox, ElCheckboxGroup, ElButton, ElNotification } from 'element-plus';
import { useUserStore } from '@/stores/userStore';  // 引入 user store
import axios from 'axios';  // 引入axios库

const props = defineProps({
  taskName: String
});

// 定义 emit 函数
const emit = defineEmits(['child-data']);
const userStore = useUserStore();

const targetUrl = ref('');
// const portRange = ref('');
// const protocolType = ref('');
const taskType = ref('');
const isDefined = ref(0);
const policyName = ref('');
const checkList = ref([]);

const forceUpdate = () => {
  targetUrl.value = targetUrl.value;
  taskType.value = taskType.value;
  isDefined.value = isDefined.value;
  policyName.value = policyName.value;
  checkList.value = [...checkList.value];
};

const sureBuildNewTask = async () => {
  // 组装任务数据
  const newTask = {
    text_targets: targetUrl.value,
    // portRange: portRange.value,
    // protocolType: protocolType.value,
    // bugTypes: checkList.value,
    userID: userStore.currentUser.userID, // 从 store 中获取 userID
    taskname:props.taskName,
    uuidname: taskType.value,
    is_defined: isDefined.value,
    policy_name: isDefined.value ? policyName.value : '',
  };
  console.log('Creating new task:', newTask);
  try {
    // 发送创建任务的请求
    const response = await axios.post('http://172.18.186.221:5000/task/create_task', newTask);
    if (response.status === 201) {
      ElNotification({
        title: '成功',
        message: '任务创建成功',
        type: 'success',
      });
      emit('child-data', { status: 'created', details: newTask });
    } else {
      ElNotification({
        title: '错误',
        message: '任务创建失败: ' + response.data.message,
        type: 'error',
      });
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '网络请求错误: ' + error.message,
      type: 'error',
    });
  }

  emit('child-data', false);
}

const cancelBuildNewTask = () => {
  console.log('Task creation cancelled.');
  emit('child-data', { status: 'cancelled' });
  emit('child-data', false);
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
.bugType {
  margin-top: 4%;
}
.twoInput {
  margin: 0% 3%;
}
.buttonContent {
  margin-top: 20px;
}
</style>
