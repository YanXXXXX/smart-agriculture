<template>
  <div>
    <div class="echart" id="mychart7" style="height: 330px"></div>
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
      const color = ['#ffdc2b', '#4d8cfd', '#45e6de','#7891D9','#FF6B6B'];
      const datas = [
        {
          name: '资本投入',
          value: 4480,
        },
        {
          name: '省级以上',
          value: 3430,
        },
        {
          name: '金融机构',
          value: 5200,
        },
        {
          name: '财政投入',
          value: 3417.16,
        },
        {
          name: '市级财政',
          value: 3600,
        },
      ];
      let sum = 0;
      for (var i of datas) {
        sum += i.value;
      }
      const title = {
        name: '合计收入',
        value: sum,
        unit: '万元',
      };
      const rich = {
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
      };
      let option = {
        color,
        legend:
          [
            {
              orient: 'horizontal',
              itemWidth: 10,
              itemHeight: 10,
              right: '20%',
              top: '10%',
              itemGap: 60,
              textStyle: {
                color: '#D7E5FF',
                fontSize:'16px'
              },
              data: ['资本投入', '省级以上'],
            },
            {
              orient: 'horizontal',//水平排列。（vertical为垂直排列}
              itemWidth: 10,
              itemHeight: 10,
              right: '20%',
              top: '36%',
              itemGap: 60,
              textStyle: {
                color: '#D7E5FF',
                fontSize:'16px'
              },
              data: ['金融机构', '财政投入'],
            },
            {
              orient: 'horizontal',//水平排列。（vertical为垂直排列}
              itemWidth: 10,
              itemHeight: 10,
              right: '43.8%',
              top: '62%',
              itemGap: 60,
              textStyle: {
                color: '#D7E5FF',
                fontSize:'16px'
              },
              data: ['市级财政'],
            },
          ],

        series: [
          {
            type: 'pie',
            center: ['20%', '40%'],
            radius: ['50%', '60%'],
            data: datas,
            startAngle: 180,
            label: {
              show: true,
              position: 'center',
              formatter: () => `{title|${title.name}}\n{titleValue|${title.value}}{titleUnit|${title.unit}}`,
              rich,
            },
          },
        ],
      };
      const myChart = this.$echarts.init(document.getElementById("mychart7"));
      myChart.setOption(option);
      autoHover(myChart,option,1500)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
