import { createApp } from 'vue'
import router from './router'
import './style.css'
//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
import * as ElIcons from '@element-plus/icons-vue';
import axios from 'axios';
import './mock/index'; 
import { createPinia, defineStore } from 'pinia'
import DataVVue3 from '@kjgl77/datav-vue3'
import naive from 'naive-ui';
import App from './App.vue'
import i18n from './i18n';
import './styles/element-variables.scss' // 引入自定义样式
import 'magic.css/dist/magic.min.css'; // 引入 Magic.css
import * as THREE from '../public/js/three.min.js';
import VANTA from '../public/js/vanta.net.min.js';

const pinia = createPinia()

const app = createApp(App)

// 注册图标组件
for (const [key, component] of Object.entries(ElIcons)) {
    app.component(key, component);
  }
  
  // 使 axios 可以在组件内通过 this.$axios 访问
app.config.globalProperties.$axios = axios;

app.use(DataVVue3)
app.use(i18n);
app.use(naive)
app.use(pinia)
app.use(ElementPlus) //将 ElementPlus 插件注册到 Vue 应用中
app.use(router)
app.use(THREE)
app.use(VANTA)
app.mount('#app')
