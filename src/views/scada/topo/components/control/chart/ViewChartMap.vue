<template>
    <div ref="xwin" style="height: 100%; width: 100%"></div>
</template>

<script>
import henanJson from '@/assets/echarts-map-json/province/henan.json'; //湖南
import hunanJson from '@/assets/echarts-map-json/province/hunan.json'; //河南
import anhuiJson from '@/assets/echarts-map-json/province/anhui.json'; //安徽
import aomenJson from '@/assets/echarts-map-json/province/aomen.json'; //澳门
import beijingJson from '@/assets/echarts-map-json/province/beijing.json'; //北京
import chongqingJson from '@/assets/echarts-map-json/province/chongqing.json'; //重庆
import fujianJson from '@/assets/echarts-map-json/province/fujian.json'; //福建
import gansuJson from '@/assets/echarts-map-json/province/gansu.json'; //甘肃
import guangdongJson from '@/assets/echarts-map-json/province/guangdong.json'; //广州
import guangxiJson from '@/assets/echarts-map-json/province/guangxi.json'; //广西
import guizhouJson from '@/assets/echarts-map-json/province/guizhou.json'; //贵州
import hainanJson from '@/assets/echarts-map-json/province/hainan.json'; //海南
import hebeiJson from '@/assets/echarts-map-json/province/hebei.json'; //河北
import heilongjiangJson from '@/assets/echarts-map-json/province/heilongjiang.json'; //黑龙江
import hubeiJson from '@/assets/echarts-map-json/province/hubei.json'; //湖北

import jiangsuJson from '@/assets/echarts-map-json/province/jiangsu.json'; //江苏
import jiangxiJson from '@/assets/echarts-map-json/province/jiangxi.json'; //江西
import jilinJson from '@/assets/echarts-map-json/province/jilin.json'; //吉林
import liaoningJson from '@/assets/echarts-map-json/province/liaoning.json'; //辽宁
import neimengguJson from '@/assets/echarts-map-json/province/neimenggu.json'; //内蒙古

import ningxiaJson from '@/assets/echarts-map-json/province/ningxia.json'; //宁夏
import qinghaiJson from '@/assets/echarts-map-json/province/qinghai.json'; //青海
import shandongJson from '@/assets/echarts-map-json/province/shandong.json'; //山东
import shanghaiJson from '@/assets/echarts-map-json/province/shanghai.json'; //上海
import shanxiJson from '@/assets/echarts-map-json/province/shanxi1.json'; //山西
import sichuanJson from '@/assets/echarts-map-json/province/sichuan.json'; //四川
import taiwanJson from '@/assets/echarts-map-json/province/taiwan.json'; //台湾
import tianjinJson from '@/assets/echarts-map-json/province/tianjin.json'; //天津
import xianggangJson from '@/assets/echarts-map-json/province/xianggang.json'; //香港
import xinjiangJson from '@/assets/echarts-map-json/province/xinjiang.json'; //新疆
import xizangJson from '@/assets/echarts-map-json/province/xizang.json'; //西藏
import yunnanJson from '@/assets/echarts-map-json/province/yunnan.json'; //云南
import zhejiangJson from '@/assets/echarts-map-json/province/zhejiang.json'; //浙江
import chartOption from '@/assets/topo-data/chart-option.js';
import BaseView from '../View.vue';

