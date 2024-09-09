<!-- Earth.vue -->
<template>
  <div id="chart" style="width: 100%; height: 65vh"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import flightsData from '@/assets/data/flights.json'

import starfieldImg from '@/assets/images/starfield.jpg'
import bathymetryImg from '@/assets/images/bathymetry_bw_composite_4k.jpg'
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip'

const lake = '/lake.hdr'

const initChart = () => {
  const chartDom = document.getElementById('chart')
  if (!chartDom) return
  const myChart = echarts.init(chartDom)

  // 使用导入的数据
  const data = flightsData

  const airports = data.airports.map((item) => ({
    coord: [item[3], item[4]]
  }))
  function getAirportCoord(idx) {
    return [data.airports[idx][3], data.airports[idx][4]]
  }
  const routesGroupByAirline = {}
  data.routes.forEach((route) => {
    const airline = data.airlines[route[0]]
    const airlineName = airline[0]
    if (!routesGroupByAirline[airlineName]) {
      routesGroupByAirline[airlineName] = []
    }
    routesGroupByAirline[airlineName].push(route)
  })
  const pointsData = []
  data.routes.forEach((airline) => {
    pointsData.push(getAirportCoord(airline[1]))
    pointsData.push(getAirportCoord(airline[2]))
  })
  const series = data.airlines
    .map((airline) => {
      const airlineName = airline[0]
      const routes = routesGroupByAirline[airlineName]
      if (!routes) {
        return null
      }
      return {
        type: 'lines3D',
        name: airlineName,
        effect: {
          show: true,
          trailWidth: 2,
          trailLength: 0.15,
          trailOpacity: 1,
          trailColor: 'rgb(30, 30, 60)'
        },
        lineStyle: {
          width: 1,
          color: 'rgb(50, 50, 150)',
          opacity: 0.1
        },
        blendMode: 'lighter',
        data: routes.map((item) => [airports[item[1]].coord, airports[item[2]].coord])
      }
    })
    .filter((series) => !!series)
  series.push({
    type: 'scatter3D',
    coordinateSystem: 'globe',
    blendMode: 'lighter',
    symbolSize: 2,
    itemStyle: {
      color: '#0076ff',
      opacity: 0.2
    },
    data: pointsData
  })
  myChart.setOption({
    legend: {
      selectedMode: 'single',
      left: 'left',
      data: Object.keys(routesGroupByAirline),
      orient: 'vertical',
      textStyle: {
        color: 'aqua'
      },
      itemStyle: {
        borderColor: '#0076ff', // 修改图例项边框颜色
        borderWidth: 2, // 修改图例项边框宽度
        color: 'aqua'
      },
      // inactiveColor: '#235fa7', // 未激活图例项的颜色
      inactiveColor: 'gray',
      inactiveBorderColor: '#235fa7'
    },

    globe: {
      environment: starfieldImg,
      heightTexture: bathymetryImg,
      displacementScale: 0.1,
      displacementQuality: 'high',
      baseColor: '#000',
      shading: 'realistic',
      realisticMaterial: {
        roughness: 0.2,
        metalness: 0
      },
      postEffect: {
        enable: true,
        depthOfField: {
          enable: false,
          focalDistance: 150
        }
      },
      temporalSuperSampling: {
        enable: true
      },
      light: {
        ambient: {
          intensity: 0
        },
        main: {
          intensity: 0.1,
          shadow: false
        },
        ambientCubemap: {
          texture: lake,
          exposure: 1,
          diffuseIntensity: 0.5,
          specularIntensity: 2
        }
      },
      viewControl: {
        autoRotate: false,
        distance: 250, // 设定初始的观察距离
        minDistance: 50, // 最小距离
        maxDistance: 500 // 最大距离
      },
      silent: true
    },
    series: series
  })
  window.addEventListener('keydown', () => {
    series.forEach((series, idx) => {
      myChart.dispatchAction({
        type: 'lines3DToggleEffect',
        seriesIndex: idx
      })
    })
  })
}

onMounted(initChart)
</script>

<style scoped>
#chart {
}
</style>
