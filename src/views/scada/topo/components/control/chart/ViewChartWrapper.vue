<template>
    <div class="view-chart-wrapper" ref="xwin">
    </div>
</template>

<script>
import BaseView from '../View.vue';
import chartOption from '@/assets/topo-data/chart-option.js';
import { getEchart } from '@/api/scada/echart';

export default {
    name: 'ChartWrapper',
    extends: BaseView,
    data() {
        return {
            echart: null,
            timer: null,
        };
    },
    computed: {
        echartRun() {
            this.$nextTick(function () {
                if (this.detail.dataBind.echartOption && this.detail.dataBind.echartRun > new Date().getTime() - 10000) {
                    let funStr ='function (echarts,myChart,echartData) {\n' + this.detail.dataBind.echartOption + '\n' + ' return option   \n' + '}';
                    try {
                        let fun = eval('(' + funStr + ')');
                        let echartData = {};
                        if (this.detail.dataBind.echartData) {
                            try {
                                echartData = JSON.parse(this.detail.dataBind.echartData);
                            } catch (error) {
                                this.$message({
                                    message: '请输入正确的json数据',
                                    type: 'warning',
                                });
                            }
                        }
                       if (this.echart) {
                            this.echart.dispose();
                        }
                        let view = this.$refs.xwin;
                        this.echart = this.$echarts.init(view);
                        let option = fun(this.$echarts,this.echart, echartData);
                        if(!this.detail.dataBind.echartOption.includes("myChart")) {
                            this.echart.setOption(option);
                            this.onResize();
                        }
                        this.$message({ message: '运行成功', type: 'success' });
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
    },
    watch: {
        echartRun(newColor, oldColor) {
            // console.log('',newColor);
        },
    },
    mounted() {
        if (!this.editMode && this.detail.dataBind.httpSetting.url) {
            let echartSecond = this.detail.dataBind.echartSecond;
            if (!echartSecond) {
                echartSecond = 60 * 1000;
            } else {
                echartSecond = echartSecond * 1000;
            }
            this.getEchartData();
            this.timer = setInterval(() => {
                this.getEchartData();
            }, echartSecond);
        } else {
            this.initEchart();
        }
    },
    methods: {
        onResize(size) {
            if (this.echart) {
                this.echart.resize();
            }
        },
        async initEchart() {
            if (this.detail.dataBind.echartOption.indexOf('echartId-') > -1) {
                let id = this.detail.dataBind.echartOption.split('-')[1];
                const {code,data} = await getEchart(id)
                if (code === 200) {
                    this.detail.dataBind.echartOption=data.echartData
                }
            }
            let funStr ='function (echarts,myChart,echartData) {\n' + this.detail.dataBind.echartOption + '\n' + ' return option   \n' + '}';
            let fun = eval('(' + funStr + ')');
            let echartData = {};
            if (this.detail.dataBind.echartData) {
                echartData = JSON.parse(this.detail.dataBind.echartData);
            }
            if (this.echart) {
                this.echart.dispose();
            }
            let view = this.$refs.xwin;
            this.echart = this.$echarts.init(view);
            let option = fun(this.$echarts,this.echart, echartData);
            if(!this.detail.dataBind.echartOption.includes("myChart")) {
                this.echart.setOption(option);
                this.onResize();
            }
        },
        getEchartData() {
            this.$axios({
                url: this.detail.dataBind.httpSetting.url,
                method: this.detail.dataBind.httpSetting.method,
                params:this.detail.dataBind.httpSetting.params,
                data:this.detail.dataBind.httpSetting.body,
                headers:this.detail.dataBind.httpSetting.headers
            }).then((res) => {
                this.detail.dataBind.echartData = JSON.stringify(res.data);
                this.initEchart();
            });
        },
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="scss">
.view-chart-wrapper {
    height: 100%;
    width: 100%;
    padding: 10px;
}
</style>
