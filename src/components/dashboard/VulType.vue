<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import { useVulnerabilityStore } from '@/stores/vulnerabilityStore'

export default {
  name: 'BarChart',
  setup() {
    const chartContainer = ref(null)
    const vulnerabilityStore = useVulnerabilityStore()
    let myChart = null

    const generateDummyData = () => {
      const xData = [11219, 22964, 11219, 85602, 24260, 91815, 50345, 50344, 10107, 85582, 49704, 10662, 194915, 181418, 159843, 159323, 153588, 149334, 117886, 110723]

      // 为每个 x 轴坐标生成一个随机的 y 轴值
      return xData.map((num) => ({
        name: num.toString(), // x 轴坐标
        num: Math.floor(Math.random() * 100) + 1 // 生成 1 到 100 之间的随机数作为 y 轴值
      }))
    }

    const renderChart = (data) => {
      if (chartContainer.value) {
        if (!myChart) {
          myChart = echarts.init(chartContainer.value)
        }

        const xData = data.map((item) => item.name)
        const seriesData = data.map((item) => ({ value: item.num, itemStyle: { color: '#4E74F5' } }))

        const option = {
          grid: {
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '25%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
              lineStyle: {
                color: '#D3D3D3'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#08395A'
              },
              interval: 0,
              rotate: 45
            },
            axisTick: {
              show: false // Hide axis ticks if needed
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#D3D3D3'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#08395A'
              }
            }
          },
          series: [
            {
              name: 'Value',
              type: 'bar',
              data: seriesData,
              barWidth: '50%', // Adjust width of bars
              barGap: '20%', // Adjust gap between bars
              barCategoryGap: '100%',
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 2,
                shadowOffsetX: 2,
                shadowOffsetY: -2
              },
              emphasis: {
                itemStyle: {
                  shadowColor: 'rgba(0, 0, 0, 0.4)',
                  shadowBlur: 10,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2,
                  borderColor: '#fff',
                  borderWidth: 2,
                  color: '#ccddff'
                }
              }
            }
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}'
          },
          dataZoom: [
            {
              type: 'slider',
              height: 10,
              bottom: 85,
              right: 25,
              start: 0,
              end: xData.length >= 15 ? 100 - (15 / xData.length) * 100 : 0,
              handleIcon: 'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '60%',
              showDetail: false,
              filterMode: 'empty'
            }
          ]
        }

        myChart.setOption(option)
      }
    }

    onMounted(() => {
      // Use generated dummy data for demonstration
      renderChart(generateDummyData())
    })

    watch(
      () => vulnerabilityStore.getVulnerabilityData,
      (newData) => {
        renderChart(newData)
      },
      { deep: true }
    )

    return {
      chartContainer
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
