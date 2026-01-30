<template>
  <div>
    <div class="echart" id="mychart5" style="height: 250px"></div>
  </div>
</template>
<script>
import {selectRecordGroupBySellpro} from '@/api/trace/dataStatistics'
export default {
  data () {
    return {
    }
  },
  props:{
      baseId:Number
  },
  watch: {
    baseId: {
      handler: async function (n) {
        if (n) {
            await this.$nextTick();
            this.initEcharts();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async initEcharts () {
        let {rows} = await selectRecordGroupBySellpro(this.baseId)
        console.log(444,rows);
        let names=[],values=[];
        rows.forEach((item)=>{
            values.push(item.value)
            names.push(item.name)
        })
      let option = {
        grid: {
          left: '2%',
          right: '5%',
          bottom: '4%',
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
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" + params[0].value+'次'
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
          data: names
        }],
        series: [{
          name: '完成率',
          type: 'bar',
          zlevel: 1,
          itemStyle: {
            normal: {
              borderRadius: [0, 10,10,0] ,// 设置两个数值
              color: (params) => {
                return this.$colorList[params.dataIndex]
              }
            },
          },
          barWidth: 12,
          data: values
        }
        ]
      };
      const myChart = this.$echarts.init(document.getElementById("mychart5"));
      myChart.setOption(option);
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
