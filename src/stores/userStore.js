// import { defineStore } from 'pinia';

// export const useUserStore = defineStore('userStore', {
//     state: () => ({
//         token: null,  // 用于存储登录令牌  
//         user: null,  // 存储用户信息
//         // currentUser: null,  // 当前登录的用户
//         currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,  // 当前登录的用户
//         tasks: [],  // 存储任务信息
//     }),
//     getters: {
//         isAuthenticated: (state) => !!state.token,  // 用于检查用户是否已登录
//         isAdmin: (state) => state.currentUser && state.currentUser.username === 'test',  // 检查用户是否为管理员
//     },
//     actions: {
//         registerUser(username, password) {
//             // const user = { username, password, userID };
//             // this.userID = userID;  // 存储用户ID
//         },
//         loginUser(username, password, userID) {
//             // const user = this.users.find(u => u.username === username && u.password === password);
//             // if (user) {
//             //     this.currentUser = user;
//             //     return true;
//             // }
//             // return false;
//             this.currentUser ={ username, password, userID };
//             localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
//         },
//         logoutUser() {
//             this.currentUser = null;
//             localStorage.removeItem('currentUser');
//         },
//         setTasks(tasks) {
//             this.tasks = tasks;
//         },
//         addTask(task) {
//             this.tasks.push(task);
//         }
//     }
// });

//0710版
// import { defineStore } from 'pinia';

// export const useUserStore = defineStore('userStore', {
//   state: () => ({
//     token: localStorage.getItem('token') || null,  // 用于存储登录令牌
//     currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,  // 当前登录的用户
//     tasks: [],  // 存储任务信息
//   }),
//   getters: {
//     isAuthenticated: (state) => !!state.currentUser,  // 用于检查用户是否已登录
//     isAdmin: (state) => state.currentUser && state.currentUser.username === 'test',  // 检查用户是否为管理员
//   },
//   actions: {
//     registerUser(username, password) {
//       // 注册用户逻辑
//     },
//     loginUser(username, password, userID) {
//       this.currentUser = { username, password, userID };
//       this.token = 'some-token'; // 这里应该设置实际的token
//       localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
//       localStorage.setItem('token', this.token);
//     },
//     logoutUser() {
//       this.currentUser = null;
//       this.token = null;
//       localStorage.removeItem('currentUser');
//       localStorage.removeItem('token');
//     },
//     setTasks(tasks) {
//       this.tasks = tasks;
//     },
//     addTask(task) {
//       this.tasks.push(task);
//     }
//   }
// });

import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    tasks: [],
    testRecords: []  // 存储测试任务信息
  }),
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser && state.currentUser.username === 'test',
  },
  actions: {
    registerUser(username, password) {
      // 注册用户逻辑
    },
    loginUser(username, password, userID) {
      this.currentUser = { username, password, userID };
      this.token = 'some-token'; // 这里应该设置实际的token
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('token', this.token);
    },
    logoutUser() {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    },
    setTasks(tasks) {
      this.tasks = tasks;
    },
    addTask(task) {
      this.tasks.push(task);
    },
    addTestRecord(record) {
      this.testRecords.push(record);
    },
    updateTestRecordStatus(name, status) {
      const record = this.testRecords.find(record => record.name === name);
      if (record) {
        record.status = status;
      }
    }
  }
});

