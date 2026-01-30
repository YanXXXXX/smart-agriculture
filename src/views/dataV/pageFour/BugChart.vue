<template>
  <div class="w100 h100">
    <div class="pest">
      <div class="pie " ref="pie"></div>
      <div class="bar" ref="bar"></div>
    </div>
  </div>
</template>

<script>
import {autoHover} from "../echartsOption";
export default {
  name: 'BugChart',
  mixins: [],
  components: {},
  props: {},
  data() {
    return{}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
      this.loadChart();
  },
  destroyed() {},
  methods: {
      loadChart(){
        let data = [{
                    name:"蟋蟀",
                    value:"37"
                },{
                    name:"突背斑红蝽",
                    value:"44"
                },{
                    name:"蝼蛄",
                    value:"46"
                },{
                    name:"鳃金龟",
                    value:"46"
                }]
        let pieChart = this.$echarts.init(this.$refs.pie)
        let option1 = {
            color:this.$colorList,
            series: [
                {
                    type: "pie",
                    radius: ["75%", "90%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 2,
                    },
                    label: {
                        show: false,
                        position: "center",
                        color:"#fff",
                        textBorderColor:'transparent'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            formatter: `{b}\n{d}只`
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data
                },
            ],
        };
        pieChart.setOption(option1)
        autoHover(pieChart,option1,1500)

        let option2 ={
            tooltip: {
                trigger: "axis",
                showContent: false,
                axisPointer: {
                    type: "shadow",
                },
            },
            grid:{
                left:100,
                top:20,
                right:50,
                bottom:20
            },
            yAxis: {
                type: 'category',
                data: data.map(item=>item.name),
                axisLabel:{
                    color:'#fff'
                }
            },
            xAxis: {
                type: 'value',
                axisLabel:{
                    color:'#fff'
                }
            },
            series: [
                {
                    data: data.map(item=>item.value),
                    type: 'bar',
                    barWidth:20,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                            formatter: '{c}只',
                            position:'right',
                            color:"#fff",
                            textBorderColor:'transparent'
                        },
                    },
                    itemStyle:{
                        normal: {
                            borderRadius: [0, 20, 20, 0],
                            color: (params)=> {
                                return this.$colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        }

        let barChart = this.$echarts.init(this.$refs.bar)
        barChart.setOption(option2)
        autoHover(barChart,option2,1500)
      }
  },
};
</script>
<style lang="scss" scoped>
.pest {
  width: 100%;
  height: 100%;
  display: flex;
  .pie {
    width: 30%;
    height: 100%;
  }
  .bar {
    width: 70%;
    height: 100%;
  }
}
</style>
