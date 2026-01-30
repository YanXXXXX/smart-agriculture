<template>
  <div>
    <div class="echart" id="mychart2" style="height:260px"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      chartData: [
        {
          name: '三产产值',
          value: 50,
          test: '备注1'
        },
        {
          name: '二产产值',
          value: 60,
          test: '备注2'
        },
        {
          name: '二产产值',
          value: 66,
          test: '备注3'
        },
        {
          name: '一产产值',
          value: 72,
          test: '备注4'
        },
        {
          name: '产园总产值',
          value: 80,
          test: '备注5'
        },
      ]
    }
  },
  mounted () {
    this.initEcharts();
  },
  methods: {
    initEcharts () {
      var itemValue = [], bgData = []; //声明背景数据
      // 取出所有数据最大值,作为柱形图背景数据
      this.chartData.forEach(function (items, index) {
        itemValue.push(items.value);
      });
      let maxdata = Math.max.apply(null, itemValue); ///applay方法★取得最大值
      for (var i = 0; i < this.chartData.length; i++) {
        bgData.push(maxdata); //取得最大值
      }
      let $colorList = this.$colorList
      const option = {
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: "{b0}: {c0}亿元",
        },
        legend: {
          show: false
        },
        toolbox: {
          show: false
        },
        grid: {
          top: '8%',
          left: '2%',
          right: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [{
          type: 'value',
          position: 'bottom',
          boundaryGap: true, // 边界间隙
          min: 0,
          axisLabel: {
            show: false,
            textStyle: {
              color: '#fff',
              fontSize: 16
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255, 255, 255, .5)'
            }
          },
          axisTick: {
            show: false // 坐标轴小标记
          },
          splitLine: {
            show: false, // 是否显示分割线
            lineStyle: {
              color: 'rgba(255, 255, 9255, 0)', // 纵向向网格线颜色
              type: 'dashed',
              width: 1
            }
          }
        }],
        yAxis: {
          type: 'category',
          position: 'left',
          axisLabel: {
            textStyle: {
              color: '#8aa5ab',
              fontSize: 15
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, .5)',
              width: 1
            }
          },
          axisTick: {
            show: false // 坐标轴小标记
          },
          splitLine: {
            show: false
          },
          data: (function (data) {
            var arr = [];
            data.forEach(function (items) {
              arr.push(items.name);
            });
            return arr;
          })(this.chartData) // 载入y轴数据
        },
        series: [{
          type: 'bar',
          barGap: "-130%",
          label: {
            normal: {
              show: false
            }
          },
          barWidth: 12,
          itemStyle: {
            normal: {
              color: '#1a2859' ,// 图表颜色
            },
          },
          data: bgData, // 载入背景数据
          z: 0
        }, {
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'right', // top, right, inside, insideTop,...
              textStyle: {
                color: 'white',
                fontSize: 16
              },
              formatter: '{c}' + "亿元"
            }
          },
          barWidth: 12,
          itemStyle: {
            normal: {
              color: function (params) { // 颜色定制显示（按顺序）
                var colorList = $colorList;
                return colorList[params.dataIndex]
              },
               barBorderRadius: [0, 17, 17, 0]  //圆角
            }
          },
          data: this.chartData, // 载入数据(内含自定义参数)
          z: 1
        }]
      }
     const myChart = this.$echarts.init(document.getElementById("mychart2"));
      myChart.setOption(option); 
      clearInterval(this.toolTipTimer)
      let index = 0
      this.toolTipTimer = setInterval(() => {
      myChart.dispatchAction({
        type: 'showTip', // 提示框
        seriesIndex: 0,
        dataIndex: index // 第几行柱子高亮
      })
      if (index == this.chartData.length - 1) index = 0 //展示到最后一个的时候 从0开始 
        else index++
      }, 3000)
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
}
</script>
<style scoped lang="scss">
</style>