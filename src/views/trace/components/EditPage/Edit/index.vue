<template>
    <section style="overflow:auto">
        <div class="tab-content" >
            <h2>{{ type && list[type]['tit'] }}</h2>
            <div class="tab" v-if="['images','product'].includes(type)">
                <span
                    v-for="(val, key, index) in tabType"
                    :key="index"
                    @click="tab(key)"
                    :class="{active: val}"
                ><i class="el-icon-s-data"></i> {{ key }}</span>
            </div>
        </div>
        <component
            :is="type && list[type]['com']"
            :data="data"
            @changeTab="tab"
        ></component>
    </section>
</template>

<script>
import Info from "./Info"
import Images from "./Image"
import Product from "./Product"
import ProductInfo from "./ProductInfo"
import PlantProgress from "./PlantProgress/PlantProgress"
import TraceTime from "./TraceTime"
import Quality from "./Quality"
import Map from "./Map"
import PlantEnv from "./PlantEnv"
import Staff from "./Staff"
import Shop from "./Shop"
import Brand from "./Brand"
export default {
    name: 'EditForm',
    components: {
        Info,
        Images,
        Product,
        ProductInfo,
        PlantProgress,
        TraceTime,
        Quality,
        Map,
        PlantEnv,
        Staff,
        Shop,
        Brand
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            type: '',
            list: {
                'info': {
                    tit: '页面信息',
                    com: 'Info'
                },
                'images': {
                    tit: '图片',
                    com: 'Images'
                },
                'banner': {
                    tit: '轮播图',
                    com: 'Images'
                },
                'product': {
                    tit: '商品',
                    com: 'Product'
                },
                'productInfo':{
                    tit:'商品信息',
                    com:'ProductInfo'
                },
                'plantProgress':{
                    tit:'生长过程',
                    com:'PlantProgress'
                },
                'traceTime':{
                    tit:'溯源次数',
                    com:'TraceTime'
                },
                'quality':{
                    tit:'质检报告',
                    com:'Quality'
                },
                'map':{
                    tit:'产地地图',
                    com:'Map'
                },
                'plantEnv':{
                    tit:'生长环境',
                    com:'PlantEnv'
                },
                'staff':{
                    tit:'业务人员',
                    com:'Staff'
                },
                'shop':{
                    tit:'店铺信息',
                    com:'Shop'
                },
                'brand':{
                    tit:'品牌信息',
                    com:'Brand'
                },
            },
            tabType: {
                1: true,
                2: false,
                3: false
            }
        }
    },
    mounted() {
        this.type = this.data.type
        if (this.data.tabType) {
            this.tab(this.data.tabType)
        }
    },
    methods: {
        tab(key) {
            for (let i in this.tabType) {
                if (key == i) {
                    this.tabType[key] = true
                    this.$set(this.data, 'tabType', key)
                } else {
                    this.tabType[i] = false
                }
            }
        },
    }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/element-variables.scss';
section{
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
}
.tab-content{
    padding: 0 15px;
    h2{
        font-size: 16px;
        color: #333;
    }
    .tab{
        display: flex;
        justify-content: space-around;
        border: 1px solid #ddd;
        border-radius: 6px;
        span{
            width: 33.33%;
            text-align: center;
            font-size: 14px;
            color: #666;
            display: block;
            height: 36px;
            line-height: 36px;
            cursor: pointer;
            &.active{
                color: #fff;
                background: $--color-primary;
                border-radius: 2px;
            }
            &:nth-of-type(2) {
                border-left: 1px solid #ddd;
                border-right: 1px solid #ddd;
            }
        }
    }
}
</style>
