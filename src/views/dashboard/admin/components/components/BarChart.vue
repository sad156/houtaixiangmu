<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#999'],
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisLabel: { color: '#333333' },
          axisLine: {
            lineStyle: { color: '#333333' }
          },
          data: ['21/12', '22/12', '23/12', '24/12', '25/12', '26/12', '27/12'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisLabel: { color: '#333333' },
          axisLine: {
            lineStyle: { color: '#333333' }
          },
          axisTick: {
            lineStyle: { color: '#333333' }
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
        //   name: 'pageA',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [79, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }, {
        //   name: 'pageB',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [80, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }, {
          name: '订单统计',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [6000, 3000, 8000, 9000, 6000, 11500, 10000],
          animationDuration
        }]
      })
    }
  }
}
</script>
