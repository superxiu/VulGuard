<template>
  <el-col :span="11">
    <div dv-bg style="padding-left: 10%; align-content: center">
      <div small-bg>
        <dv-decoration-9 style="width: 130px; height: 130px">
          <div color-green font-600 class="content" bg="~ dark/0">91%</div>
        </dv-decoration-9>
      </div>
      <div style="text-align: center" class="label"><p>>> 已防护漏洞 <<</p></div>
    </div>
  </el-col>
  <el-col :span="13">
    <div dv-bg style="padding-right: 10%; align-content: center">
      <div class="vulnerability-list">
        <div class="vulnerability-item">
          <span class="label">严危:</span>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: '12%' }"></div>
            </div>
          </div>
          <span class="count">12 </span>
        </div>
        <div class="vulnerability-item">
          <span class="label">高危:</span>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: '24%' }"></div>
            </div>
          </div>
          <span class="count">24 </span>
        </div>
        <div class="vulnerability-item">
          <span class="label">中危:</span>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: '35%' }"></div>
            </div>
          </div>
          <span class="count">35 </span>
        </div>
        <div class="vulnerability-item">
          <span class="label">低危:</span>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: '50%' }"></div>
            </div>
          </div>
          <span class="count">50 </span>
        </div>
        <div class="vulnerability-item">
          <span class="label">信息:</span>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: '78%' }"></div>
            </div>
          </div>
          <span class="count">78 </span>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.content {
  font-size: 28px;
  text-shadow: 0 0 3px #7acaec;
}

.vulnerability-list {
  text-align: center;
}

.vulnerability-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin: 10px 0;
}

.label {
  font-weight: 500;
  margin-right: 10px;
  flex: 1;
}

.progress-container {
  flex: 2;
  margin: 0 10px;
}

.progress-bar {
  width: 100%;
  background-color: #235fa7;
  border-radius: 5px;
  overflow: hidden;
  height: 8px;
}

.progress {
  height: 100%;
  background-color: aqua; /* 进度条颜色 */
}

.count {
  flex: 1;
  text-align: right;
}
</style>
