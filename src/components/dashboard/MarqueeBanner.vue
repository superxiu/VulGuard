<template>
  <div class="marquee-banner">
    <div class="marquee-content">
      <span v-for="(message, index) in messages" :key="index" class="marquee-message">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: ['信创之盾，筑牢网络安全防线', '赋能信创，护航数字安全新纪元', '守护您的数字世界，确保每一个环节的安全']
    }
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
}
.marquee-banner {
  width: 100%;
  overflow: hidden;
  background-color: white;
  color: #08395a;
  font-size: 16px;
  letter-spacing: 2px;
  padding: 10px 5px;
  white-space: nowrap;
  box-sizing: border-box;
  border-radius: 100px;
  position: relative;
  box-shadow: inset 0 1px 8px #93cef5; /* 内阴影 */
}

.marquee-content {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 35s linear infinite;
}

.marquee-message {
  display: inline-block;
  padding: 0 5rem;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
