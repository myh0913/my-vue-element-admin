<template>
  <div>
    <div id="echart-demo" class="test" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
    window.addEventListener('resize', this.resizeChart)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    resizeChart() {
      echarts.init(document.getElementById('echart-demo')).resize()
    },
    init() {
      var chartDom = document.getElementById('echart-demo')
      var myChart = echarts.init(chartDom)
      myChart.on('click', (e) => {
        for (const i in e) {
          console.log(i + '的值为：')
          console.log(e[i])
        }
      })
      var option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.test {
  width: 30%;
  height: 300px;
}
</style>
