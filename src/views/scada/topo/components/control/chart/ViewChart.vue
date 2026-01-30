<template>
    <div>
        <div v-show="false">{{ height }}{{ width }}{{ foreColor }}</div>
        <div class="view-chart" ref="chartView" :id="detail.identifier" v-show="this.detail.dataBind.lData.length > 0" @dblclick="handleDblclick" />
        <div
            v-show="this.detail.dataBind.lData.length === 0"
            :style="{
                width: this.detail.style.position.w + 'px',
                height: this.detail.style.position.h + 'px',
                'text-align': 'center',
                'line-height': this.detail.style.position.h + 'px',
                'font-size': '30px',
                color: '#368a42',
            }"
            @dblclick="handleDblclick"
        >
            双击绑定变量
        </div>
        <el-dialog title="变量绑定" :visible.sync="dialogVisible" width="40%" append-to-body>
            <div style="min-height: 400px" v-loading="loading" v-if="paramNameList.length > 0">
                <div style="margin: 0 15px 15px; color: red">多属性对比时，多个属性上报时间需一样！</div>
                <el-form label-width="85px">
                    <el-form-item v-for="item in paramNameList" :key="item.id" :label="item.name">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox v-for="chil in item.children" :key="`${item.id}-${chil.id}`" :label="`${item.id}*${chil.id}*${chil.type}`">{{ chil.name }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <el-empty v-else description="请先绑定设备或为设备创建物模型"></el-empty>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
                <el-button type="primary" @click="handleClick">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BaseView from '../View';
import topoUtil from '@/utils/topo/topo-util';
import { listDeviceThingsModel, getThingsModelHistory } from '@/api/scada/topo';

export default {
    name: 'view-chart',
    extends: BaseView,
    props: {},
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
        foreColor() {
            this.$nextTick(function () {
                this.option.legend.textStyle.color = this.detail.style.foreColor;
                this.setOption(this.option);
            });
            return this.detail.style.foreColor;
        },
    },
    data() {
        return {
            loading: false,
            form: {
                type: [],
            },
            myChart: null,
            option: {
                title: {
                    text: '',
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    textStyle: { color: this.detail.style.foreColor },
                    data: [],
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                    },
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLabel: {
                        formatter: function (param) {
                            let time = param.split(' ')[1];
                            return time;
                        },
                        inside: false,
                        // interval: 0, // 强制文字产生间隔
                        // rotate: 90, // 文字逆时针旋转45°
                    },
                },
                yAxis: {
                    type: 'value',
                },
                series: [],
            },
            paramList: [],
            paramNameList: [],
            checkList: [],
            dialogVisible: false,
            timer: null,
        };
    },
    methods: {
        // 双击
        handleDblclick() {
            this.getParam();
            this.dialogVisible = true;
        },
        handleClick() {
            this.getChartsData();
        },
        setOption(option) {
            this.myChart.setOption(option);
        },
        //获取设备变量
        getParam() {
            this.loading = true;
            const params = {
                pageNum: 1,
                pageSize: 999,
                scadaGuid: this.$route.query.guid,
            };
            this.paramNameList = [];
            listDeviceThingsModel(params)
                .then((res) => {
                    if (res.code == 200) {
                        this.paramList = res.rows;
                        this.paramNameList = this.formatParamName(res.rows);
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        },
        // 格式化属性数据
        formatParamName(list) {
            let datas = [];
            if (list.length !== 0) {
                list.forEach((item, i, arry) => {
                    if (i === 0) {
                        let par = {
                            id: item.serialNumber,
                            name: item.deviceName,
                            children: [
                                {
                                    id: item.identifier,
                                    name: item.modelName,
                                    type: item.type,
                                },
                            ],
                        };
                        datas.push(par);
                    } else {
                        let par = datas.find((d) => d.id === item.serialNumber);
                        if (par) {
                            let chil = {
                                id: item.identifier,
                                name: item.modelName,
                                type: item.type,
                            };
                            par.children.push(chil);
                        } else {
                            let par = {
                                id: item.serialNumber,
                                name: item.deviceName,
                                children: [
                                    {
                                        id: item.identifier,
                                        name: item.modelName,
                                        type: item.type,
                                    },
                                ],
                            };
                            datas.push(par);
                        }
                    }
                });
            }
            return datas;
        },
        // 获取属性数据
        getChartsData() {
            if (this.checkList.length !== 0) {
                let serialNumber = this.checkList[0].split('*')[0];
                let res = this.checkList.find((item) => item.indexOf(serialNumber) === -1);
                if (res) {
                    this.$message.error('请选择同一个设备的属性！');
                    return;
                }
                let identifiers = this.checkList.map((item) => ({
                    identifier: item.split('*')[1],
                    type: item.split('*')[2],
                }));
                let query = {
                    serialNumber: serialNumber,
                    beginTime: topoUtil.getTime(8),
                    endTime: topoUtil.getNowTime(),
                    thingsModelList: identifiers,
                };
                console.log(query)
                getThingsModelHistory(query).then((res) => {
                    if (res.code == 200) {
                        let ldata = [];
                        let xdata = [];
                        let ydata = [];
                        const modelIdens = Object.keys(res.data) || [];
                        if (modelIdens.length !== 0) {
                            ldata = modelIdens.map((item) => this.paramList.find((p) => p.identifier === item).modelName);
                            xdata = res.data[modelIdens[0]].map((item) => item.time);
                            ydata = modelIdens.map((item) => ({
                                name: this.paramList.find((p) => p.identifier === item).modelName,
                                data: res.data[item].map((v) => v.value),
                            }));
                            this.detail.dataBind.lData = ldata;
                            this.detail.dataBind.xData = xdata;
                            this.detail.dataBind.yData = ydata;
                            this.setChartDatas(ldata, xdata, ydata);
                            this.$nextTick(function () {
                                this.setOption(this.option);
                            });
                        } else {
                            this.$message.warning('暂无数据！');
                        }
                        this.dialogVisible = false;
                    }
                });
            }
        },
        // 设置表格数据
        setChartDatas(ldata, xdata, ydata) {
            this.option.legend.data = ldata;
            this.option.xAxis.data = xdata;
            this.option.series = [];
            ydata.forEach((element) => {
                let data = {};
                if (this.detail.type == 'chart-line') {
                    data = {
                        name: element.name,
                        type: 'line',
                        stack: 'Total',
                        data: element.data,
                        itemStyle: {},
                    };
                } else if (this.detail.type == 'chart-line-step') {
                    data = {
                        name: element.name,
                        type: 'line',
                        stack: 'Total',
                        step: 'start',
                        data: element.data,
                        itemStyle: {},
                    };
                } else {
                    data = {
                        name: element.name,
                        type: 'bar',
                        stack: 'Total', //有代表是一个柱形图堆叠，无这属性柱形分散排列
                        barWidth: 17,
                        data: element.data,
                        itemStyle: {},
                    };
                }
                this.option.series.push(data);
            });
        },
    },
    mounted() {
        this.myChart = this.$echarts.init(document.getElementById(this.detail.identifier));
        const { lData, xData, yData } = this.detail.dataBind;
        if (lData.length !== 0 && xData.length !== 0 && yData.length !== 0) {
            this.setChartDatas(lData, xData, yData);
        }
        this.timer = setInterval(() => {
            this.getChartsData();
        }, 60000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="scss">
.view-chart {
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
