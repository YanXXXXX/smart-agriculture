<template>
  <div class="box">
    <div>
      <div class="echart" id="mychart1" ref="chart"></div>
    </div>
    <div>
      <div class="echart" id="mychart2"></div>
    </div>
  </div>
</template>
<script>
import { selectRecordGroupByCity } from '@/api/trace/dataStatistics';
import { autoHover } from '../echartsOption';
export default {
  data() {
    return {};
  },
  props: {
    baseId: Number,
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
    async initEcharts() {
      let { rows } = await selectRecordGroupByCity(this.baseId);
      let list1=[], list2=[];
      rows.forEach((item) => {
        list1.push(item.value);
        list2.push(item.name);
      });
      let sum = rows.reduce((sum,item)=>sum+item.value,0)
      let option = {
        color: this.$colorList,
        series: [
          {
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['50%', '60%'],
            data: rows,
            startAngle: 180,
            label: {
              show: true,
              position: 'center',
              formatter: () =>
                `{title|合计次数}\n{titleValue|${sum}}{titleUnit|次}`,
              rich: {
                name: {
                  color: '#DEDEDE',
                  fontSize: 16,
                  align: 'left',
                  padding: [0, 10, 20, 0],
                },
                name1: {
                  color: '#DEDEDE',
                  fontSize: 16,
                  align: 'left',
                  padding: [0, 0, 0, 10],
                },
                value: {
                  color: '#ccc',
                  fontSize: 14,
                  align: 'left',
                },
                title: {
                  color: '#fff',
                  fontSize: 14,
                },
                titleUnit: {
                  color: '#fff',
                  fontSize: 16,
                  padding: [15, 0, 0, 0],
                },
                titleValue: {
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 700,
                  padding: [15, 5, 5, 5],
                },
              },
            },
          },
        ],
      };
      const myChart = this.$echarts.init(document.getElementById('mychart1'));
      myChart.setOption(option);
      autoHover(myChart,option,1500);

      let option2 = {
        grid: {
          top: '6%',
          left: '1%',
          right: '20%',
          bottom: '30%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: '{b0}: {c0}',
        },

        xAxis: {
          show: false, //是否显示x轴
          type: 'value',
        },
        yAxis: {
          type: 'category',
          inverse: true, //让y轴数据逆向
          axisLabel: {
            show: true,
            textStyle: {
              color: '#666', //y轴字体颜色
            },
            formatter: function (value, index) {
              return ['{title|' + value + '} '].join('\n');
            },
            //定义富文本标签
            rich: {
              lg: {
                fontWeight: 'bold',
                fontSize: 12, //字体默认12
                color: '#08C',
                padding: [0, 5, 0, 0],
              },
              title: {
                color: '#fff',
                fontWeight: 'lighter',
              },
            },
          },
          splitLine: { show: false }, //横向的线
          axisTick: { show: false }, //y轴的端点
          axisLine: { show: false }, //y轴的线
          data: list2,
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
                  fontSize: 12,
                },
                formatter: '{c}' + '次',
              },
            },
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: (params) => {
                  return this.$colorList[params.dataIndex];
                },
              },
            },
            barWidth: 10,
            data: list1,
          },
          {
            name: '外框',
            type: 'bar',

            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: '#285079',
              },
            },
            barGap: '-100%',
            z: 0,
            barWidth: 10,
            data: [50, 50, 50, 50, 50],
          },
        ],
      };
      const myChart2 = this.$echarts.init(document.getElementById('mychart2'));
      myChart2.setOption(option2);
      autoHover(myChart2,option2,1500);
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
}
#mychart1 {
  width: 300px;
  height: 296px;
}
#mychart2 {
  width: 360px;
  height: 380px;
}
</style>
