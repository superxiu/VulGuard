<template>
  <div class="test-config">
      <!-- 防护设备 -->
        <div class="test-device">
          <h3 class="title-with-line">防护设备</h3>
          <el-radio-group v-model="selectedTool" style="margin-bottom: 20px;">
            <el-radio v-for="tool in allDevices" :key="tool" :label="tool">{{ tool }}</el-radio>
          </el-radio-group>
          <div v-if="selectedTool" class="tool-option">
            <div class="tool-header">
              <div>{{ selectedTool }}</div>
            </div>
            <div class="device-description" v-html="deviceDescriptions[selectedTool]"></div>
          </div>
        
        <div class="test-button-container">
          <!-- 防护按钮 -->
          <el-button type="primary" @click="openTestModal" class="wider-button">防护</el-button>
          <!-- 重置按钮 -->
          <!-- <el-button type="bg" @click="resetDevices" class="wider-button">重置</el-button> -->
        </div>
      </div>
    
    <!-- 弹出窗口: 填写IP地址和端口号 -->
    <el-dialog v-model="isTestModalVisible" class="test-dialog" width="400" align-center>
      <template #title>
        <span class="title-with-line-1">防护配置</span>
      </template>
      <el-form :model="testConfig">
        <el-form-item label="任务名称">
          <el-input v-model="testConfig.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <!-- 添加单选框 -->
        <el-form-item label="环境选择">
          <el-radio-group v-model="environment">
            <el-radio :label="1">靶场</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- IP地址输入框，根据环境选择控制其值和可编辑性 -->
        <el-form-item label="IP地址" v-if="environment !== 1">
          <el-input v-model="testConfig.ip" placeholder="请输入IP地址"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" v-else>
          <el-input v-model="testConfig.ip" placeholder="1.94.103.241" :disabled="environment === 1"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input v-model="testConfig.port" placeholder="例：8080或1-8080"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isTestModalVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTest">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { useTestStore } from '@/stores/testStore';
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const testbefore_url = `${apiUrl}/function_test/test_before`;
const testone_url = `${apiUrl}/function_test/test_one`;
const LEICHISetting_url = `${apiUrl}/function_test/LEICHI_Setting`;
const openLEICHI_url = `${apiUrl}/function_test/open_LEICHI`;
const testafter_url = `${apiUrl}/function_test/test_after`;
const testtwo_url = `${apiUrl}/function_test/test_two`;
const closeLEICHI_url = `${apiUrl}/function_test/close_LEICHI`;
const LEICHISettingDelete_url = `${apiUrl}/function_test/LEICHI_Setting_Delete`;
const openModsecurity_url = `${apiUrl}/function_test/open_Modsecurity`;
const testafterModsecurity_url = `${apiUrl}/function_test/test_after_Modsecurity`;
const closeModsecurity_url = `${apiUrl}/function_test/close_Modsecurity`;


const userStore = useUserStore();
const testStore = useTestStore();

const environment = ref(1); // 默认选择靶场

const allDevices = ['雷池', 'ModSecurity'];
const deviceDescriptions = {
  '雷池': `
    <p style="color: black; font-size: 15px;">雷池是一种集成了多种安全防护功能的综合性安全设备，能够有效检测、阻止并响应各种复杂的网络攻击。</p>
    <h4 style=" 
    color: #4E74F5; 
    padding-top: 0;
  ">主要功能</h4>
    <ul style="color:black;
    padding-left: 20px;
    margin-bottom: 10px;
    list-style-type: disc;">
      <li><strong>入侵检测与防御（IDS/IPS）：</strong>通过深度包检测（DPI）技术实时监控网络流量，识别异常行为和潜在威胁。</li>
      <li><strong>Web应用防火墙（WAF）：</strong>保护Web应用免受常见攻击，如SQL注入、跨站脚本（XSS）等。</li>
      <li><strong>恶意软件防护：</strong>利用多层次的防御机制，包括签名匹配、沙箱分析和行为监控，检测和阻止恶意软件的传播和执行。</li>
      <li><strong>流量分析与监控：</strong>提供全面的网络流量可视化功能，帮助管理员识别异常流量模式和潜在安全威胁。</li>
      <li><strong>高级威胁防护（ATP）：</strong>利用机器学习和大数据分析技术，识别和应对复杂的高级持续性威胁（APT）。</li>
    </ul>
  `,
  'ModSecurity': `
    <p style="color: black; font-size: 15px;">ModSecurity是一款开源的Web应用防火墙，旨在通过检测和阻止各种Web攻击来保护Web应用的安全。</p>
    <h4 style=" 
    color: #4E74F5; 
    padding-top: 0;
  ">主要功能</h4>
    <ul style="color:black;
    padding-left: 20px;
    margin-bottom: 10px;
    list-style-type: disc;">
      <li><strong>实时流量分析与监控：</strong>实时监控HTTP流量，检测并阻止SQL注入、XSS等常见攻击。</li>
      <li><strong>事件记录与报告：</strong>记录所有的安全事件并生成详细报告，便于管理员分析和跟踪。</li>
      <li><strong>灵活的规则引擎：</strong>支持自定义安全规则，管理员可以根据需要编写和调整规则。</li>
      <li><strong>跨平台支持：</strong>兼容多种Web服务器，如Apache、Nginx、IIS等。</li>
      <li><strong>社区支持与更新：</strong>拥有活跃的开源社区，定期发布安全更新和新功能。</li>
    </ul>
  `,
};

