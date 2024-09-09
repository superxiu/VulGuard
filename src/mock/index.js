// // src/mock/index.js
// import Mock from 'mockjs';

// Mock.mock('/api/login', 'post', (options) => {
//   const { username, password } = JSON.parse(options.body);
//   if (username === 'admin' && password === 'admin123') {
//     return {
//       status: 200,
//       data: {
//         token: 'fake-token-123456',
//         user: {
//           name: 'Admin',
//           roles: ['admin']
//         }
//       },
//       message: '登录成功'
//     };
//   } else {
//     return {
//       status: 401,
//       message: '用户名或密码错误'
//     };
//   }
// });

// Mock.mock('/api/register', 'post', (options) => {
//     const { username, password } = JSON.parse(options.body);
  
//     if (!username || !password) {
//       return {
//         status: 400,
//         message: '用户名和密码不能为空'
//       };
//     }
  
//     return {
//       status: 200,
//       data: {
//         username,
//         token: 'fake-token-' + Mock.Random.guid(),  // 生成一个假的令牌
//         message: '注册成功'
//       }
//     };
//   });
// src/api/index.js
// import axios from 'axios';

// // 登录请求
// export const login = async (username, password) => {
//   try {
//     const response = await axios.post('http://192.168.73.106:5000/user/login', {
//       username,
//       password
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       return {
//         status: error.response.status,
//         message: error.response.data.message
//       };
//     } else {
//       return {
//         status: 500,
//         message: '请求失败'
//       };
//     }
//   }
// };

// // 注册请求
// export const register = async (username, password) => {
//   try {
//     const response = await axios.post('http://192.168.73.106:5000/user/register', {
//       username,
//       password
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       return {
//         status: error.response.status,
//         message: error.response.data.message
//       };
//     } else {
//       return {
//         status: 500,
//         message: '请求失败'
//       };
//     }
//   }
// };