export default {
    name: 'ChartMapView',
    extends: BaseView,
    data() {
        return {
            echart: null,
            mapJsons: {},
            timer: null,
        };
    },
    computed: {
        echartRun() {
            this.$nextTick(function () {
                if (this.detail.dataBind.echartOption && this.detail.dataBind.echartRun > new Date().getTime() - 10000) {
                    try {
                        let flag = false;
                        if (this.detail.dataBind.mapAddress == '自定义') {
                            flag = this.getMapJson(this.detail.dataBind.mapUrl);
                        } else {
                            flag = this.initEcharts();
                        }
                        flag && this.$message({ message: '运行成功', type: 'success' });
                    } catch (error) {
                        console.log(error);
                        this.$message({
                            message: '图表初始化失败，请检查代码视图！',
                            type: 'warning',
                        });
                    }
                }
            });
            return this.detail.dataBind.echartOption + this.detail.dataBind.echartRun;
        },
        mapChange() {
            this.$nextTick(function () {
                try {
                    if (this.detail.dataBind.mapAddress == '自定义' && this.detail.dataBind.mapUrl) {
                        this.getMapJson(this.detail.dataBind.mapUrl);
                    } else {
                        this.initEcharts();
                    }
                } catch (error) {
                    console.log(error);
                    this.$message({
                        message: '图表初始化失败，请检查代码视图！',
                        type: 'warning',
                    });
                }
            });
            return this.detail.dataBind.mapAddress;
        },
    },
    watch: {
        echartRun(newColor, oldColor) {
            // console.log('',newColor);
        },
        mapChange() {},
    },
    mounted() {
        if (this.editMode && this.detail.dataBind.echartUrl) {
            let echartSecond = this.detail.dataBind.echartSecond;
            if (!echartSecond) {
                echartSecond = 60 * 1000;
            } else {
                echartSecond = echartSecond * 1000;
            }
            this.getEchartData(this.detail.dataBind.echartUrl);
            this.timer = setInterval(() => {
                this.getEchartData(this.detail.dataBind.echartUrl);
            }, echartSecond);
        } else {
            if (this.detail.dataBind.mapAddress == '自定义') {
                this.getMapJson(this.detail.dataBind.mapUrl);
            } else {
                this.initEcharts();
            }
        }
    },
    methods: {
        loadData(option, mapJson) {
            if (this.echart) {
                this.echart.dispose();
            }
            switch (this.detail.dataBind.mapAddress) {
                case '安徽':
                    mapJson = anhuiJson;
                    break;
                case '澳门':
                    mapJson = aomenJson;
                    break;
                case '北京':
                    mapJson = beijingJson;
                    break;
                case '重庆':
                    mapJson = chongqingJson;
                    break;
                case '福建':
                    mapJson = fujianJson;
                    break;
                case '甘肃':
                    mapJson = gansuJson;
                    break;
                case '广东':
                    mapJson = guangdongJson;
                    break;
                case '广西':
                    mapJson = guangxiJson;
                    break;
                case '贵州':
                    mapJson = guizhouJson;
                    break;
                case '海南':
                    mapJson = hainanJson;
                    break;
                case '河北':
                    mapJson = hebeiJson;
                    break;
                case '黑龙江':
                    mapJson = heilongjiangJson;
                    break;
                case '河南':
                    mapJson = henanJson;
                    break;
                case '湖北':
                    mapJson = hubeiJson;
                    break;
                case '湖南':
                    mapJson = hunanJson;
                    break;
                case '江苏':
                    mapJson = jiangsuJson;
                    break;
                case '江西':
                    mapJson = jiangxiJson;
                    break;
                case '吉林':
                    mapJson = jilinJson;
                    break;
                case '辽宁':
                    mapJson = liaoningJson;
                    break;
                case '内蒙古':
                    mapJson = neimengguJson;
                    break;
                case '宁夏':
                    mapJson = ningxiaJson;
                    break;
                case '青海':
                    mapJson = qinghaiJson;
                    break;
                case '山东':
                    mapJson = shandongJson;
                    break;
                case '上海':
                    mapJson = shanghaiJson;
                    break;
                case '山西':
                    mapJson = shanxiJson;
                    break;
                case '四川':
                    mapJson = sichuanJson;
                    break;
                case '台湾':
                    mapJson = taiwanJson;
                    break;
                case '天津':
                    mapJson = tianjinJson;
                    break;
                case '香港':
                    mapJson = xianggangJson;
                    break;
                case '新疆':
                    mapJson = xinjiangJson;
                    break;
                case '西藏':
                    mapJson = xizangJson;
                    break;
                case '云南':
                    mapJson = yunnanJson;
                    break;
                case '浙江':
                    mapJson = zhejiangJson;
                    break;
                case '自定义':
                    mapJson = this.mapJsons;
                    break;
                default:
                    mapJson = henanJson;
                    break;
            }
            this.$echarts.registerMap('mapJson', mapJson);
            let view = this.$refs.xwin;
            this.echart = this.$echarts.init(view);
            this.echart.setOption(option);
        },
        onResize() {
            if (this.echart) {
                this.echart.resize();
            }
        },
        // https://www.isqqw.com/asset/get/areas_v3/country/china.json
        getMapJson(mapUrl) {
            this.$axios
                .get(mapUrl)
                .then((res) => {
                    this.mapJsons = res.data;
                    return this.initEcharts();
                })
                .catch((err) => {
                    this.$message({
                        message: '请输入正确的url!',
                        type: 'warning',
                    });
                });
        },
        initEcharts() {
            if (!this.detail.dataBind.echartOption) {
                this.detail.dataBind.echartOption = chartOption.getOptionMap();
            }
            let funStr = chartOption.getFun(this.detail.dataBind.echartOption);
            let fun = eval('(' + funStr + ')');
            let echartData = {};
            if (this.detail.dataBind.echartData) {
                try {
                    echartData = JSON.parse(this.detail.dataBind.echartData);
                } catch (error) {
                    this.$message({ message: '请输入正确的json数据', type: 'warning' });
                    return;
                }
            }
            let option = fun(this.echarts, echartData);
            this.loadData(option, this.mapJsons);
            this.onResize();
            return true;
        },
        getEchartData(dataUrl) {
            this.$axios({
                url: dataUrl,
                method: 'get',
            }).then((res) => {
                this.detail.dataBind.echartData = JSON.stringify(res.data);
                if (this.detail.dataBind.mapAddress == '自定义') {
                    this.getMapJson(this.detail.dataBind.mapUrl);
                } else {
                    this.initEcharts();
                }
            });
        },
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>
