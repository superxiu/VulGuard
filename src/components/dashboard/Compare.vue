<template>
  <div class="chart-container">
    <div ref="chart" class="chart" id="chart"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch, nextTick } from 'vue'

const props = defineProps({
  severityData: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
const chartInstance = ref(null)

const initChart = () => {
  if (!chartRef.value) {
    console.error('Chart DOM element not found')
    return
  }

  console.log('Initializing chart...')
  const chart = echarts.init(chartRef.value)
  chartInstance.value = chart
  console.log('Chart initialized:', chart)

  const labelSetting = {
    show: true,
    position: 'right',
    offset: [10, 0],
    fontSize: 16
  }

  function makeOption(type, symbol, severityBefore, severityAfter) {
    console.log('Making option with data:', severityBefore, severityAfter)
    return {
      legend: {
        data: ['防护前', '防护后'],
        top: '10%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        containLabel: true,
        left: '3%',
        right: '10%',
        bottom: '2%'
      },
      yAxis: {
        data: ['严危', '高危', '中危', '低危', '信息'],
        inverse: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          margin: 30,
          fontSize: 14
        },
        axisPointer: {
          label: {
            show: true,
            margin: 30
          }
        }
      },
      xAxis: {
        type: 'value',
        name: '漏洞数量',
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: { show: false },
        axisLabel: { show: true },
        axisTick: { show: true },
        axisLine: { show: true }
      },
      animationDurationUpdate: 500,
      series: [
        {
          name: '防护前',
          id: 'bar1',
          type: type,
          symbolRepeat: true,
          barWidth: '35%',
          symbolSize: ['130%', '60%'],
          itemStyle: {
            color: '#4E74F5' // 设置颜色
          },
          barCategoryGap: '0%',
          universalTransition: {
            enabled: true,
            delay: function (idx, total) {
              return (idx / total) * 1000
            }
          },
          data: severityBefore.map((value) => ({ value, symbol }))
        },
        {
          name: '防护后',
          id: 'bar2',
          type: type,
          barGap: '0%', // 行间距
          symbolRepeat: true,
          barWidth: '35%',
          symbolSize: ['130%', '60%'],
          itemStyle: {
            color: '#EFE0B5' // 设置颜色
          },
          universalTransition: {
            enabled: true,
            delay: function (idx, total) {
              return (idx / total) * 1000
            }
          },
          data: severityAfter.map((value) => ({ value, symbol }))
        }
      ]
    }
  }

  const updateChart = (severityData) => {
    console.log('Updating chart with data:', severityData)
    const options = [makeOption('bar', 'rect', severityData.severityBefore, severityData.severityAfter), makeOption('pictorialBar', 'diamond', severityData.severityBefore, severityData.severityAfter)]

    let optionIndex = 0
    chartInstance.value.setOption(options[optionIndex])

    setInterval(function () {
      optionIndex = (optionIndex + 1) % options.length
      chartInstance.value.setOption(options[optionIndex])
    }, 3500)
  }

  // 立即调用一次以初始化图表
  if (props.severityData && chartRef.value) {
    console.log('Initial data:', props.severityData)
    updateChart(props.severityData)
  }
}

onMounted(() => {
  chartRef.value = document.getElementById('chart') //设定初始值
  nextTick(() => {
    console.log(chartRef.value)
    if (chartRef.value) {
      console.log('Chart DOM element found, initializing...')
      initChart()
    } else {
      console.error('Chart DOM element not found in onMounted')
    }
  })
})

// 监听 prop 数据的变化
watch(
  () => props.severityData,
  (newData) => {
    console.log('Props data changed:', newData)
    if (chartRef.value) {
      updateChart(newData)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  margin-top: -5%;
  width: 95%;
  height: 85%;
}
</style>
