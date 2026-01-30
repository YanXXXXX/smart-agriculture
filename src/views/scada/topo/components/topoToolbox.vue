<template>
    <el-menu class="topo-toolbox" unique-opened @open="handleOpen">
        <el-submenu class="sub-menu" index="base">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="base-cmpt" />
                    <span class="name-wrap">基本组件</span>
                </div>
            </template>
            <data-panel class="panel-wrap" ref="dataPanel" :data="jsonBase" />
        </el-submenu>
        <el-submenu class="sub-menu" index="shape">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="line-shape" />
                    <span class="name-wrap">基本形状</span>
                </div>
            </template>
            <data-panel class="panel-wrap" ref="dataPanel" :data="jsonShape" />
        </el-submenu>
        <el-submenu class="sub-menu" index="chart">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="chart" />
                    <span class="name-wrap">统计图形</span>
                </div>
            </template>
            <data-panel class="panel-wrap" ref="dataPanel" :data="jsonChart" />
        </el-submenu>
        <!-- <el-submenu index="Icon图库">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="icon" />
                    <span class="name-wrap">Icon图库</span>
                </div>
            </template>
            <DataPanel ref="dataPanel" :data="jsonIcon" />
        </el-submenu> -->
        <el-submenu class="sub-menu" index="gallery">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="picture" />
                    <span class="name-wrap">图库组件</span>
                </div>
            </template>
            <el-submenu class="sub-menu" v-for="dict in dict.type.scada_gallery_type" :index="dict.value" :key="dict.value">
                <template slot="title">
                    <span :style="{ marginLeft: sidebar.opened ? '0' : '40px' }">{{ dict.label }}</span>
                </template>
                <data-panel v-loading="loading" element-loading-background="transparent" class="panel-wrap" ref="dataPanel" :data="gallerys" />
            </el-submenu>
        </el-submenu>
        <el-submenu class="sub-menu" index="echart">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="redis" />
                    <span class="name-wrap">图表组件</span>
                </div>
            </template>
            <el-submenu class="sub-menu" v-for="dict in dict.type.scada_echart_type" :index="dict.value" :key="dict.value">
                <template slot="title">
                    <span :style="{ marginLeft: sidebar.opened ? '0' : '40px' }">{{ dict.label }}</span>
                </template>
                <data-panel v-loading="loading" element-loading-background="transparent" class="panel-wrap" ref="dataPanel" :data="echarts" />
            </el-submenu>
        </el-submenu>
        <el-submenu class="sub-menu" index="more">
            <template slot="title">
                <div class="sub-menu-title">
                    <svg-icon class="icon-wrap" icon-class="product" />
                    <span class="name-wrap">更多组件</span>
                </div>
            </template>
            <data-panel v-loading="loading" element-loading-background="transparent" class="panel-wrap" ref="dataPanel" :data="components" />
        </el-submenu>
    </el-menu>
</template>
<script>
import { mapState } from 'vuex';

import { listGallery } from '@/api/scada/gallery';
import { listEchart } from '@/api/scada/echart';
import { listComponent } from '@/api/scada/component';

import jsonIcon from './data-toolbox/icon.json';
import DataPanel from './data-panel/index';
import jsonBase from './data-toolbox/base.json';
import jsonShape from './data-toolbox/shape.json';
import jsonChart from './data-toolbox/chart.json';

