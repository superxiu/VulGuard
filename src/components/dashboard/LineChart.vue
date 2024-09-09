<template>
  <div class="chart-container">
    <div class="title-container">
      <n-space align="center" class="date-selector">
        <n-select v-model:value="selectedRange" :options="options" :style="{ width: '400px' }" @update:value="updateChart" />
      </n-space>
    </div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'StackedAreaChart',
  setup() {
    const selectedRange = ref('7')
    const options = ref([
      { label: '近7天', value: '7' },
      { label: '近14天', value: '14' },
      { label: '近30天', value: '30' }
    ])

    const chart = ref(null)
    const dateUpdater = ref(null) // 用于存储定时器

    const generateDates = (days) => {
      const dates = []
      const today = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(today.getDate() - i)
        dates.push(`${date.getMonth() + 1}-${date.getDate()}`)
      }
      return dates
    }

    const chartData = ref({
      7: {
        dates: generateDates(7),
        values: [
          [120, 132, 101, 134, 90, 230, 210],
          [220, 182, 191, 234, 290, 330, 310],
          [150, 232, 201, 154, 190, 330, 410],
          [320, 332, 301, 334, 390, 330, 320],
          [820, 932, 901, 934, 1290, 1330, 1320]
        ]
      },
      14: {
        dates: generateDates(14),
        values: [
          [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
          [210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340],
          [160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
          [300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430],
          [900, 910, 920, 930, 940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030]
        ]
      },
      30: {
        dates: generateDates(30),
        values: [
          [100, 120, 110, 140, 150, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430],
          [200, 220, 210, 240, 250, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530],
          [180, 200, 190, 220, 230, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510],
          [220, 240, 230, 260, 270, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 530],
          [500, 520, 510, 540, 550, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 250]
        ]
      }
    })

    const updateChart = () => {
      if (chart.value) {
        chart.value.setOption(getOption(selectedRange.value))
      }
    }

    const getOption = (range) => {
      const { dates, values } = chartData.value[range]
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          bottom: 20,
          left: 'center',
          data: ['严危', '高危', '中危', '低危', '信息']
        },
        grid: {
          left: '3%',
          right: '2%',
          top: '8%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: dates
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '严危',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: { focus: 'series' },
            itemStyle: { color: '#E8684A' },
            data: values[0]
          },
          {
            name: '高危',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: { focus: 'series' },
            itemStyle: { color: '#EFE0B5' },
            data: values[1]
          },
          {
            name: '中危',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: { focus: 'series' },
            itemStyle: { color: '#F5F5F5' },
            data: values[2]
          },
          {
            name: '低危',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: { focus: 'series' },
            itemStyle: { color: '#4e74f5' },
            data: values[3]
          },
          {
            name: '信息',
            type: 'line',
            stack: '总量',
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {},
            emphasis: { focus: 'series' },
            itemStyle: { color: '#ccddff' },
            data: values[4]
          }
        ]
      }
    }

    onMounted(() => {
      chart.value = echarts.init(document.querySelector('.chart'))
      chart.value.setOption(getOption(selectedRange.value))

      // 设置定时器更新日期
      dateUpdater.value = setInterval(() => {
        chartData.value = {
          ...chartData.value,
          [selectedRange.value]: {
            dates: generateDates(parseInt(selectedRange.value)),
            values: chartData.value[selectedRange.value].values
          }
        }
        updateChart()
      }, 1000 * 60 * 60 * 24) // 每24小时更新一次
    })

    onUnmounted(() => {
      // 清除定时器
      if (dateUpdater.value) {
        clearInterval(dateUpdater.value)
      }
    })

    return {
      selectedRange,
      options,
      updateChart,
      getOption
    }
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative; /* 添加这个 */
}

.chart {
  width: 95%;
  height: 75%;
}

.title-container {
  display: flex;
  justify-content: space-between; /* 修改这里 */
  align-items: center;
  padding: 10px;
}

.title-container span {
  color: #2b2b2b;
  font-family: 'outfit';
  letter-spacing: 3px;
  font-size: 18px;
  padding: 15px 0;
}

.date-selector {
  position: absolute; /* 绝对定位 */
  width: 400px !important;
  top: -50px; /* 距离顶部 */
  right: 70px; /* 距离右边 */
}

.date-selector .n-select .n-base-selection--focused {
  border-color: #4e74f5 !important; /* 修改选中状态的边框颜色 */
}
</style>
