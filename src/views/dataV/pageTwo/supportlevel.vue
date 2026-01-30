<template>
  <div>
    <div class="echart" id="mychart5" style="height: 260px"></div>
  </div>
</template>
<script>
import {autoHover} from '../echartsOption'
export default {
  data () {
    return {

    }
  },
  mounted () {
    this.initEcharts();
  },
  methods: {
    initEcharts () {
      var data = [1000, 2000, 3000, 4000, 5000, 6000];
      var className = ['市县财政', '财政投入', '金融机构', '省级以上', '资本投入'];
      var colorList = ['#39B3FF', '#47E0E0', '#7891D9', '#FF6B6B', '#C7A530',];
      let option = {
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            return params[0].name + '<br/>' +
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" + params[0].value+'万元'
          }
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: true
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ccefff',fontSize:'14'
            },
          },
          splitLine: {
            show: true,
            lineStyle:{
              color:'rgb(33, 62, 73)'
            }
          },
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ccefff',
              fontSize:'14'
            },
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle:{
              color:'rgb(33, 62, 73)'
            }
          },
          data: className
        }],
        series: [{
          name: '完成率',
          type: 'bar',
          zlevel: 1,
          itemStyle: {
            normal: {
              borderRadius: [0, 10,10,0] ,// 设置两个数值
              color: (params) => {
                return colorList[params.dataIndex]
              }
            },
          },
          barWidth: 12,
          data: data
        }
        ]
      };
      const myChart = this.$echarts.init(document.getElementById("mychart5"));
      myChart.setOption(option);
      autoHover(myChart,option,1500)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
