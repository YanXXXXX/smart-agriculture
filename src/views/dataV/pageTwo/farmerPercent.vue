<template>
  <div>
    <div class="echart" id="mychart6" style="height: 330px"></div>
  </div>
</template>
<script>
import{autoHover} from '../echartsOption'
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
      const color = ['#ffdc2b', '#4d8cfd', '#45e6de','#7891D9'];
      const datas = [
        {
          name: '带动就业',
          value: 25,
        },
        {
          name: '二三产业',
          value: 75,
        },
        {
          name: '返乡产业',
          value: 75,
        },
        {
          name: '带动贫困',
          value: 155,
        },
      ];
      let sum = 0;
      for (var i of datas) {
        sum += i.value;
      }
      const title = {
        name: '合计人数',
        value: sum,
        unit: '人',
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
          fontSize: 12,
        },
        titleUnit: {
          color: '#fff',
          fontSize: 16,
          padding: [15, 0, 0, 0],
        },
        titleValue: {
          color: '#fff',
          fontSize: 24,
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
              top: '26%',
              itemGap: 60,
              textStyle: {
                color: '#D7E5FF',
                fontSize:'16px'
              },
              data: ['带动就业', '二三产业'],
            },
            {
              orient: 'horizontal',//水平排列。（vertical为垂直排列}
              itemWidth: 10,
              itemHeight: 10,
              right: '20%',
              top: '50%',
              itemGap: 60,
              textStyle: {
                color: '#D7E5FF',
                fontSize:'16px'
              },
              data: ['返乡产业', '带动贫困'],
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
      const myChart = this.$echarts.init(document.getElementById("mychart6"));
      myChart.setOption(option);
      autoHover(myChart,option,1500)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
