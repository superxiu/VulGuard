<template>
  <div class="dashboard">
    <div class="dashboard-main">
      <el-row :gutter="20">
        <!-- 主内容区域 -->
        <el-col :span="17">
          <div class="dashboard-content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="top-card">
                  <div class="top-card-content">
                    <transition name="fade">
                      <p style="font-size:11px;">已发现漏洞</p>
                    </transition>
                    <div id="small-line-chart-1" class="small-line-chart"></div>
                  </div>
                  <div class="upgrade">
                    <h2>
                      <span>{{ Math.round(vulnsFound) }}</span
                      >个
                    </h2>
                    <p>+18%</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="top-card">
                  <div class="top-card-content">
                    <p style="font-size:11px;">已发现漏洞</p>
                    <div id="small-line-chart-2" class="small-line-chart"></div>
                  </div>
                  <div class="upgrade">
                    <h2>
                      <span>{{ Math.round(vulnTypes) }}</span
                      >种
                    </h2>
                    <p>+3%</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="top-card">
                  <div class="top-card-content">
                    <p style="font-size:11px;">已修复漏洞</p>
                    <div id="small-line-chart-3" class="small-line-chart"></div>
                  </div>
                  <div class="upgrade">
                    <h2>
                      <span>{{ Math.round(vulnsFixed) }}</span
                      >个
                    </h2>
                    <p>+16%</p>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 表格 -->
            <div small-bg class="mid-card">
              <div class="title">
                <n-icon size="30" color="#4E74F5" style="margin-right: 10px">
                  <MdInformationCircleOutline />
                </n-icon>
                <span>漏洞信息表</span>
              </div>
              <RecentActivitiesTable />
            </div>
            <!-- 折线图 -->
            <div class="mid-card">
              <div class="title">
                <n-icon size="30" color="#4E74F5" style="margin-right: 10px">
                  <IosTrendingUp />
                </n-icon>
                <span>漏洞发现趋势</span>
              </div>
              <LineChart />
            </div>
            <!-- 对比图 -->
            <div class="mid-card">
              <div class="title">
                <n-icon size="30" color="#4E74F5" style="margin-right: 10px">
                  <IosGitCompare />
                </n-icon>
                <span>防护前后对比</span>
              </div>
              <Compare :severityData="severityData" />
            </div>
          </div>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="7">
          <div class="dashboard-content">
            <router-link to="/screen" class="logo-card-link" style="text-decoration-line: none">
              <div class="top-card logo-card" style="background-color: #4e74f5; height: 240px; position: relative">
                <img src="@/assets/images/logo.png" class="logo-image-bottom-right" alt="Logo" />
                <!-- <img src="@/assets/images/border.svg" class="logo-image-top-left" alt="Logo" /> -->
                <div class="card-title"><h2>可视化大屏>></h2></div>
              </div>
            </router-link>
            <!-- 时间轴 -->
            <div class="card" style="height: 270px">
              <div class="title">
                <n-icon size="30" color="#4E74F5" style="margin-right: 10px">
                  <TimeOutline />
                </n-icon>
                <span>最近活动</span>
              </div>
              <TimeLine />
            </div>
            <!-- 柱状图 -->
            <div class="card">
              <div class="title">
                <n-icon size="30" color="#4E74F5" style="margin-right: 10px">
                  <PodiumOutline />
                </n-icon>
                <span>主要漏洞类型</span>
              </div>
              <VulType />
            </div>
            <!-- 饼图 -->
            <div class="card">
              <div class="title">
                <n-icon size="30" color="#4E74F5" style="margin-right: 10px">
                  <PieChartOutline />
                </n-icon>
                <span>漏洞等级分布</span>
              </div>
              <Pie />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <footer>我觉得应该要有一个页脚</footer> -->
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, nextTick } from 'vue'
import { useProtectionStore } from '@/stores/useProtectionStore'
import { MdInformationCircleOutline, IosTrendingUp, IosGitCompare } from '@vicons/ionicons4'
import { PodiumOutline, PieChartOutline, TimeOutline } from '@vicons/ionicons5'

import RecentActivitiesTable from '@/components/dashboard/RecentActivitiesTable.vue'
import VulType from '@/components/dashboard/VulType.vue'
import LineChart from '@/components/dashboard/LineChart.vue'
import Pie from '@/components/dashboard/Pie.vue'
import Compare from '@/components/dashboard/Compare.vue'
import TimeLine from '@/components/dashboard/TimeLine.vue'

const vulnsFound = ref(0)
const vulnTypes = ref(0)
const vulnsFixed = ref(0)

const protectionStore = useProtectionStore()
const severityData = ref(protectionStore.getSeverityData)

