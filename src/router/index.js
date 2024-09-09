import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/Default.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/Screen.vue')
  },

  {
    path: '/workbrench/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',  // 空路径表示 '/workbrench' 的默认页面
        redirect: '/workbrench/dashboard',  // 这里使用相对路径
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'scan-tasks',
        name: 'ScanTasks',
        component: () => import('@/views/VulnerabilityScan.vue'),
      },
      {
        path: 'new-test',
        name: 'NewTest',
        component: () => import('@/views/NewTest.vue'),
      },
      {
        path: 'test-list',
        name: 'TestList',
        component: () => import('@/views/TestList.vue'),
        // component: () => import('@/components/deviceprotection/assessReport.vue'),
      },
      {
        path: 'risk-assessment',
        name: 'RiskAssessment',
        component: () => import('@/views/RiskAssessment.vue'),
        // component: () => import('@/components/riskassess/RiskDetails.vue'),
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
