<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px" style="">
                <el-form-item label="时间范围">
                    <el-date-picker v-model="daterangeTime" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="最大数量">
                    <el-input v-model="queryParams.total"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="getStatisticData">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
            <el-alert title="此处只展示整数和小数类型且开启历史数据的参数" type="info" effect="light" show-icon closable></el-alert>
    <el-row>
        <el-col v-for="(item,index) in monitorThings" :key="index" :span="12">
            <div  style="margin-top:30px;width:100%;">
                <div ref="statisticMap" style="height:300px;width:100%;"></div>
            </div>
        </el-col>
    </el-row>

</div>
</template>

<script>
import {
    listMonitor
} from "@/api/iot/deviceLog";
import {
    getDeviceRunningStatusSingle
} from "@/api/iot/device"

export default {
    name: "device-statistic",
    props: {
        device: {
            type: Object,
            default: null
        },
        chartVisible:{
            type:Boolean,
            default:false
        }
    },
    watch: {
        // 获取到父组件传递的device后
        device: async function (newVal, oldVal) {
            this.deviceInfo = newVal;
            if (this.deviceInfo && this.deviceInfo.deviceId != 0) {
                // 监测数据
                await this.getDeviceRunningStatusSingle();
                // 加载图表
                this.$nextTick(function () {
                    // 绘制图表
                    this.getStatistic();
                    // // 获取统计数据
                    this.getStatisticData(this.monitorThings);
                });
            }
        },
        chartVisible:{
            handler:function(n,o){
                if(n){
                    for (let i = 0; i < this.monitorThings.length; i++) {
                        this.chart[i].resize();
                    }
                }
            }
        }
    },
    data() {
        return {
            // 设备信息
            deviceInfo: {},
            // 监测物模型
            monitorThings: [],
            // 图表集合
            chart: [],
            // 激活时间范围
            daterangeTime: [],
            // 查询参数
            queryParams: {
                serialNumber: null,
                identity: "",
                total: 50,
            },
            // 对象数组类型物模型暂存数据
            arrayData: []
        };
    },
    methods: {
        /** 查询数据接口 */
        async getDeviceRunningStatusSingle(){
            const {data} = await getDeviceRunningStatusSingle(this.deviceInfo.deviceId,1);
            this.monitorThings = data;
        },
        /** 获取统计数据 */
        async getStatisticData() {
            for (let i = 0; i < this.monitorThings.length; i++) {
                this.queryParams.serialNumber = this.deviceInfo.serialNumber;
                this.queryParams.identity = this.monitorThings[i].id;
                if (null != this.daterangeTime && '' != this.daterangeTime) {
                    this.queryParams.beginTime = this.daterangeTime[0]+" 00:00:00"
                    this.queryParams.endTime = this.daterangeTime[1] + " 23:59:00";
                }
                if (String(this.monitorThings[i].id)) {
                    listMonitor(this.queryParams).then(res => {
                        let data = res.rows;
                        // 对象转数组
                        let dataList = [];
                        for (let j = 0; j < data.length; j++) {
                            let item = [];
                            item[0] = data[j].time;
                            item[1] = data[j].value;
                            dataList.push(item);
                        }
                        // 图表显示数据
                        this.chart[i].setOption({
                            series: [{
                                data: dataList
                            }]
                        });
                    })

                }
            }
        },

        /**监测统计数据 */
        getStatistic() {
            let color = ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'];
            for (let i = 0; i < this.monitorThings.length; i++) {
                this.chart[i] = this.$echarts.init(this.$refs.statisticMap[i]);
                var option;
                option = {
                    animationDurationUpdate: 3000,
                    tooltip: {
                        trigger: 'axis',
                    },
                    title: {
                        left: 'center',
                        text: this.monitorThings[i].name + '统计 （单位 ' + (this.monitorThings[i].dataType.unit != undefined ? this.monitorThings[i].dataType.unit : "无") + "）",
                    },
                    grid: {
                        top: '80px',
                        left: '40px',
                        right: '20px',
                        bottom: '60px',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'time',
                    },
                    yAxis: {
                        type: 'value',
                    },
                    dataZoom: [{
                        type: 'slider', // 表示有滑动条的缩放
                        start: 0,
                        end: 100
                    }, {
                        type: 'inside', // 表示内置的缩放
                        mouseWheel: false // 禁用鼠标滚轮
                    }],
                    series: [{
                        name: this.monitorThings[i].name,
                        type: 'line',
                        symbol: 'none',
                        sampling: 'lttb',
                        itemStyle: {
                            color: i > 9 ? color[0] : color[i]
                        },
                        areaStyle: {},
                        data: []
                    }]
                };
                option && this.chart[i].setOption(option);
            }
        },
    }
};
</script>