const initChart = (chartId, lineColor, areaColor, data) => {
  const chartDom = document.getElementById(chartId)
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      textStyle: {
        color: '#fff'
      },
      formatter: '{b0}: {c0} 个'
    },
    grid: {
      top: 10,
      bottom: 10,
      left: 0,
      right: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['近3天', '前天', '昨天'],
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false,
        symbol: ['none', 'arrow']
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: '发现漏洞',
        type: 'line',
        data: data,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: lineColor
        },
        areaStyle: {
          color: areaColor
        }
      }
    ]
  }
  myChart.setOption(option)
}

onMounted(async () => {
  const vulnsFoundTarget = 325
  const vulnTypesTarget = 103
  const vulnsFixedTarget = 295

  const incrementFound = vulnsFoundTarget / 100
  const incrementTypes = vulnTypesTarget / 100
  const incrementFixed = vulnsFixedTarget / 100

  const interval = setInterval(() => {
    if (vulnsFound.value < vulnsFoundTarget) {
      vulnsFound.value += incrementFound
    } else {
      vulnsFound.value = vulnsFoundTarget
    }

    if (vulnTypes.value < vulnTypesTarget) {
      vulnTypes.value += incrementTypes
    } else {
      vulnTypes.value = vulnTypesTarget
    }

    if (vulnsFixed.value < vulnsFixedTarget) {
      vulnsFixed.value += incrementFixed
    } else {
      vulnsFixed.value = vulnsFixedTarget
      clearInterval(interval)
    }
  }, 20)

  await nextTick()

  initChart('small-line-chart-1', '#52c41a', 'rgba(82, 196, 26, 0.3)', [20, 8, 15])
  initChart('small-line-chart-2', '#ff4d4f', 'rgba(255, 77, 79, 0.3)', [10, 22, 5])
  initChart('small-line-chart-3', '#4F64FF', 'rgba(151, 163, 251, 0.3)', [25, 15, 20])
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 1450px;
}

.dashboard-main {
  flex: 1;
  margin: 0 10px;
  height: 100%;
}

.dashboard-content {
  flex-grow: 1;
  margin-top: -10px;
  padding-bottom: 10px;
}

.top-card,
.mid-card,
.card {
  border-radius: 5px;
  margin-top: 20px;
  /* box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2); */
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
  background-color: white;
}
.top-card:hover,
.mid-card:hover,
.card:hover {
  box-shadow: 0 4px 24px 0 #c3cff6;
  transform: translateY(-3px);
}

.card {
  height: 400px;
}

.mid-card {
  height: 400px;
}

.top-card {
  text-align: left;
  padding: 15px 30px;
  font-family: 'outfit';
  letter-spacing: 0.5em;
  color: black;
}

.top-card:hover {
  transform: scale(1.05);
  z-index: 1;
}

.top-card span {
  font-size: 36px;
}

.top-card p {
  color: #8c8491;
  font-size: 14px;
}

.top-card h2 {
  margin-top: -5px;
}

.top-card-content {
  display: flex;
  align-items: center;
}

.upgrade {
  display: flex;
}

.upgrade p {
  padding-left: 15px;
  color: #52c41a;
}

.small-line-chart {
  width: 80px;
  height: 40px;
  margin-left: 20px;
}

.title {
  color: #2b2b2b;
  font-family: 'outfit';
  letter-spacing: 3px;
  font-size: 18px;
  margin-left: 30px;
  padding: 20px 0;
  display: flex;
  align-items: center; /* 使图标和文本在垂直方向上居中对齐 */
}

.logo-card {
  position: relative;
  overflow: hidden; /* 确保裁剪效果 */
}

.logo-image-bottom-right {
  position: absolute;
  width: 120%; /* 调整宽度以显示四分之一 */
  height: 120%; /* 调整高度以显示四分之一 */
}

.logo-image-top-left {
  position: absolute;
  width: 100%; /* 调整宽度以显示四分之一 */
  height: 100%; /* 调整高度以显示四分之一 */
}

.logo-image-bottom-right {
  bottom: 0;
  right: 0;
  transform: translate(40%, 40%); /* 调整位置 */
  opacity: 0.9; /* 设置透明度 */
}

.logo-image-top-left {
  top: 0;
  left: 0;
  transform: translate(-55%, -65%); /* 调整位置 */
  opacity: 0.9; /* 设置透明度 */
}
.card-title {
  text-decoration: none;
  padding-left: 2%;
  padding-top: 15%;
  letter-spacing: 4px;
  font-family: XYGHT;
  font-size: large;
  color: #ffffff;
}
footer {
  text-align: center;
  color: #8c8491;
}
.backtop {
  overflow: scroll;
  height: 100%;
}
</style>
