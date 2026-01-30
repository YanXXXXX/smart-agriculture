<template>
    <div>
        <div v-show="false">{{ height }}{{ width }}{{ chartsValue }}</div>
        <div class="view-chart-gauge" ref="chartView" :id="detail.identifier" />
    </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseView from '../View';

export default {
    name: 'ViewChartGauge',
    extends: BaseView,
    props: {},
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        width() {
            this.$nextTick(function () {
                this.myChart.resize({
                    width: this.detail.style.position.w,
                    height: this.detail.style.position.h,
                });
            });
            return this.detail.style.position.w;
        },
        height() {
            this.$nextTick(function () {
                this.myChart.resize({
                    width: this.detail.style.position.w,
                    height: this.detail.style.position.h,
                });
            });
            return this.detail.style.position.h;
        },
        chartsValue() {
            let paramValue = 0;
            if (this.detail.dataBind.identifier && this.mqttData && this.mqttData.serialNumber == this.detail.dataBind.serialNumber) {
                const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                if (message) {
                    paramValue = message.value;
                    if (isNaN(paramValue)) {
                        paramValue = 0;
                    }
                    //将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新
                    this.$nextTick(function () {
                        this.setOption(paramValue);
                    });
                }
            }
            return this.detail.dataBind.modelValue + this.detail.style.foreColor + this.detail.style.fontSize + this.detail.dataBind.unit;
        },
    },
    data() {
        return {
            myChart: null,
            option: {},
            timer: null,
        };
    },
    mounted() {
        this.myChart = this.$echarts.init(document.getElementById(this.detail.identifier));
        this.setOption(0);
    },
    methods: {
        setOption(paramValue) {
            var data = [
                { title: this.detail.dataBind.modelName, sub_title: paramValue + this.detail.dataBind.unit, value: paramValue, min: this.detail.dataBind.paramMin, max: this.detail.dataBind.paramMax },
                // { 'title': '湿度', 'sub_title': '50%', value: "50", 'min': 0, 'max': 100 }
            ];
            // 不同数据长度，圆心位置
            var pos_cfg = {
                1: [['50%', '50%']],
            };
            var data_len = data.length;
            // 获取位置信息
            var pos_info = pos_cfg[data_len];
            // 圆环颜色配置
            var color_cfg = [
                [
                    { offset: 0, color: 'rgba(90, 255, 163, 1)' },
                    { offset: 0.5, color: 'rgba(80, 192, 255, 1)' },
                    { offset: 1, color: 'rgba(102, 255, 255, 1)' },
                ],
                [
                    { offset: 0, color: 'rgba(50, 197, 255, 1)' },
                    { offset: 0.5, color: 'rgba(254, 219, 101, 1)' },
                    { offset: 1, color: 'rgba(250, 100, 0, 1)' },
                ],
            ];
            // 渲染数据
            var series = [],
                item = null;
            for (var i in data) {
                item = data[i];
                // 处理最大值及最小值
                if (!item.min) item.min = 0;
                if (!item.max) item.max = item.value / 0.8 + Math.random(0, parseInt(item.value * 0.2)) + 1;
                // 获取比率
                item.rate = Math.round((item.value / item.max) * 10000) / 100;
                // 拼接图表参数
                series.push(
                    {
                        name: '最外层',
                        type: 'gauge',
                        center: pos_info[i],
                        radius: '95%',
                        startAngle: 150,
                        endAngle: -209.999,
                        axisLine: {
                            show: true,
                            lineStyle: { width: 2, color: [[1, 'rgba(25, 235, 255,1)']] },
                        },
                        axisLabel: { show: false },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        detail: { show: false },
                        pointer: { show: false },
                    },
                    {
                        name: '内层渐变区',
                        type: 'gauge',
                        radius: '60%',
                        splitNumber: 10, // 刻度数量
                        center: pos_info[i],
                        startAngle: 150,
                        endAngle: -209.999,
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [
                                        1,
                                        {
                                            type: 'radial',
                                            colorStops: [
                                                { offset: 0.72, color: '#0320462e' },
                                                { offset: 0.84, color: '#08698961' },
                                                { offset: 0.98, color: '#0FAFCBa6' },
                                                { offset: 1, color: '#0EA4C1f0' },
                                            ],
                                        },
                                    ],
                                ],
                                width: 1000,
                            },
                        },
                        splitLine: { show: false }, // 分隔线
                        axisTick: { show: false }, // 刻度线
                        axisLabel: { show: false }, // 刻度标签
                        pointer: { show: false }, // 仪表盘指针
                        detail: { show: false },
                    },
                    {
                        name: '中间层',
                        type: 'gauge',
                        center: pos_info[i],
                        radius: '80%',
                        min: item.min, // 最小刻度
                        max: item.max, // 最大刻度
                        splitNumber: 10, // 刻度数量
                        startAngle: 245,
                        endAngle: -65,
                        data: [{ value: item.rate }],
                        axisLine: {
                            show: true,
                            lineStyle: { width: 1, color: [[1, '#42B3D0']] },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 10,
                                color: [
                                    [item.rate / 100, this.$echarts.graphic.LinearGradient(0, 1, 1, 0, color_cfg[i])],
                                    [1, 'rgba(50, 197, 255,.1)'],
                                ],
                            },
                        },
                        axisLabel: { show: true, color: this.detail.style.foreColor, distance: 32, textStyle: { fontSize: this.detail.style.fontSize - 4 } },
                        axisTick: { show: true, length: -5, distance: -10, lineStyle: { color: 'rgba(25, 235, 255, 1)' } },
                        splitLine: { show: true, length: -10, distance: -10, lineStyle: { width: 1, color: 'rgba(25, 235, 255, 1)' } },
                        detail: {
                            offsetCenter: [0, '-5%'],
                            textStyle: { fontSize: this.detail.style.fontSize, color: this.detail.style.foreColor },
                            formatter: [item.title, '{name|' + item.sub_title + '}'].join('\n'),
                            rich: { name: { fontSize: this.detail.style.fontSize + 4, lineHeight: 18, color: this.detail.style.foreColor, fontWeight: '600' } },
                        },
                        title: { color: this.detail.style.foreColor },
                        pointer: { show: false },
                    }
                );
            }
            var option = {
                series: series,
            };
            console.log(123,option)
            this.myChart.setOption(option);
        },
    },
    beforeDestroy() {},
};
</script>

<style lang="scss">
.view-chart-gauge {
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