const selectedTool = ref('雷池');
const isTestModalVisible = ref(false);
const testConfig = ref({ name:'', ip: '', port: '' });

const openTestModal = () => {
  isTestModalVisible.value = true;
};

const submitTest = async () => {
   // 如果选择靶场，设置默认 IP 地址和端口号
  if (environment.value === 1) {
    testConfig.value.ip = "1.94.103.241";
    // testConfig.value.port = "10000";
  }

  // 检查必填项
  if (!testConfig.value.name || !testConfig.value.ip || !testConfig.value.port) {
    ElMessage.error('请填写任务名称、IP地址和端口号');
    return;
  }

  if (!selectedTool.value) {
    ElMessage.error('请选择一个防护设备');
    return;
  }

  // 使用 Pinia 检查 IP 是否已存在
  // if (testStore.checkTaskIP(testConfig.value.ip)) {
  //   ElMessage.error('该IP的防护任务正在进行中，现在无法提交');
  //   return;
  // }

  // 存储 IP
  testStore.addTaskIP(testConfig.value.ip);

  const timestamp = new Date().toLocaleString();
  const record = {
    name: testConfig.value.name,
    timestamp: timestamp,
    status: '请求中...',
  };
  
  // 存储防护记录到 userStore
  userStore.addTestRecord(record);

  const payloadBefore = {
    testname: testConfig.value.name,
    ip: testConfig.value.ip,
    port: testConfig.value.port,
    userID: userStore.currentUser.userID,
    equipment: selectedTool.value=='雷池'?'leichi':'modsecurity'
  };

  const payloadOne = {
    testname: testConfig.value.name,
    userID: userStore.currentUser.userID
  };

  const payloadSetting = {
    host: testConfig.value.ip,
    port: testConfig.value.port,
  };

  const payloadAfter = {
    testname: testConfig.value.name,
    userID: userStore.currentUser.userID
  };

  const payloadSettingDelete = {
      port: testConfig.value.port
  };
  console.log(payloadSetting);
  try {
    // 请求第一个接口
    await axios.post(testbefore_url, payloadBefore);
    ElMessage.success('防护前测试已发送');
    record.status = '防护前测试已发送';
    // 监听第二个接口
    const checkTestOne = async () => {
      console.log('检查是否可以开启防护设备...');
      try {
        const response = await axios.post(testone_url, payloadOne);
        if (response.data.message === "True") {
          if (selectedTool.value =='雷池') {
            // 如果已选设备为雷池，执行相关操作
            console.log('已选设备为雷池');
            
            //发送配置雷池的请求
            await axios.post(LEICHISetting_url, payloadSetting);
            ElMessage.success('雷池已配置');
            console.log('LEICHI已配置');
            record.status = '雷池已配置';

            // 发送开启雷池的请求
            await axios.get(openLEICHI_url);
            ElMessage.success('雷池已开启');
            console.log('LEICHI已开启');
            record.status = '雷池已开启';

            // 发送防护后的请求
            await axios.post(testafter_url, payloadAfter);
            ElMessage.success('防护后测试已发送');
            console.log('防护后测试已发送');
            record.status = '防护后测试已发送';

            // 监听是否可以关闭雷池的接口
            const checkTestTwo = async () => {
              console.log('检查是否可以关闭雷池...');
              try {
                const responseTwo = await axios.post(testtwo_url,payloadOne);
                if (responseTwo.data.message === "True") {
                  // 发送关闭雷池的请求
                  await axios.get(closeLEICHI_url);
                  ElMessage.success('雷池已关闭');
                  console.log('LEICHI已关闭');
                  record.status = '雷池已关闭';
                  //发送删除雷池配置的请求
                  await axios.post(LEICHISettingDelete_url, payloadSettingDelete);
                  ElMessage.success('雷池配置已删除');
                  console.log('LEICHI已删除');
                  record.status = '雷池配置已删除';

                } else {
                  setTimeout(checkTestTwo, 60000); // 每分钟检查一次
                }
              } catch (error){
                ElMessage.error('检查关闭雷池状态失败');
                record.status = '检查关闭雷池状态失败';
              }
            } 
            checkTestTwo();
          }
          else if(selectedTool.value =='ModSecurity'){
            // 如果已选设备为ModSecurity，执行相关操作
            console.log('已选设备为ModSecurity');

            // 发送开启ModSecurity的请求
            await axios.post(openModsecurity_url,payloadSetting);
            ElMessage.success('ModSecurity已开启');
            console.log('ModSecurity已开启');
            record.status = 'ModSecurity已开启';

            // 发送防护后的请求
            await axios.post(testafterModsecurity_url, payloadAfter);
            ElMessage.success('ModSecurity防护后测试已发送');
            console.log('ModSecurity防护后测试已发送');
            record.status = 'ModSecurity防护后测试已发送';

            // 监听是否可以关闭ModSecurity的接口
            const checkTestTwo_1 = async () => {
              console.log('检查是否可以关闭ModSecurity...');
              try {
                const responseTwo = await axios.post(testtwo_url,payloadOne);
                if (responseTwo.data.message === "True") {
                  // 发送关闭ModSecurity的请求
                  await axios.get(closeModsecurity_url);
                  ElMessage.success('ModSecurity已关闭');
                  console.log('ModSecurity已关闭');
                  record.status = 'ModSecurity已关闭';
                 
                } else {
                  setTimeout(checkTestTwo_1, 60000); // 每分钟检查一次
                }
              } catch (error){
                ElMessage.error('检查关闭ModSecurity状态失败');
                record.status = '检查关闭ModSecurity状态失败';
              }
            } 
            checkTestTwo_1();
          }
          
        } else {
          setTimeout(checkTestOne, 60000); // 每分钟检查一次
        }
      } catch (error) {
        ElMessage.error('检查开启防护设备状态失败');
        record.status = '检查开启防护设备状态失败';
      }
    };
    checkTestOne();
  } catch (error) {
    ElMessage.error('防护配置提交失败');
    record.status = '防护配置提交失败';
    console.log(payloadBefore);
  }

  isTestModalVisible.value = false;
};


