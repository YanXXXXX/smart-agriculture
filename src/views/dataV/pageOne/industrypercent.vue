<template>
  <div class="box">
    <div>
      <div class="echart" id="mychart3" ref="chart"></div>
    </div>
    <div>
      <div class="echart" id="mychart4"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import "echarts-gl";
import { getPie3D, getParametricEquation } from "../echartsOption.js"; //工具类js，页面路径自己修改

const color = ["#3cd6b7", "#fe9326", "#124fb7", "#383893"];
export default {
  data () {
    return {
      optionData: [
        {
          name: "三产产值",
          value: 13,
        },
        {
          name: "二产产值",
          value: 8,
        },
        {
          name: "一产产值",
          value: 3,
        },
        {
          name: "产圈总产产值",
          value: 17,
        },
      ],
      statusChart: null,
      option: {},
    }
  },
  mounted () {
    this.initChart();
    this.initChart2()
    const that = this;
    window.onresize = function () {
      that.changeSize();
    };
  },
  methods: {
    // 图表初始化
    initChart () {
      this.statusChart = echarts.init(this.$refs.chart);
      // 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
      this.option = getPie3D(this.optionData, 0.6, 200, 28, 22, 40);
      this.statusChart.setOption(this.option);
      // 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
      this.option.series.push({
        backgroundColor: "transparent",
        type: "pie",
        label: {
          opacity: 1,
          fontSize: 13,
          lineHeight: 20,
          normal: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        startAngle: -90, // 起始角度，支持范围[0, 360]。
        clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ["20%", "60%"],
        center: ["50%", "50%"],
        data: this.optionData,
        itemStyle: {
          opacity: 0, //这里必须是0，不然2d的图会覆盖在表面
        },
      });
      this.statusChart.setOption(this.option);
      this.bindListen(this.statusChart);
    },
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    // optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
    bindListen (myChart, optionName = "option") {
      let selectedIndex = "";
      let hoveredIndex = "";
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on("mouseover", (params) => {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== "") {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected =
              this[optionName].series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio =
              this[optionName].series[hoveredIndex].pieData.startRatio;
            endRatio = this[optionName].series[hoveredIndex].pieData.endRatio;
            k = this[optionName].series[hoveredIndex].pieStatus.k;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            this[optionName].series[hoveredIndex].parametricEquation =
              getParametricEquation(
                startRatio,
                endRatio,
                isSelected,
                isHovered,
                k,
                this[optionName].series[hoveredIndex].pieData.value
              );
            this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = "";
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (
            params.seriesName !== "mouseoutSeries" &&
            params.seriesName !== "信用评价"
          ) {

            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected =
              this[optionName].series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio =
              this[optionName].series[params.seriesIndex].pieData.startRatio;
            endRatio =
              this[optionName].series[params.seriesIndex].pieData.endRatio;
            k = this[optionName].series[params.seriesIndex].pieStatus.k;
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            this[optionName].series[params.seriesIndex].parametricEquation =
              getParametricEquation(
                startRatio,
                endRatio,
                isSelected,
                isHovered,
                k,
                this[optionName].series[params.seriesIndex].pieData.value + 60
              );
            this[optionName].series[params.seriesIndex].pieStatus.hovered =
              isHovered;
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
          }
          // 使用更新后的 option，渲染图表
          myChart.setOption(this[optionName]);
        }
      });
      // 修正取消高亮失败的 bug
      myChart.on("globalout", () => {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        if (hoveredIndex !== "") {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = this[optionName].series[hoveredIndex].pieStatus.selected;
          isHovered = false;
          k = this[optionName].series[hoveredIndex].pieStatus.k;
          startRatio = this[optionName].series[hoveredIndex].pieData.startRatio;
          endRatio = this[optionName].series[hoveredIndex].pieData.endRatio;
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          this[optionName].series[hoveredIndex].parametricEquation =
            getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              this[optionName].series[hoveredIndex].pieData.value
            );
          this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered;
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = "";
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(this[optionName]);
      });
    },
    // 自适应宽高
    changeSize () {
      this.statusChart.resize();
    },
    initChart2 () {
      let data = ['三产产值', '二产产值', '一产产值', '产园总产值']
      let option = {
        grid: {
          top: '8%',
          left: '10%',
          right: '20%',
          bottom: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: "{b0}: {c0}亿元"
        },

        xAxis: {
          show: false,                //是否显示x轴
          type: 'value'
        },
        yAxis: {
          type: 'category',
          inverse: true,               //让y轴数据逆向
          axisLabel: {
            show: true,
            textStyle: {
              color: '#666'       //y轴字体颜色
            },
            formatter: function (value, index) {
              return [
                '{title|' + value + '} '
              ].join('\n');
            },
            //定义富文本标签
            rich: {
              lg: {
                fontWeight: 'bold',
                fontSize: 12,       //字体默认12
                color: '#08C',
                padding: [0, 5, 0, 0]
              },
              title: {
                color: '#fff',
                fontWeight: 'lighter',

              }
            }
          },
          splitLine: { show: false },   //横向的线
          axisTick: { show: false },    //y轴的端点
          axisLine: { show: false },    //y轴的线
          data: data
        },
        series: [
          {
            name: '数据内框',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'right', // top, right, inside, insideTop,...
                textStyle: {
                  color: 'white',
                  fontSize: 12
                },
                formatter: '{c}' + "亿元"
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: function (params) { // 颜色定制显示（按顺序）
                  var colorList = ['#4a5eea', '#f29b76', '#ea9ef3', '#80f1b0',];
                  return colorList[params.dataIndex]
                },
              }
            },
            barWidth: 10,
            data: [40, 63, 20, 100,]
          },
          {
            name: '外框',
            type: 'bar',

            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: '#285079',
              }
            },
            barGap: '-100%',
            z: 0,
            barWidth: 10,
            data: [100, 100, 100, 100,],
          }
        ]
      }
      const myChart = this.$echarts.init(document.getElementById("mychart4"));
      myChart.setOption(option);
      clearInterval(this.toolTipTimer)
       let index = 0
      this.toolTipTimer = setInterval(() => {
      myChart.dispatchAction({
        type: 'showTip', // 提示框
        seriesIndex: 0,
        dataIndex: index // 第几行柱子高亮
      })
      if (index == data.length - 1) index = 0 //展示到最后一个的时候 从0开始 
        else index++
      }, 3000)
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  display: flex;
}
#mychart3 {
  width: 260px;
  height: 260px;
}
#mychart4 {
  width: 360px;
  height: 330px;
}
</style>