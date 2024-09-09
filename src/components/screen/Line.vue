<template>
  <div id="main" style="width: 100%; height: 380px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family'

const chartInstance = ref(null)
const updateInterval = 10000 // Update every 10 seconds

const generateRandomIp = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

const generateData = () => {
  const allCategories = [11219, 22964, 11219, 85602, 24260, 91815, 50345, 50344, 10107, 85582, 49704, 10662, 194915, 181418, 159843, 159323, 153588, 149334, 117886, 110723, 97610, 91634, 70657, 54615, 45590, 42057, 39520, 26194, 19506, 12053, 11936, 11032, 10919, 10881, 10719, 10386, 10287, 10267]
  const category = allCategories.slice(0, 20)
  let detectedVulnerabilities = []
  let fixedVulnerabilities = []

  for (let i = 0; i < category.length; i++) {
    let detected = Math.round(Math.random() * 30)
    let fixed = Math.round(Math.random() * detected) // Ensure fixed is not greater than detected
    detectedVulnerabilities.push(detected)
    fixedVulnerabilities.push(fixed)
  }

  const ipAddress = generateRandomIp()

  return { category, detectedVulnerabilities, fixedVulnerabilities, ipAddress }
}

const initChart = () => {
  const chartDom = document.getElementById('main')
  if (!chartDom) return
  chartInstance.value = echarts.init(chartDom)

  const { category, detectedVulnerabilities, fixedVulnerabilities, ipAddress } = generateData()

  const option = {
    title: {
      text: `IP: ${ipAddress}`,
      left: 'center',
      top: '8%',
      textStyle: {
        color: '#235fa7',
        fontSize: 12,
        fontFamily: 'XYGHT'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        let result = `${params[0].name}<br/>`
        params.forEach((param) => {
          result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['发现漏洞数', '防护漏洞数', '未防护漏洞数'],
      textStyle: {
        color: 'aqua'
      }
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: 'aqua'
        }
      }
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: 'aqua'
        }
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      top: '20%',
      bottom: '10%'
    },
    series: [
      {
        name: '发现漏洞数',
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        itemStyle: {
          color: 'aqua'
        },
        lineStyle: {
          color: 'aqua'
        },
        data: detectedVulnerabilities
      },
      {
        name: '防护漏洞数',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#235fa7' },
            { offset: 1, color: '#00eaff' }
          ])
        },
        data: fixedVulnerabilities
      },
      {
        name: '未防护漏洞数',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: '#0f375f'
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        data: detectedVulnerabilities.map((detected, index) => detected - fixedVulnerabilities[index])
      }
    ]
  }

  chartInstance.value.setOption(option)

  // Resize chart on window resize
  window.addEventListener('resize', () => {
    chartInstance.value.resize()
  })
}

const updateChart = () => {
  const { category, detectedVulnerabilities, fixedVulnerabilities, ipAddress } = generateData()

  const updatedOption = {
    title: {
      text: `IP: ${ipAddress}`
    },
    xAxis: {
      data: category
    },
    series: [
      {
        name: '发现漏洞数',
        data: detectedVulnerabilities
      },
      {
        name: '防护漏洞数',
        data: fixedVulnerabilities
      },
      {
        name: '未防护漏洞数',
        data: detectedVulnerabilities.map((detected, index) => detected - fixedVulnerabilities[index])
      }
    ]
  }

  chartInstance.value.setOption(updatedOption)
}

onMounted(() => {
  initChart()
  const intervalId = setInterval(updateChart, updateInterval)

  onUnmounted(() => {
    clearInterval(intervalId)
    window.removeEventListener('resize', () => {
      chartInstance.value.resize()
    })
  })
})
</script>

<style scoped>
#main {
}
</style>
