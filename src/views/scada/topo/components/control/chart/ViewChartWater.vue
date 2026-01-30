<template>
    <div>
        <div class="view-chart-water" ref="chartView" :id="detail.identifier"></div>
        <div v-show="false">{{ chartsValue }}{{ width }}{{ height }}{{ detail.style.waterColor }}{{ typeChange }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import 'echarts-liquidfill'; // 引入水球图的组件

import BaseView from '../View';

export default {
    name: 'ViewChart',
    extends: BaseView,
    props: {},
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        chartsValue: function () {
            //将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新
            if (this.detail.dataBind.identifier && this.mqttData && this.mqttData.serialNumber == this.detail.dataBind.serialNumber) {
                const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                if (message) {
                    const paramValue = message.value;
                    if (isNaN(paramValue)) {
                        paramValue = 0;
                    }
                    this.paramValue = paramValue;
                }
            }
            return this.detail.dataBind.paramValue;
        },
        typeChange: function () {
            return this.detail.style.waterShape;
        },
        width: function () {
            this.$nextTick(function () {
                this.myChart &&
                    this.myChart.resize({
                        width: this.detail.style.position.w,
                        height: this.detail.style.position.h,
                    });
            });
            return this.detail.style.position.w;
        },
        height() {
            this.$nextTick(function () {
                this.myChart &&
                    this.myChart.resize({
                        width: this.detail.style.position.w,
                        height: this.detail.style.position.h,
                    });
            });
            return this.detail.style.position.h;
        },
        option() {
            let waterData = this.paramValue / 100;
            let tempOption = {
                series: [
                    {
                        // 液位图
                        type: 'liquidFill',
                        //显示文字
                        label: {
                            formatter: function (param) {
                                return parseInt(param.value * 100) + '%';
                            },
                            fontSize: this.detail.style.waterFontSize,
                            position: ['50%', '50%'],
                        },
                        //波浪颜色
                        color: [this.detail.style.waterColor],
                        //鼠标放上显示
                        tooltip: {
                            show: true,
                        },
                        //transparent
                        backgroundStyle: {
                            //边框宽度
                            borderWidth: this.detail.style.waterBorderWidth,
                            borderColor: this.detail.style.waterBorderColor,
                            //背景色
                            color: this.detail.style.waterBackColor,
                        },
                        data: [waterData],
                        // 液位图类型 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow',svg路径,container(充满容器)
                        shape: this.detail.style.waterShape,
                        name: '名称',
                        outline: {
                            //边框
                            show: false,
                        },
                        //初始动画加载时间，毫秒
                        animationDuration: 0,
                        //数据更改加载时间，毫秒
                        animationDurationUpdate: 2000,
                        //数据更改样式
                        animationEasingUpdate: 'cubicOut',
                        //波浪坡度
                        amplitude: 5,
                        //液体滚动速度
                        period: function (value, index) {
                            // 滚动毫秒
                            return 2000;
                        },
                    },
                ],
            };
            return tempOption;
        },
    },
    data() {
        return {
            paramValue: 0,
            myChart: null,
        };
    },
    watch: {
        option: {
            handler(newVal, oldVal) {
                // 数据自动刷新，必然需要一个监听机制告诉Echarts重新设置数据
                if (this.myChart) {
                    if (newVal) {
                        this.myChart.setOption(newVal);
                    } else {
                        this.myChart.setOption(oldVal);
                    }
                } else {
                    this.initEchart();
                }
            },
            deep: true, // 对象内部属性的监听
        },
    },
    mounted() {
        this.initEchart();
    },
    methods: {
        initEchart() {
            this.myChart = this.$echarts.init(document.getElementById(this.detail.identifier));
            this.myChart.setOption(this.option);
        },
    },
};
</script>

<style lang="scss">
.view-chart-water {
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
