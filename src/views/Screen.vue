<template>
  <dv-full-screen-container class="container">
    <div>
      <Header />
    </div>
    <div class="content">
      <el-row :gutter="10">
        <!-- 左边 -->
        <el-col :span="6">
          <div class="beside">
            <!-- 用户数据统计 -->
            <div class="demo-bg-wrapper">
              <dv-border-box13 class="count">
                <TitleComponent title="统计概览"></TitleComponent>
                <div style="padding: 2% 5%"><Count /></div>
              </dv-border-box13>
            </div>
            <!-- 漏洞百分比 -->
            <dv-border-box13 style="height: 250px">
              <TitleComponent title="漏洞等级分布"></TitleComponent>
              <el-row style="padding-top: 1%">
                <Percent />
              </el-row>
            </dv-border-box13>
            <!-- 漏洞排名 -->
            <dv-border-box13>
              <TitleComponent title="漏洞数量排名"></TitleComponent>
              <div dv-bg><Rank /></div>
            </dv-border-box13>
          </div>
        </el-col>
        <el-col :span="12">
          <!-- 中间 -->
          <div class="middle">
            <!-- 地球 -->
            <!-- 地球已改成旭日图 -->
            <div class="earth-container">
              <div class="maptitle">
                <div class="zuo"></div>
                <span class="titletext">漏洞信息概览</span>
                <div class="you"></div>
              </div>
              <Sun />
            </div>
            <!-- Bottom -->
            <dv-border-box13>
              <el-row style="height: 120px">
                <el-col :span="24"><TitleComponent title="近期漏洞防护趋势"></TitleComponent><Bottom /></el-col>
              </el-row>
            </dv-border-box13>
          </div>
        </el-col>
        <!-- 右边 -->
        <el-col :span="6">
          <div class="beside">
            <!-- 柱状图加折线图 -->
            <dv-border-box13>
              <TitleComponent title="动态扫描与防护视图"></TitleComponent>
              <div dv-bg><Line /></div>
            </dv-border-box13>
            <!-- 表格 -->
            <dv-border-box13 style="height: 365px">
              <TitleComponent title="漏洞信息列表"></TitleComponent>
              <Table />
            </dv-border-box13>
          </div>
        </el-col>
      </el-row>
    </div>
  </dv-full-screen-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Header from '@/components/screen/Header.vue'
import Sun from '@/components/screen/Sun.vue'
import Rank from '@/components/screen/Rank.vue'
import Line from '@/components/screen/Line.vue'
import Count from '@/components/screen/Count.vue'
import Percent from '@/components/screen/Percent.vue'
import Table from '@/components/screen/Table.vue'
import Bottom from '@/components/screen/Bottom.vue'
import TitleComponent from '@/components/screen/slot/TitleComponent.vue'
import { BorderBox13 as DvBorderBox13 } from '@kjgl77/datav-vue3'

const refreshOnFullScreenChange = () => {
  if (document.fullscreenElement) {
    console.log('Entered fullscreen mode')
    document.body.style.visibility = 'hidden'
    setTimeout(() => {
      document.body.style.visibility = 'visible'
    }, 0) // Force reflow/repaint
  } else {
    console.log('Exited fullscreen mode')
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', refreshOnFullScreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', refreshOnFullScreenChange)
})
</script>

<style scoped>
.container {
  color: aqua;
  font-family: XYGHT;
  height: 100vh;
  background-image: url('@/assets/images/img/pageBg.png');
  background-size: cover;
  background-position: center center;
}

.content {
  margin-top: 1%;
  padding: 0% 1%;
}

.middle {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
}

.earth-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 20px;
}

.maptitle {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.maptitle .titletext {
  font-size: 25px;
  font-weight: 900;
  letter-spacing: 6px;
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 10px;
}

.maptitle .zuo,
.maptitle .you {
  background-size: 100% 100%;
  width: 29px;
  height: 20px;
  margin-top: 8px;
}

.maptitle .zuo {
  background: url('@/assets/images/img/xiezuo.png') no-repeat;
}

.maptitle .you {
  background: url('@/assets/images/img/xieyou.png') no-repeat;
}

.demo-bg-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
