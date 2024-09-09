//优化前
// import { ref } from 'vue';
// import axios from 'axios';
// import { useUserStore } from '@/stores/userStore';

// const tableData = ref([]);
// const userStore = useUserStore();

// export const useTableData = () => {
//   const fetchData = async () => {
//     try {
//       if (!userStore.currentUser || !userStore.currentUser.userID) {
//         throw new Error('User ID is not available.');
//       }

//       const response = await axios.post('http://192.168.21.59:5000/task/get_task', {
//         userID: userStore.currentUser.userID
//       });

//       if (Array.isArray(response.data.tasks)) {
//         const tasks = response.data.tasks;

//         // Fetch scan results for each task and each IP
//         const tasksWithResults = await Promise.all(tasks.map(async (task) => {
//           const ipResults = await Promise.all(task.ips.map(async (ip) => {
//             const resultResponse = await axios.post('http://192.168.21.59:5000/task/result', {
//               taskname: task.taskname,
//               userID: userStore.currentUser.userID,
//               ip
//             });

//             const resultData = resultResponse.data.result || [];
//             const scanResults = resultData[0]?.existing_have_leaks || [];
//             const levels = resultData[0]?.level || {};

//             return {
//               ip,
//               scanResults,
//               levels: {
//                 critical: levels.four || 0,
//                 high: levels.three || 0,
//                 medium: levels.two || 0,
//                 low: levels.one || 0,
//                 info: levels.zero || 0,
//               }
//             };
//           }));

//           return {
//             endTime: task.endtime || '-',
//             startTime: task.starttime || '-',
//             status: task.status,
//             name: task.taskname,
//             ips: ipResults
//           };
//         }));

//         userStore.setTasks(tasksWithResults);
//         tableData.value = tasksWithResults;
//         console.log('Fetched data:', tasksWithResults);
//       } else {
//         console.error('Unexpected data format:', response.data);
//         throw new Error('Unexpected data format');
//       }

//       return tableData.value;
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//       throw error;
//     }
//   };

//   return {
//     tableData,
//     fetchData,
//   };
// };

//只获取任务列表
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
const apiUrl = import.meta.env.VITE_API_URL;
// 构建请求的完整URL
const gettask_url = `${apiUrl}/task/get_task`;

const tableData = ref([]);
const userStore = useUserStore();

export const useTableData = () => {
  // Fetch task information
  const fetchTasks = async () => {
    try {
      if (!userStore.currentUser || !userStore.currentUser.userID) {
        throw new Error('User ID is not available.');
      }

      const response = await axios.post(gettask_url, {
        userID: userStore.currentUser.userID
      });

      if (Array.isArray(response.data.tasks)) {
        const tasks = response.data.tasks.map(task => ({
          endTime: task.endtime || '-',
          startTime: task.starttime || '-',
          status: task.status,
          name: task.taskname,
          ips: task.ips
        }));

        userStore.setTasks(tasks);
        tableData.value = tasks;
        console.log('Fetched tasks:', tasks);
      } else {
        console.error('Unexpected data format:', response.data);
        throw new Error('Unexpected data format');
      }

      return tableData.value;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  };

  return {
    tableData,
    fetchTasks
  };
};
