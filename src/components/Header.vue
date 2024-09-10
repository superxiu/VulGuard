<template>
  <el-header class="header">
    <div class="header-content">
      <div class="header-left">
        <!-- ECharts 容器
        <div id="echarts-title-animation" class="echarts-container"></div> -->
      </div>
      <span class="user-role">{{ userStore.isAuthenticated ? (userStore.isAdmin ? '管理员' : '普通用户') : '请登录' }}</span>
      <el-popover
        placement="bottom"
        width="100"
        trigger="hover"
      >
        <template v-if="userStore.isAuthenticated">
          <el-button @click="logout" type="text" class="auth-button">
            退出登录
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16" style="margin-left: 10px;">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </el-button>
        </template>
        <template v-else>
          <el-button @click="login" type="text" class="auth-button">
            登录
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16" style="margin-left: 10px;">
              <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5.5.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
              <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
            </svg>
          </el-button>
        </template>
        <template #reference>
          <template v-if="userStore.isAuthenticated && userStore.isAdmin">
            <img src="@/assets/images/myAvatar.jpg" alt="Avatar" class="avatar-img" />
          </template>
          <template v-else>
            <i class="bi bi-person-circle" style="color:#4E74F5; font-size:2rem;"></i>
          </template>
        </template>
      </el-popover>
    </div>
  </el-header>
</template>

<script>
import * as echarts from 'echarts';
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';

export default {
  setup() {
    const userStore = useUserStore();
    const logout = () => {
      userStore.logoutUser();
      window.location.href = '/'; // 登录页路径是 /
    };

    const login = () => {
      window.location.href = '/'; // 跳转到登录页
    };

    return {
      logout,
      login,
      userStore
    };
  },
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;
  height: 45px;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: right;
}

.user-role {
  margin-right: 10px;
  /* font-weight: bold; */
  font-family: 'HCYHT';
  font-size: 16px;
  color:#4E74F5;
}

.avatar-img {
  width: 36px; /* 调整图片大小 */
  height: 36px;
  border-radius: 50%; /* 圆形头像 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
}

.auth-button {
  width: 100%;
  text-align: center;
  font-family: 'RZZY';
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: left;
}
</style>
