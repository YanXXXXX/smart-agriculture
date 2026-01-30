<template>
    <div>
        <div v-show="false">{{ height }}{{ width }}{{ chartsValue }}{{ foreColor }}</div>
        <div class="view-chart-pie" ref="chartView" :id="detail.identifier" />
    </div>
</template>

<script>
import BaseView from '../View';
import { getDeviceStatistic } from '@/api/scada/topo';

export default {
    name: 'ViewChartPie',
    extends: BaseView,
    computed: {
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
            //将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新
            this.$nextTick(function () {
                let current = {
                    deviceOnlineCount: 0,
                    deviceOfflineCount: 0,
                    alertDeviceCount: 0,
                    alertProcessedCount: 0,
                    alertNotProcessedCount: 0,
                    orderRecordProcessedNum: 0,
                    orderRecordUntreatedNum: 0,
                    orderRecordAbandonNum: 0,
                };
                if (this.detail.style.pieType == '设备状态') {
                    this.myChart.setOption(this.getDeviceChartsData(current));
                } else if (this.detail.style.pieType == '报警状态') {
                    this.myChart.setOption(this.getWarnChartsData(current));
                } else {
                    this.myChart.setOption(this.getOrderChartsData(current));
                }
            });
            return this.detail.style.pieType;
        },
        foreColor() {
            this.$nextTick(function () {
                this.getStaticData();
            });
            return this.detail.style.foreColor;
        },
    },
    data() {
        return {
            myChart: null,
            option: {},
            timer: null,
        };
    },
    methods: {
        getStaticData() {
            getDeviceStatistic().then((res) => {
                if (res.code === 200) {
                    if (this.detail.style.pieType == '设备状态') {
                        this.myChart.setOption(this.getDeviceChartsData(res.data));
                    } else if (this.detail.style.pieType == '报警状态') {
                        this.myChart.setOption(this.getWarnChartsData(res.data));
                    } else {
                        this.myChart.setOption(this.getOrderChartsData(res.data));
                    }
                }
            });
        },
        //设备状态
        getDeviceChartsData(currData) {
            let option = {
                color: ['#13ce66', '#909399', '#ff4949'],
                title: {
                    text: '设备状态',
                    left: 'center',
                    textStyle: {
                        fontFamily: 'Microsoft YaHei',
                        fontStyle: 'normal',
                        fontWeight: 'normal', //标题颜色
                        color: this.detail.style.foreColor,
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    top: '10%',
                    left: 'center',
                    textStyle: { color: this.detail.style.foreColor },
                },
                series: [
                    {
                        name: '网关设备',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: currData.deviceOnlineCount, name: '在线 ' + currData.deviceOnlineCount, label: { color: this.detail.style.foreColor } },
                            { value: currData.deviceOfflineCount, name: '离线 ' + currData.deviceOfflineCount, label: { color: this.detail.style.foreColor } },
                            { value: currData.alertDeviceCount, name: '报警 ' + currData.alertDeviceCount, label: { color: this.detail.style.foreColor } },
                        ],
                    },
                ],
            };
            return option;
        },
        //报警状态
        getWarnChartsData(currData) {
            let option = {
                color: ['#13ce66', '#ff4949'],
                title: {
                    text: '报警状态',
                    left: 'center',
                    textStyle: {
                        fontFamily: 'Microsoft YaHei',
                        fontStyle: 'normal',
                        fontWeight: 'normal', //标题颜色
                        color: this.detail.style.foreColor,
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    top: '10%',
                    left: 'center',
                    textStyle: { color: this.detail.style.foreColor },
                },
                series: [
                    {
                        name: '网关设备',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: currData.alertProcessedCount, name: '已处理 ' + currData.alertProcessedCount, label: { color: this.detail.style.foreColor } },
                            { value: currData.alertNotProcessedCount, name: '未处理 ' + currData.alertNotProcessedCount, label: { color: this.detail.style.foreColor } },
                        ],
                    },
                ],
            };
            return option;
        },
        //工单状态
        getOrderChartsData(currData) {
            let option = {
                color: ['#2979ff', '#fa3534', '#ff9900'], // '#5C7BD9',
                title: {
                    text: '工单状态',
                    left: 'center',
                    textStyle: {
                        fontFamily: 'Microsoft YaHei',
                        fontStyle: 'normal',
                        fontWeight: 'normal', //标题颜色
                        color: this.detail.style.foreColor,
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    top: '10%',
                    left: 'center',
                    textStyle: { color: this.detail.style.foreColor },
                },
                series: [
                    {
                        name: '网关设备',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: currData.orderRecordProcessedNum, name: '已巡检 ' + currData.orderRecordProcessedNum, label: { color: this.detail.style.foreColor } },
                            { value: currData.orderRecordUntreatedNum, name: '未巡检 ' + currData.orderRecordUntreatedNum, label: { color: this.detail.style.foreColor } },
                            { value: currData.orderRecordAbandonNum, name: '已废弃 ' + currData.orderRecordAbandonNum, label: { color: this.detail.style.foreColor } },
                        ],
                    },
                ],
            };
            return option;
        },
    },
    mounted() {
        this.myChart = this.$echarts.init(document.getElementById(this.detail.identifier));
        this.getStaticData();
        this.timer = setInterval(() => {
            this.getStaticData();
        }, 60000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="scss">
.view-chart-pie {
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
</style>
