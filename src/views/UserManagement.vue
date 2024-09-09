<template>
  <div class="user-management">
    <h3 class="title-with-line">用户管理</h3>
    <el-form :model="searchForm" inline>
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUser">搜索</el-button>
      </el-form-item>
    </el-form>

    <TableSkeleton :loading="isLoading" :rows="10">
      <template #default>
        <el-table :data="paginatedUsers" class="user-table" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="id" label="用户ID" width="260"></el-table-column>
          <el-table-column prop="username" label="用户名" width="280"></el-table-column>
          <el-table-column label="密码" width="280">
            <template #default="scope">
              <span>••••••••</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button type="primary" size="mini" @click="confirmResetPassword(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableSkeleton>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        layout="prev, pager, next"
        :total="filteredUsers.length"
        :page-size="pageSize"
        @current-change="handlePageChange"
        :current-page="currentPage"
        style="margin-top: 20px;"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import { ElMessageBox, ElMessage } from 'element-plus';
import TableSkeleton from '@/components/loading/TableSkeleton.vue';

const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const user_url = `${apiUrl}/user/`;
const reset_url = `${apiUrl}/user/reset_password`;

export default {
  name: "UserManagement",
  components: {
    TableSkeleton
  },
  setup() {
    const searchForm = ref({
      username: ''
    });

    const users = ref([]);
    const filteredUsers = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const isLoading = ref(true);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(user_url);
        users.value = response.data.users; // 提取用户数据
        filteredUsers.value = [...users.value];
        isLoading.value = false;
      } catch (error) {
        ElMessage.error('获取用户数据失败');
        console.error('Failed to fetch users:', error);
        isLoading.value = false;
      }
    };

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredUsers.value.slice(start, start + pageSize.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const searchUser = () => {
      if (searchForm.value.username) {
        filteredUsers.value = users.value.filter(user => user.username.includes(searchForm.value.username));
      } else {
        filteredUsers.value = [...users.value];
      }
      currentPage.value = 1;
    };

    const resetPassword = async (username) => {
      try {
        await axios.post(reset_url, { username: username });
        ElMessage({
          type: 'success',
          message: '密码已重置!',
        });
      } catch (error) {
        ElMessage.error('重置密码失败');
        console.error('Failed to reset password:', error);
      }
    };

    const confirmResetPassword = (user) => {
      ElMessageBox.confirm('确定要重置该用户的密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        resetPassword(user.username);
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消重置',
        });
      });
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      searchForm,
      paginatedUsers,
      filteredUsers,
      currentPage,
      pageSize,
      isLoading,
      searchUser,
      handlePageChange,
      confirmResetPassword,
    };
  }
};
</script>

<style scoped>
.user-management {
  background-color: white;
  padding: 20px 45px; 
  border-radius: 5px;
  min-height: 90%;
}

.el-form-item {
  margin-right: 10px;
}

.el-table-column {
  text-align: center;
}

.dialog-footer {
  text-align: right;
  margin: 0;
  padding: 10px 0;
}

.pagination-container {
  display: flex;
  justify-content: right;
  margin-top: 5px;
}
</style>
