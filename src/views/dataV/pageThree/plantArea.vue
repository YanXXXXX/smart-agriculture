<template>
  <div class="plantArea" id="plnatArea"></div>
</template>

<script>
import { selectBatchInfo } from '@/api/agriculture/dataStatistics';
import { bar, autoHover } from '../echartsOption';
export default {
  data() {
    return {
    };
  },
  props: {
    baseId: Number,
  },
  watch: {
    baseId: {
      handler: async function (n) {
        if (n) {
          await this.$nextTick();
          const {rows} = await selectBatchInfo(this.baseId);
          let option = {
                tooltip: {
                    trigger: "axis",
                    showContent: false,
                    axisPointer: {
                        type: "shadow",
                        crossStyle: {
                            color: "#999"
                        }
                    },
                },
                grid:{
                    left:30,
                    top:20,
                    right:20,
                    bottom:20
                },
                xAxis: {
                    type: 'category',
                    data: rows.map(item=>item.name),
                    axisLabel:{
                        color:'#fff'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel:{
                        color:'#fff'
                    }
                },
                series: [
                    {
                        data: rows.map(item=>item.value),
                        type: 'bar',
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 12,
                                formatter: '{c}亩',
                                position:'top',
                                color:"#fff",
                                textBorderColor:'transparent'
                            },
                        },
                        barWidth:20,
                        itemStyle:{
                            normal: {
                                color: (params) =>{
                                    return this.$colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };
          let myChart = this.$echarts.init(document.getElementById('plnatArea'));
          myChart.setOption(option);
          autoHover(myChart,option, 1500);
        }
      },
      immediate: true,
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.plantArea {
  height: 100%;
  width: 100%;
}
</style>