// const resetDevices = () => {
//   Object.keys(selectedDevices.value).forEach(tool => {
//     selectedDevices.value[tool] = false;
//   });
//   ElMessage.success('已清空所有已选设备');
// };

</script>

<style scoped>
.test-config{
  height: 83vh;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.test-device h3,
.selected-device h3 {
  margin-bottom: 20px;
}
.selected-device{
  height: 67vh;
}
.test-device{
  /* margin-right: 20px; */
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  background-color: white; 
  padding: 20px 45px; 
  border-radius: 5px;
  min-height: 100%;
  width: 100%;
}
.selected-device{
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  background-color: white; 
  padding: 20px 45px; 
  border-radius: 5px;
  min-height: 100%;
}
.tool-option {
  margin-bottom: 20px;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.device-description {
  margin-top: 10px;
  color: #888;
}

.test-button-container {
  text-align: center;
  margin-top: 20%;
}

.table-container {
  max-height: 470px; /* 设置表格的最大高度 */
  overflow-y: auto; /* 超过最大高度时添加滚动条 */
  width: 100%;
  border-radius: 16px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table tr {
  height: 10px;
}

.custom-table td {
  padding: 5px 10px;
  border: none;
  width: 100%;
}

.delete-button {
  cursor: pointer;
  background-color: rgb(254, 115, 115);
  color: white;
  font-size: 10px;
  width: 65px;
  height: 25px;
  border: 1px solid white;
  border-radius: 12px;
}

.delete-button:hover {
  background-color: rgb(255, 163, 163);
}

.selected-device-container {
  width: 100%;
  height: 65vh;
  padding: 2px 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* border: 1px solid rgb(197, 221, 251); */
  border-radius: 5px;
}

</style>