export default {
    name: 'TopoToolbox',
    dicts: ['scada_gallery_type', 'scada_echart_type'],
    components: {
        DataPanel,
    },
    computed: {
        ...mapState({
            sidebar: (state) => state.app.sidebar,
        }),
    },
    data() {
        return {
            baseApi: process.env.VUE_APP_BASE_API,
            jsonBase: jsonBase, // 基本组件
            jsonShape: jsonShape,
            jsonChart: jsonChart,
            jsonIcon: jsonIcon,
            loading: false,
            gallerys: {}, // 图库数据
            echarts: {}, // 图表数据
            components: {}, // 组件数据
        };
    },
    mounted() {},
    methods: {
        handleOpen(key, keyPath) {
            const type = keyPath[0];
            if (type === 'gallery' && key !== type) {
                this.getGalleryDatas(type, key);
            } else if (type === 'echart' && key !== type) {
                this.getEchartDatas(type, key);
            } else {
                this.getComponent('component');
            }
        },
        // 获取图库数据
        getGalleryDatas(type, name) {
            this.loading = true;
            const params = {
                pageNum: 1,
                pageSize: 10,
                categoryName: name,
                moduleGuid: '云组态',
                orderByColumn: 'id',
                isAsc: 'desc',
            };
            listGallery(params).then((res) => {
                if (res.code === 200) {
                    if (res.rows.length > 0) {
                        let newJson = this.getJson(type);
                        res.rows.forEach((item) => {
                            newJson.title = item.categoryName;
                            let newJsonItem = this.getImgJsonItem();
                            newJsonItem.text = item.fileName;
                            newJsonItem.icon = this.baseApi + item.resourceUrl;
                            newJsonItem.info.style.url = this.baseApi + item.resourceUrl;
                            newJson.items.push(newJsonItem);
                        });
                        this.gallerys = newJson;
                    } else {
                        this.gallerys = {};
                    }
                }
                this.loading = false;
            });
        },
        // 获取图表数据
        getEchartDatas(type, name) {
            this.loading = true;
            const params = {
                pageNum: 1,
                pageSize: 9999,
                echartType: name,
            };
            listEchart(params).then((res) => {
                if (res.code === 200) {
                    if (res.rows.length > 0) {
                        let newJson = this.getJson(type);
                        res.rows.forEach((item) => {
                            newJson.title = item.categoryName;
                            let newJsonItem = this.getEchartJsonItem();
                            newJsonItem.text = item.echartName;
                            newJsonItem.icon = this.baseApi + item.echartImgae;
                            newJsonItem.info.dataBind.echartOption = `echartId-${item.id}`;
                            newJson.items.push(newJsonItem);
                        });
                        this.echarts = newJson;
                    } else {
                        this.echarts = {};
                    }
                }
                this.loading = false;
            });
        },
        // 组件数据
        getComponent(type) {
            this.loading = true;
            const params = {
                pageNum: 1,
                pageSize: 9999,
            };
            listComponent(params).then((res) => {
                if (res.code === 200) {
                    if (res.rows.length > 0) {
                        let newJson = this.getJson(type);
                        res.rows.forEach((item) => {
                            newJson.title = item.categoryName;
                            let newJsonItem = this.getComponentJsonItem();
                            newJsonItem.text = item.componentName;
                            newJsonItem.icon = this.baseApi + item.componentImage;
                            newJsonItem.info.dataBind.componentId = item.id;
                            newJson.items.push(newJsonItem);
                        });
                        this.components = newJson;
                    } else {
                        this.components = {};
                    }
                }
                this.loading = false;
            });
        },
        getJson(type) {
            let newJson = {
                title: '',
                icon: type,
                opened: false,
                items: [],
            };
            return newJson;
        },
        // 生成图片json
        getImgJsonItem() {
            let newJson = {
                text: '',
                icon: 'image',
                type: 'service',
                info: {
                    type: 'image',
                    componentShow: ['动画', '单击', '组件颜色', '滤镜渲染', '组件填充', '参数绑定'],
                    action: [],
                    hdClassName: '',
                    dataBind: {
                        action: '',
                        productId: '',
                        serialNumber: '',
                        identifier: '',
                        modelName: '',
                        modelValue: '',
                        redirectUrl: '',
                        stateList: [],
                    },
                    dataAction: {
                        serialNumber: '',
                        identifier: '',
                        modelName: '',
                        paramJudge: '',
                        paramJudgeData: '',
                        rotationSpeed: '中',
                        translateList: [],
                    },
                    style: {
                        position: {
                            x: 200,
                            y: 200,
                            w: 100,
                            h: 100,
                        },
                        backColor: 'rgba(255, 255, 255, 0)',
                        foreColor: '',
                        zIndex: 1,
                        transform: 0,
                        url: '',
                        transformType: 'rotate(0deg)',
                        isFilter: true,
                    },
                },
            };
            return newJson;
        },
        // 生成图表json
        getEchartJsonItem() {
            let newJson = {
                text: '',
                icon: 'custom',
                type: 'service',
                info: {
                    type: 'chart-wrapper',
                    componentShow: ['自定义echarts'],
                    action: [],
                    dataBind: {
                        echartOption: '',
                        echartRun: 0,
                        echartSecond: 60,
                        echartData: '',
                        httpSetting:{
                            url:'',
                            method:'get',
                            unit:'s',
                            type:'Params',
                            params:{},
                            bodyType:'1',
                            body:{},
                            headers:{}
                        }
                    },
                    style: {
                        position: {
                            x: 0,
                            y: 0,
                            w: 350,
                            h: 250,
                        },
                        backColor: 'rgba(255, 255, 255, 1)',
                        foreColor: '#000',
                        zIndex: 1,
                        transform: 0,
                        transformType: 'rotate(0deg)',
                    },
                },
            };
            return newJson;
        },
        // 生成组件json
        getComponentJsonItem() {
            let newJson = {
                text: '',
                icon: 'custom',
                type: 'service',
                info: {
                    type: 'component',
                    componentShow: ['动画'],
                    action: [],
                    dataBind: {},
                    dataAction: {
                        xyAction: false,
                        xzAction: false,
                        ssAction: false,
                        hdAction: false,
                        serialNumber: '',
                        identifier: '',
                        modelName: '',
                        paramJudge: '',
                        paramJudgeData: '',
                        rotationSpeed: '中',
                        translateList: [],
                    },
                    style: {
                        position: {
                            x: 0,
                            y: 0,
                            w: 350,
                            h: 250,
                        },
                        backColor: 'rgba(255, 255, 255, 1)',
                        foreColor: '#000',
                        zIndex: 1,
                        transform: 0,
                        transformType: 'rotate(0deg)',
                    },
                },
            };
            return newJson;
        },
        onDragstart(event, info) {
            var infoJson = JSON.stringify(info.info);
            event.dataTransfer.setData('my-info', infoJson);
        },
    },
};
</script>

<style lang="scss" scoped>
.topo-toolbox {
    background-color: #f1f3f4;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .sub-menu {
        background-color: #f1f3f4;

        .sub-menu-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;

            .icon-wrap {
                width: 16px;
                height: 16px;
            }

            .name-wrap {
                margin-left: 8px;
            }
        }

        .panel-wrap {
            padding: 5px;
        }
    }
}
</style>
