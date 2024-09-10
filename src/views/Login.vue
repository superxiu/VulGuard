<template>
  <div id="login-background" class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" @submit.prevent="onLogin">
      <h2 style="font-family: 'RZZY', sans-serif; font-weight: lighter; margin-top: 20px;">登录</h2>
      <div class="input-container">
        <el-form-item prop="username">
          <div class="input-wrapper">
            <el-input v-model="loginForm.username" placeholder="username" autocomplete="username" @input="forceUpdate" class="custom-input"></el-input>
          </div>
        </el-form-item>
      </div>
      <div class="input-container">
        <el-form-item prop="password">
          <div class="input-wrapper">
            <el-input type="password" v-model="loginForm.password" placeholder="password" autocomplete="current-password" @input="forceUpdate" class="custom-input"></el-input>
          </div>
        </el-form-item>
      </div>
      <router-link to="" class="custom-link">
        忘记密码
      </router-link>
      <el-form-item class="button-container">
        <el-button type="primary" plain @click="onLogin" class="login-button">登录</el-button>
        <el-button type="primary" plain @click="onRegister" class="register-button">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';  
import axios from '@/axios';  // 引入 axios 实例
import { useUserStore } from '@/stores/userStore';  // 导入 user store
import NET from 'vanta/dist/vanta.net.min'; // 引入Vanta.NET
  
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const login_url = `${apiUrl}/user/login`;
const selectoneuser_url = `${apiUrl}/user/select_one_user`;

const userStore = useUserStore();  // 使用 user store
const router = useRouter();  
const loginForm = ref({
  username: '',
  password: ''
});
let vantaEffect = null;  // 用于存储 Vanta.js 效果的变量

const loginBackground = ref(null);

onMounted(() => {
  if (loginBackground.value) {
    vantaEffect = NET({
      el: loginBackground.value,
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

const onLogin = async () => {
  try {
    const response = await axios.post(login_url, {
      username: loginForm.value.username,
      password: loginForm.value.password
    });
    if (response.status === 200) {
      console.log('登录成功:', response.data);
      const userIDResponse = await axios.post(selectoneuser_url, {
        username: loginForm.value.username,
      });
      if (userIDResponse.status === 200) {
        const userID = userIDResponse.data.user.userID;
        // 将获取到的userID存入store
        userStore.loginUser(loginForm.value.username, loginForm.value.password, userID);
        console.log(userID);
        console.log('登录成功:', response.data);
        ElNotification({
          title: '成功',
          message: '登录成功',
          type: 'success',
        });
        // router.push('/workbrench');
        router.push('/home');
      }
    } else {
      console.error('登录失败:', response.data.message);
      ElNotification({
        title: '错误',
        message: '登录失败: ' + response.data.message,
        type: 'error',
      });
    }
  } catch (error) {
    console.error('请求错误:', error);
    ElNotification({
      title: '错误',
      message: '网络请求错误',
      type: 'error',
    });
  }
};

const onRegister = () => {
  router.push('/register');
  console.log('Redirect to register');
};

const forceUpdate = () => {
  // 使用 Vue 3 的 Composition API，不应该再使用 this.$forceUpdate()
  loginForm.value = { ...loginForm.value };
};

</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F0F6FD;
}

.login-form {
  z-index: 10; 
  width: 20%;
  height: 320px;
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
  align-items: center;
  margin-top: 5%;
}

.login-button {
  width: 42.5%;
  margin-top: 0;
  margin-left: 15px;
  background-color: #4E74F5;
  color: #ffffff;
  border-radius: 10px;
  height: 35px;
  font-weight: bold;
}

.login-button:hover {
  color: #4E74F5; /* 更改背景颜色 */
  border-color: #4E74F5; /* 更改边框颜色 */
  background-color: #ffffff;
}

.register-button {
  width: 42.5%;
  height: 35px;
  margin-top: 0;
  margin-right: 0px;
  color: #4E74F5;
  border-radius: 10px;
  font-weight: bold;
}

.register-button:hover {
  background-color: #4E74F5; /* 更改背景颜色 */
  border-color: #4E74F5; /* 更改边框颜色 */
  color: #ffffff;
}

.custom-link{
  font-size: 10px; 
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 30px;
  margin-left: 15px;
  cursor: pointer;
  width: 19%;
  padding: 0; 
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline;
}

.el-input{
  margin-top: 0px;
  width: 90%;
  z-index: 100;
  background-color: rgb(54, 54, 54) !important;
}

.input-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.custom-input .el-input {
  background-color: black !important;
  color: #4E74F5 !important;
}
</style>
