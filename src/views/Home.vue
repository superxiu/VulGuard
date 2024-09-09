<template>
  <div class="home-container" style="overflow: hidden;">
    <div class="background-container"></div>
    <LoadingSpinner />
    <el-row type="flex" justify="center" align="middle" style="height: 100vh;width: 100%;">
      <el-col :span="24" class="content-section">
        <div class="text-and-image">
          <div class="text-section">
            <h1 class="title">网络安全测试验证靶场平台</h1>
            <p class="subtitle"><span ref="typedSubtitle"></span></p>
            <div class="button-container">
              <el-button type="primary" class="get-started-button" style="font-family: 'RZZY';" @click="getStarted">
                立即体验
                <el-icon style="margin-left: 15px;"><Right /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElButton, ElRow, ElCol } from 'element-plus';
import { useRouter } from 'vue-router';
import LoadingSpinner from '../components/loading/LoadingSpinner.vue';
import { showLoading, hideLoading } from '@/services/loadingService/loadingService';
import Typed from 'typed.js';

const router = useRouter();
const typedSubtitle = ref(null);
const isLoading = ref(true);

const getStarted = () => {
  router.push('/workbrench');
  console.log('Get Started button clicked');
};

onMounted(() => {
  // 显示全屏加载动画
  showLoading();

  // 模拟异步加载，3秒后关闭加载动画
  setTimeout(() => {
    hideLoading();
  }, 3000);

  // 打字机效果
  const options = {
    strings: ['信创之盾，筑牢网络安全防线','赋能信创，护航数字安全新纪元','守护您的数字世界，确保每一个环节的安全'],
    typeSpeed: 50,
    backSpeed: 25,
    loop: true,
  };
  const typed = new Typed(typedSubtitle.value, options);

  // 组件卸载时销毁 typed 实例
  onBeforeUnmount(() => {
    typed.destroy();
  });
});
</script>

<style lang="scss" scoped>
.home-container {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/4-purple.png');
  background-repeat: no-repeat;
  background-size: 100% 103%;
}

.content-section {
  min-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  margin-top: 10%;
  padding-top: 0px;
}

.text-and-image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10vh;
  padding-top: 10vh;
  min-width: 100%;
}

.text-section {
  text-align: left;
  margin-right: 30%;
  min-width: 60%;
}

.title {
  font-family: 'RZZY';
  font-weight: lighter;
  font-size: 60px;
  background: linear-gradient(45deg, #4E74F5, #FFFFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 30px;
  margin-top: 0;
}

.subtitle {
  font-family: 'outfit';
  font-size: 24px;
  color: #4E74F5;
  max-width: 60%;
  height: 50px;
  overflow-wrap: normal;
}

.image-section {
  display: flex;
  align-items: right;
}

.platform-image {
  max-width: 300px;
  height: auto;
}

.button-container {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 5vh;
}

.get-started-button {
  display: block;
  position: relative;
  background: #4E74F5;
  border: 1px solid transparent;
  border-radius: 50px;
  height: 50px;
  text-align: center;
  text-decoration: none;
  color: white;
  font-family: 'outfit';
  line-height: 50px;
  font-size: 18px;
  padding: 0 70px;
  white-space: nowrap;
  margin-top: 25px;
  transition: background .5s ease;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 100px;
    background: white;
    bottom: -25px;
    left: 0;
    border: 2px solid white;
    transform: translateX(-50px) rotate(45deg);
    transition: transform .5s ease;
  }
  
  &:hover {
    background: transparent;
    border-color: #4E74F5;
    color: #4E74F5;
    
    &:before {
      transform: translateX(265px) rotate(45deg);
    }
  }
}
</style>
