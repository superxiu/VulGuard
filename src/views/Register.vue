<template>
  <div id="register-background" class="register-container">
    <el-form ref="registerForm" :model="registerForm" class="register-form" @submit.prevent="onRegisterSubmit">
      <h2 style="font-family: 'RZZY', sans-serif; font-weight: lighter; margin-top: 20px;">注册</h2>      
        <el-form-item prop="username">
          <div class="input-wrapper">
            <el-input v-model="registerForm.username" placeholder="username" autocomplete="username" @input="forceUpdate"></el-input>
          </div>
        </el-form-item>
      <el-form-item prop="password">
         <div class="input-wrapper">
          <el-input type="password" v-model="registerForm.password" placeholder="password" autocomplete="new-password" @input="forceUpdate"></el-input>
        </div>
      </el-form-item>
      <!-- <el-form-item prop="role">
        <el-select v-model="registerForm.role" placeholder="Select Role" @change="onRoleChange">
          <el-option label="普通用户" value="user"></el-option>
          <el-option label="管理员" value="admin"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item v-if="isAdmin" prop="adminKey">
        <el-input type="text" v-model="registerForm.adminKey" placeholder="administrator key"></el-input>
      </el-form-item> -->
      <el-form-item class="button-container">
        <el-button type="primary" plain @click="onRegisterSubmit" class="confirm-button">确定</el-button>
        <router-link to="/" class="custom-link">
            返回登录
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';  
import axios from '@/axios';  // 引入 axios 实例
import { ElNotification } from 'element-plus';

const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const register_url = `${apiUrl}/user/register`;

const router = useRouter();  
const registerForm = ref({
  username: '',
  password: '',
});
let vantaEffect = null;  // 用于存储 Vanta.js 效果的变量
const isAdmin = ref(false);

// const onRegisterSubmit = () => { 
//     router.push('/register');
//     return;
// };
// 发送注册请求
const onRegisterSubmit = async () => {
  try {
    const response = await axios.post(register_url, {
      username: registerForm.value.username,
      password: registerForm.value.password
    });
    if (response.data.message === 'User created successfully') {     
        ElNotification({
          title: '成功',
          message: '注册成功，请登录',
          type: 'success',
        });
        router.push('/'); // 注册成功后跳转到登录页面
    } else {
      ElNotification({
        title: '注册失败',
        message: response.data.message,
        type: 'error',
      });
    }
  } catch (error) {
    ElNotification({
      title: '错误',
      message: '网络错误或服务器问题：' + (error.response ? error.response.data.message : '服务器无响应'),
      type: 'error',
    });
  }
};

// const onRoleChange = (newRole) => {
//   isAdmin.value = newRole === 'admin';
// };

onMounted(() => {
  if (VANTA) {
    vantaEffect = VANTA.NET({
      el: "#register-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4E74F5,
        backgroundColor: 0x000000
    });
  }
});

onUnmounted(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
});

const forceUpdate = () => {
  registerForm.value = { ...registerForm.value };
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F0F6FD;
  font-family: 'outfit';
}

.register-form {
  z-index: 10; 
  width: 20%;
  height: 320px; /* Adjust height based on content */
  padding: 20px;
  border-radius: 15px;
  background-color: rgba(78, 116, 245, 0.3); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  text-align: center;
  color: #ffffff;
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10%;
}

.el-button {
  margin-left: 0;
  width: 100%; /* Adjust button width */
  margin-top: 10%;
  color: #4E74F5;
}
.el-button:hover {
    background-color: #4E74F5; /* 更改背景颜色 */
    border-color: #4E74F5; /* 更改边框颜色 */
    color: #ffffff;
}
.custom-link{
    font-size:10px; 
    color: #ffffff;
    margin-top:0px;
    cursor:pointer;
    width:19%;
    padding:0; 
    text-decoration: none;
    margin-left: 15px;
}
.custom-link:hover {
  text-decoration: underline;
}

.el-input{
  width: 90%;
}

.input-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.confirm-button {
  background-color: #4E74F5;
  color: #ffffff;
  width: 90%;
  margin-left: 15px;
  height: 35px;
  border-radius: 10px;
  font-weight: bold;
}

.confirm-button:hover {
  color: #4E74F5; /* 更改背景颜色 */
  border-color: #4E74F5; /* 更改边框颜色 */
  background-color: #ffffff;
}
</style>
