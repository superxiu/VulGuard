<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="logo-container">
        <img class="logo" src="@/assets/images/logo-2.png" alt="logo">
        <!-- ECharts 容器 -->
        <div id="echarts-title-animation" class="echarts-container"></div>
      </div>
      <div class="menu-container">
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="filteredMenuOptions"
          @update:value="handleMenuSelect"
        />
      </div>
    </n-layout-sider>
  </n-config-provider>
</template>

<script>
import { ref, h, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import * as echarts from 'echarts';
import {
  LaptopOutline,
  PieChartOutline,
  ScanCircleOutline,
  ListCircleOutline,
  ShieldCheckmarkOutline,
  PulseOutline,
  PeopleOutline,
  ToggleOutline,
  ListOutline
} from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import { NConfigProvider } from 'naive-ui';

export default {
  props: {
    activeTab: String,
  },
  setup(props, { emit }) {
    const collapsed = ref(false);
    const activeKey = ref('');
    const router = useRouter();
    const userStore = useUserStore();

    const renderIcon = (icon) => {
      return () => h(NIcon, null, { default: () => h(icon) });
    };

    const menuOptions = ref([
      { label: '仪表盘', key: 'Dashboard', icon: renderIcon(PieChartOutline) },
      { label: '漏洞扫描', key: 'ScanTasks', icon: renderIcon(ScanCircleOutline) },
      { 
        label: '设备防护验证', 
        key: 'DeviceProtection', 
        icon: renderIcon(ShieldCheckmarkOutline),
        children: [
          { label: '防护设备', key: 'NewTest', icon: renderIcon(ToggleOutline) },
          { label: '防护列表', key: 'TestList', icon: renderIcon(ListOutline) },
        ],
      },
      { label: '安全性评估', key: 'RiskAssessment', icon: renderIcon(PulseOutline) },
      { label: '用户管理', key: 'UserManagement', icon: renderIcon(PeopleOutline) },
    ]);

    const filteredMenuOptions = computed(() => {
      if (!userStore.isAuthenticated || !userStore.isAdmin) {
        return menuOptions.value.filter(option => option.key !== 'UserManagement');
      }
      return menuOptions.value;
    });

    const handleMenuSelect = (key) => {
      const selectedOption = menuOptions.value.find(option => option.key === key) ||
                             menuOptions.value.flatMap(option => option.children || []).find(option => option.key === key);
      if (selectedOption) {
        emit('menu-select', selectedOption.key, selectedOption.label);
        activeKey.value = selectedOption.key;
      }
    };

    watch(() => props.activeTab, (newVal) => {
      activeKey.value = newVal;
    });

    const themeOverrides = {
      common: {
        baseColor: '#4E74F5'
      },
      Menu: {
        borderRadius: '20px',
        color: '#F9FAFE',
        itemColorActive: '#4E74F5',
        itemColorHover: 'rgba(78, 116, 245, 0.15)',
        itemColorActiveHover: 'rgba(78, 116, 245, 0.63)',
        itemTextColor: 'black',
        itemIconColor: 'black',
        itemTextColorActive: 'white',
        itemIconColorActive: 'white',
        itemTextColorActiveHover: 'white',
        itemIconColorActiveHover: 'white',
        itemTextColorChildActive: '#4E74F5', // 子菜单项被选中时，父菜单项文字的颜色
        itemIconColorChildActive: '#4E74F5', // 子菜单项被选中时，父菜单项图标的颜色
        itemTextColorChildActiveHover: '#4E74F5', // 子菜单项被选中时，父菜单项文字的悬停颜色
        itemIconColorChildActiveHover: '#4E74F5', // 子菜单项被选中时，父菜单项图标的悬停颜色
        arrowColorChildActive: '#4E74F5', // 子菜单项被选中时，父菜单项箭头的颜色
        arrowColorChildActiveHover: '#4E74F5' // 子菜单项被选中时，父菜单项箭头的悬停颜色
      }
    };

    return {
      collapsed,
      activeKey,
      filteredMenuOptions,
      handleMenuSelect,
      themeOverrides
    };
  },
  mounted() {
    nextTick(() => {
      this.initEChartsAnimation();
      setInterval(this.initEChartsAnimation, 15000);
    });
  },
  methods: {
    initEChartsAnimation() {
      const chartDom = document.getElementById('echarts-title-animation');
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          graphic: {
            elements: [
              {
                type: 'text',
                left: 'left',
                top: 'center',
                style: {
                  text: '安信探云',
                  fontSize: 25,
                  fontWeight: 'normal',
                  fontFamily: 'XYGHT',
                  lineDash: [0, 200],
                  lineDashOffset: 0,
                  fill: 'transparent',
                  stroke: '#4E74F5',
                  lineWidth: 1
                },
                keyframeAnimation: {
                  duration: 3000,
                  loop: false,
                  keyframes: [
                    {
                      percent: 0.7,
                      style: {
                        fill: 'transparent',
                        lineDashOffset: 200,
                        lineDash: [200, 0]
                      }
                    },
                    {
                      percent: 0.8,
                      style: {
                        fill: 'transparent'
                      }
                    },
                    {
                      percent: 1,
                      style: {
                        fill: '#4E74F5'
                      }
                    }
                  ]
                }
              }
            ]
          }
        };
        myChart.setOption(option);
      } else {
        console.error('DOM element not found for ECharts');
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  background-color: #D1DFFD; /* 默认背景色 */
}
.menu-container{
  /* margin-top: 30px; */
}
.logo-container{
  width:240px;
  height: 100px;
  display: flex;
  /* align-items: center; */
  padding-top: 18px;
  justify-content: center;
  background-color: #F9FAFE;
}
.logo{
  width: 35px;
  height: 35px;
  margin-right: 8px;
  margin-bottom: 0;
}

.echarts-container {
  width: 130px; /* 设定宽度 */
  height: 30px; /* 设定高度 */
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.menu-container ::v-deep .n-menu-item,
.menu-container ::v-deep .n-submenu-title {
  height: 60px; 
  line-height: 60px;
  padding-top: 0; 
  padding-bottom: 0; 
}

.menu-container ::v-deep .n-menu-item-content,
.menu-container ::v-deep .n-submenu-title-content {
  height: 100%; 
}

.menu-container ::v-deep .n-menu-item.is-active,
.menu-container ::v-deep .n-submenu-title.is-active {
  background-color: #002569 !important; /* 自定义背景色 */
  color: #fff !important; 
}
</style>
