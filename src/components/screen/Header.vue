<template>
  <div class="d-flex jc-center title_wrap">
    <div class="zuojuxing"></div>
    <div class="youjuxing"></div>
    <div class="guang"></div>
    <div class="d-flex jc-center title-container">
      <div class="logo"></div>
      <div class="title">
        <span class="title-text">安信探云可视化大屏</span>
      </div>
    </div>
    <div class="besides">
      <div class="right-btn">
        <div small-bg>
          <dv-decoration8 :reverse="false" style="width: 285px; height: 40px" />
        </div>
        <button class="return-button" @click="goToDashboard">返回仪表盘>></button>
      </div>
      <div class="left-btn">
        <div small-bg>
          <dv-decoration8 :reverse="true" style="width: 285px; height: 40px" />
        </div>
        <div class="current-time">< < {{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const currentTime = ref('')

const updateCurrentTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
})

const router = useRouter()

const goToDashboard = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<style scoped>
.title_wrap {
  height: 60px;
  background-image: url('@/assets/images/img/top.png');
  background-size: cover;
  background-position: center center;
  position: relative;
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title_wrap .guang {
  position: absolute;
  bottom: -26px;
  left: 42.5%;
  transform: translateX(-50%);
  background-image: url('@/assets/images/img/guang.png');
  background-position: center;
  width: 100%;
  height: 56px;
}

.title_wrap .zuojuxing,
.title_wrap .youjuxing {
  position: absolute;
  top: -2px;
  width: 140px;
  height: 6px;
  background-image: url('@/assets/images/img/headers/juxing1.png');
}

.title_wrap .zuojuxing {
  left: 5%;
}

.title_wrap .youjuxing {
  right: 5%;
  transform: rotate(180deg);
}

.title_wrap .title-container {
  display: flex;
  align-items: center;
  position: relative;
  text-align: center;
  background-size: cover;
  height: 60px;
}

.title_wrap .logo {
  background-image: url('@/assets/images/logo-2.png');
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10px;
  margin-bottom: 5px;
}

.title_wrap .title {
  flex: 1;
  text-align: left;
  color: transparent;
  height: 60px;
  line-height: 46px;
  z-index: 1;
}

.title_wrap .title .title-text {
  font-size: 38px;
  font-weight: 900;
  letter-spacing: 6px;
  width: 100%;
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title_wrap .btn-text {
  padding-left: 83px;
  letter-spacing: 0.5rem;
  font-weight: 1000;
  font-size: 15px;
}

.title_wrap .besides {
  position: absolute;
  bottom: 0;
  top: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.title_wrap .current-time {
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.return-button {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 100px; /* 添加左边距 */
  letter-spacing: 0.5rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: background 0.3s ease;
  background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.return-button:hover {
  background: linear-gradient(92deg, aqua 0%, aqua 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

::v-deep svg polyline {
  stroke: #215aff !important;
  stroke-width: 1 !important;
}

::v-deep .centered-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
