<template>
  <div id="chart" style="width: 100%; height: 60vh"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'

onMounted(() => {
  var chartDom = document.getElementById('chart')
  if (chartDom) {
    var myChart = echarts.init(chartDom)
    var option

    const colors = ['#012BFF', '#0072ff', '#00eaff', '#01aaff', '#01AAFF']
    const bgColor = '#2E2733'
    const itemStyle = {
      star5: { color: colors[0] },
      star4: { color: colors[1] },
      star3: { color: colors[2] },
      star2: { color: colors[3] },
      star1: { color: colors[4] }
    }

    const gradientColor = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#0072FF' },
        { offset: 0.95, color: '#00eaff' },
        { offset: 1, color: '#01aaff' }
      ]
    }

    const data = [
      {
        // name: '1',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: '端口扫描仪',
            children: [
              {
                name: '1☆',
                children: [{ name: 'Nessus SYN scanner' }]
              }
            ]
          }
        ]
      },
      {
        // name: '2',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: 'DNS',
            children: [
              {
                name: '1☆',
                children: [{ name: 'DNS Server Detection' }]
              }
            ]
          }
        ]
      },
      {
        // name: '3',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: 'Web',
            children: [
              {
                name: '1☆',
                children: [{ name: 'HyperText Transfer Protocol(HTTP) Information' }, { name: 'Web Server No 404 Error Code Check' }]
              }
            ]
          }
        ]
      },
      {
        // name: '4',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: '服务',
            children: [
              {
                name: '1☆',
                children: [{ name: 'Service Detection' }, { name: 'Web Server UPnP Detection' }, { name: 'Universal Plug and Play(UPnP) Protocol Detection' }]
              },
              {
                name: '2☆',
                children: [{ name: 'DHCP Server Detection' }]
              }
            ]
          }
        ]
      },
      {
        // name: '5',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: '常规',
            children: [
              {
                name: '1☆',
                children: [{ name: 'Traceroute Information' }, { name: 'OS Identifcation' }, { name: 'Common Platform Enumeration(CPE)' }, { name: 'Device Type' }, { name: 'Ethernet MAC Addresses' }]
              }
            ]
          }
        ]
      },
      {
        // name: '6',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: '杂项',
            children: [
              {
                name: '1☆',
                children: [{ name: 'Ethernert Card Manufacturer Detection' }]
              }
            ]
          }
        ]
      },
      {
        // name: '7',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: '设置',
            children: [
              {
                name: '1☆',
                children: [{ name: 'Nesssus Scan Information' }]
              }
            ]
          }
        ]
      },
      {
        // name: '8',
        itemStyle: { color: gradientColor },
        children: [
          {
            name: '防火墙',
            children: [
              {
                name: '3☆',
                children: [{ name: 'IP Forwarding Enabled' }]
              }
            ]
          }
        ]
      }
    ]

    for (let j = 0; j < data.length; ++j) {
      let level1 = data[j].children
      for (let i = 0; i < level1.length; ++i) {
        let block = level1[i].children
        let bookScore = []
        let bookScoreId
        for (let star = 0; star < block.length; ++star) {
          let style = (function (name) {
            switch (name) {
              case '5☆':
                bookScoreId = 0
                return itemStyle.star5
              case '4☆':
                bookScoreId = 1
                return itemStyle.star4
              case '3☆':
                bookScoreId = 2
                return itemStyle.star3
              case '2☆':
                bookScoreId = 3
                return itemStyle.star2
              case '1☆':
                bookScoreId = 4
                return itemStyle.star1
            }
          })(block[star].name)
          if (style) {
            block[star].label = {
              color: style.color,
              downplay: { opacity: 0.5 }
            }
            if (block[star].children) {
              style = { opacity: 1, color: style.color }
              block[star].children.forEach(function (book) {
                book.value = 1
                book.itemStyle = style
                book.label = { color: style.color }
                let value = 1
                if (bookScoreId === 0 || bookScoreId === 3) value = 5
                if (bookScore[bookScoreId]) {
                  bookScore[bookScoreId].value += value
                } else {
                  bookScore[bookScoreId] = { color: colors[bookScoreId], value: value }
                }
              })
            }
          }
        }
        level1[i].itemStyle = { color: gradientColor }
      }
    }

    option = {
      //   backgroundColor: bgColor,
      color: colors,
      series: [
        {
          type: 'sunburst',
          center: ['50%', '48%'],
          data: data,
          sort: function (a, b) {
            if (a.depth === 1) {
              return b.getValue() - a.getValue()
            } else {
              return a.dataIndex - b.dataIndex
            }
          },
          label: {
            rotate: 'radial',
            color: bgColor
          },
          itemStyle: {
            borderColor: bgColor,
            borderWidth: 2
          },
          levels: [
            {},
            {
              r0: 0,
              r: 40,
              label: {
                rotate: 0,
                fontSize: 12
              }
            },
            {
              r0: 40,
              r: 105
            },
            {
              r0: 115,
              r: 140,
              itemStyle: {
                shadowBlur: 2,
                shadowColor: colors[2],
                color: 'transparent'
              },
              label: {
                rotate: 'tangential',
                fontSize: 10,
                color: colors[0]
              }
            },
            {
              r0: 140,
              r: 145,
              itemStyle: {
                shadowBlur: 80,
                shadowColor: colors[0]
              },
              label: {
                position: 'outside',
                textShadowBlur: 5,
                textShadowColor: '#333'
              },
              downplay: {
                label: { opacity: 0.5 }
              }
            }
          ]
        }
      ]
    }

    option && myChart.setOption(option)
  }
})
</script>

<style scoped>
#chart {
}
</style>
