<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart',
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.chart.setOption(this.getOption())
    this.updateCenterText()
  },
  methods: {
    getOption() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: '25%',
          left: '26%',
          data: ['严危', '高危', '中危', '低危', '信息'],
          itemStyle: {
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        series: [
          {
            name: '漏洞等级',
            type: 'pie',
            radius: ['45%', '65%'],
            center: ['58%', '30%'],
            selectedMode: 'single',
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 20, name: '严危', itemStyle: { color: '#E8684A' } },
              { value: 30, name: '高危', itemStyle: { color: '#EFE0B5' } },
              { value: 50, name: '中危', itemStyle: { color: '#F5F5F5' } },
              { value: 70, name: '低危', itemStyle: { color: '#4e74f5' } },
              { value: 90, name: '信息', itemStyle: { color: '#ccddff' } }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              shadowOffsetX: 1,
              shadowOffsetY: 1,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, 0.3)' // 添加阴影
            }
          }
        ],
        title: {
          text: '',
          left: '57%',
          top: '25%',
          textAlign: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: 100,
            color: '#333'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#666'
          }
        }
      }
    },
    updateCenterText() {
      const data = [
        { name: '严危', value: 20 },
        { name: '高危', value: 30 },
        { name: '中危', value: 50 },
        { name: '低危', value: 70 },
        { name: '信息', value: 90 }
      ]

      let index = 0
      const updateInterval = 3000 // 更新间隔时间，单位为毫秒

      const updateText = () => {
        const total = data.reduce((sum, item) => sum + item.value, 0)
        const current = data[index]
        const percentage = ((current.value / total) * 100).toFixed(2) + '%'
        this.chart.setOption({
          title: {
            text: `${current.name}\n${percentage}`
          }
        })
        index = (index + 1) % data.length
      }

      updateText() // 初始化显示
      setInterval(updateText, updateInterval) // 设置定时更新
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}

.chart {
  width: 85%;
  height: 100%;
}
</style>
