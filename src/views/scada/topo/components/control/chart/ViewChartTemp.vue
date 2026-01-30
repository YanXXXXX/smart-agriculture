<template>
    <div>
        <div v-show="false">{{ height }}{{ width }}{{ chartsValue }}</div>
        <div class="view-chart-temp" ref="chartView" :id="detail.identifier" />
    </div>
</template>

<script>
import { mapState } from 'vuex';

import topoUtil from '@/utils/topo/topo-util';
import BaseView from '../View';

export default {
    name: 'ViewChartTemp',
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
            let foreColor = '';
            if (this.detail.dataBind.identifier && this.mqttData && this.mqttData.serialNumber == this.detail.dataBind.serialNumber) {
                const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                if (message) {
                    paramValue = message.value;
                    if (isNaN(paramValue)) {
                        paramValue = 0;
                    }
                    this.detail.dataBind.stateList.forEach((element) => {
                        let isSure = topoUtil.judgeSize(element.paramCondition, paramValue, element.paramData);
                        if (isSure) {
                            foreColor = element.foreColor;
                        }
                    });
                    this.$nextTick(function () {
                        this.setOption(paramValue);
                    });
                }
                if (foreColor) {
                    this.detail.style.foreColor = foreColor;
                }
            }
            return this.detail.dataBind.modelValue;
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
            //将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新
            let max = this.detail.dataBind.paramMax,
                min = this.detail.dataBind.paramMin,
                temp = paramValue,
                tempColor = this.detail.style.foreColor,
                interval = this.detail.dataBind.interval,
                unit = this.detail.dataBind.unit == null ? '' : this.detail.dataBind.unit;
            let option = {
                grid: {
                    right: '50%',
                    left: '50%',
                },
                title: {
                    bottom: 'bottom',
                    left: 'center',
                    textStyle: { fontSize: 14 },
                },
                xAxis: [
                    {
                        type: 'category',
                        show: false,
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLine: {
                            onZero: false,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: min,
                        max: max,
                        interval: interval,
                        axisTick: {
                            show: true,
                            length: 5,
                            lineStyle: {
                                // color: 'white',
                            },
                        },
                        minorTick: {
                            show: true,
                        },
                        nameTextStyle: {
                            color: 'white',
                        },
                        axisLine: {
                            // onZero:false,
                        },
                        splitLine: {
                            show: false,
                        },
                        offset: 10,
                        axisLabel: {
                            margin: 20,
                            // color: '#fff',
                            fontSize: 12,
                        },
                    },
                ],
                series: [
                    {
                        name: '透明框',
                        type: 'bar',
                        // xAxisIndex: 2,
                        data: [max],
                        barWidth: 6,
                        itemStyle: {
                            color: 'transparent',
                            barBorderRadius: 50,
                            borderWidth: 20,
                            borderType: 'solid',
                            borderColor: 'grey',
                        },
                        z: 1,
                    },
                    {
                        z: 19,
                        barGap: '-100%',
                        type: 'bar',
                        barWidth: 6,
                        stack: 'Total',
                        label: {
                            show: true,
                            formatter: function (p) {
                                return '  {temp|' + p.value + unit + '}';
                            },
                            position: [10, -20],
                            rich: {
                                temp: {
                                    // color: 'white',
                                    lineHeight: 30,
                                    padding: [0, 0, 0, 3],
                                    fontSize: 18,
                                    verticalAlign: 'middle',
                                    align: 'center',
                                    height: 30,
                                },
                            },
                        },
                        itemStyle: {
                            borderWidth: 3,
                            borderColor: tempColor,
                        },
                        showBackground: true,
                        backgroundStyle: {
                            color: '#cccccc',
                        },
                        data: [temp],
                    },
                    {
                        name: '圆',
                        type: 'scatter',
                        hoverAnimation: false,
                        data: [min],
                        symbolSize: 58,
                        itemStyle: {
                            normal: {
                                color: 'grey',
                                opacity: 1,
                            },
                        },
                        z: 12,
                    },
                    {
                        name: '白圆',
                        type: 'scatter',
                        hoverAnimation: false,
                        data: [min],
                        symbolSize: 30,
                        itemStyle: {
                            normal: {
                                color: tempColor,
                                opacity: 1,
                            },
                        },
                        z: 18,
                    },
                ],
            };
            this.myChart.setOption(option);
        },
    },
    beforeDestroy() {},
};
</script>

<style lang="scss">
.view-chart-temp {
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
