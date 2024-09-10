<template>
  <div class="bottom-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import starfieldImg from '@/assets/images/starfield.jpg'

const chart = ref(null)

// Function to get the last 7 days in 'MM-DD' format
const getLastSevenDays = () => {
  const today = new Date()
  const dates = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    dates.push(formattedDate)
  }

  return dates
}

onMounted(() => {
  if (chart.value) {
    const myChart = echarts.init(chart.value)
    const dates = getLastSevenDays() // Get the last 7 days

    const option = {
      color: ['aqua', '#2485BC'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'aqua'
          }
        }
      },
      legend: {
        data: ['检测到的漏洞', '已修复的漏洞'],
        top: '-1%',
        textStyle: {
          color: 'aqua'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '30%',
        top: '15%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dates, // Use dynamic dates here
          axisLine: {
            onZero: true,
            lineStyle: {
              color: 'aqua',
              z: -1
            }
          },
          axisLabel: {
            textStyle: {
              color: 'aqua',
              z: -1
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'aqua',
              z: -1
            }
          },
          axisLabel: {
            textStyle: {
              color: 'aqua',
              z: -1
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '检测到的漏洞',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'aqua'
              },
              {
                offset: 1,
                color: 'rgba(79, 210, 221, 0.6)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: [14, 22, 11, 24, 9, 34, 25]
        },
        {
          name: '已修复的漏洞',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#2485BC'
              },
              {
                offset: 1,
                color: 'rgba(35, 95, 167, 0.3)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: [22, 32, 11, 23, 21, 29, 15]
        }
      ]
    }
    myChart.setOption(option)
  }
})
</script>

<style scoped>
.bottom-container {
  width: 100%;
  /* background-image: ; */
}
.chart {
  width: 100%;
  height: 180px;
}
</style>
