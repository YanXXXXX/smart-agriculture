<template>
    <div class="decoration-edit">
        <div class="l">
            <ul
                @dragstart="dragStart"
                @dragend="dragEnd"
            >
                <li
                    v-for="(val, key, index) in typeList"
                    draggable
                    :data-type="key"
                    :key="index + 1"
                >
                    <span :class="val.icon"></span>
                    <p>{{val.name}}</p>
                </li>
            </ul>
        </div>
        <div class="c">
            <!-- header 不可拖拽 -->
            <div class="top-nav" @click="selectType(0)">
                <img src="@/assets/images/topNavBlack.png">
                <span class="tit">{{ info.title||'请设置页面标题' }}</span>
            </div>
            <div class="img-banner">
            </div>
            <!-- 组建编辑区域 -->
            <div
                class="view-content"
                @drop="drog"
                @dragover="dragOver"
                :style="{ backgroundColor: info.backgroundColor }"
            >
                <Draggable
                    v-model="view"
                    draggable=".item"
                >
                    <template v-for="(item, index) in view">
                        <div
                            v-if="index > 0"
                            :data-index="index"
                            :key="index"
                            class="item"
                            @click="selectType(index)"
                        >
                            <!-- waiting -->
                            <template v-if="item.status && item.status == 2">
                                <div class="wait"> 放置在此位置 </div>
                            </template>
                            <template v-else>
                                <component
                                    :is="typeList[item.type]['com']"
                                    :data="item"
                                    :className="className[item.tabType]"
                                ></component>
                            </template>
                            <i @click="deleteItem($event, index)" class="el-icon-error"></i>
                        </div>
                    </template>
                </Draggable>
            </div>
        </div>
        <div class="r">
            <EditForm
                :data="props"
                v-if="isRight"
            ></EditForm>
        </div>

        <div class="submit-btn">
            <el-button-group>
                <el-button type="primary" @click="submit" icon="el-icon-success">保存</el-button>
                <el-button type="warning" @click="perView" icon="el-icon-view">预览</el-button>
                <el-button type="primary" @click="goBack" plain icon="el-icon-arrow-left">返回</el-button>
            </el-button-group>
        </div>
        <!-- 预览弹窗 -->
        <el-dialog
            title="页面预览"
            width="200px"
            :visible.sync="isShow"
            @close="isShow=false">
            <div class="w100 flex aic jcc">
                <qrcode-vue :size="100" :value="`${previewUrl}?templateId=${templateId}`"></qrcode-vue>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import Draggable from 'vuedraggable'
// import { imageUpload } from '@/api/commodity'
import {getTraceTemplate, updateTraceTemplate } from "@/api/trace/traceTemplate";
import EditForm from '@/views/trace/components/EditPage/Edit/index'
import Product from '@/views/trace/components/EditPage/View/Product'
import Images from '@/views/trace/components/EditPage/View/Images'
import Banner from '@/views/trace/components/EditPage/View/Banner'
import ProductInfo from '@/views/trace/components/EditPage/View/ProductInfo';
import PlantProgress from '@/views/trace/components/EditPage/View/PlantProgress'

import TraceTime from '@/views/trace/components/EditPage/View/TraceTime'
import Quality from '@/views/trace/components/EditPage/View/Quality'
import Map from '@/views/trace/components/EditPage/View/Map'
import PlantEnv from '@/views/trace/components/EditPage/View/PlantEnv'
import Staff from '@/views/trace/components/EditPage/View/Staff'
import Shop from '@/views/trace/components/EditPage/View/Shop'
import Brand from '@/views/trace/components/EditPage/View/Brand'

import QrcodeVue from 'qrcode.vue'

export default {
    components: {
        EditForm,
        Draggable,
        Product,
        Images,
        Banner,
        ProductInfo,
        TraceTime,
        Quality,
        Map,
        PlantEnv,
        Staff,
        Shop,
        Brand,
        QrcodeVue
    },
    data() {
        return {
            templateId:null,
            typeList: {
                productInfo:{
                    name:'产品信息',
                    icon:'el-icon-goods',
                    com:ProductInfo
                },
                plantProgress:{
                    name:'生长过程',
                    icon:'el-icon-date',
                    com:PlantProgress
                },
                traceTime:{
                    name:'溯源次数',
                    icon:'el-icon-link',
                    com:TraceTime
                },
                quality:{
                    name:'质检报告',
                    icon:'el-icon-document',
                    com:Quality
                },
                map:{
                    name:'产地地图',
                    icon:'el-icon-map-location',
                    com:Map
                },
                plantEnv:{
                    name:'生长环境',
                    icon:'el-icon-sunny',
                    com:PlantEnv
                },
                staff:{
                    name:'业务人员',
                    icon:'el-icon-user',
                    com:Staff
                },
                shop:{
                    name:'店铺信息',
                    icon:'el-icon-school',
                    com:Shop
                },
                brand:{
                    name:'品牌信息',
                    icon:'el-icon-star-off',
                    com:Brand
                },

            },
            view: [
                {
                    type: 'info',
                    title: '页面标题'
                }
            ],
            title: '页面标题',
            type: '',
            index: null,        // 当前组件的索引
            isPush: false,      // 是否已添加组件

            props: {},          // 传值
            isRight: false,

            className: {
                1: 'one',
                2: 'two',
                3: 'three'
            },
            //弹窗显示
            isShow:false,
            //预览地址
            previewUrl: window.location.protocol+'//'+window.location.host+'/preview'
        }
    },
    computed: {
        info() {
            return this.view[0]
        }
    },
    // watch:{
    //     view:{
    //         handler:function(n){
    //             console.log()
    //         }
    //     }
    // },
    async created(){
        this.templateId = this.$route.query.templateId;
        if(this.templateId){
           const {data}= await getTraceTemplate(this.templateId);
           if(data.templateJson){
               this.view = JSON.parse(data.templateJson);
           }else{
               this.view=[{backgroundColor:'',title:'',type:'info'}];
           }
        }

    },
    methods: {
        //返回
        goBack(){
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1);
        },
        //保存
        async submit() {
            // JSON 转换会丢失 formData
            const form = JSON.parse(JSON.stringify(this.view))
            console.log(form)

            if (form.length == 1) {
                this.$message.error('请添加模块！')
                return false;
            }

            for (let i of form) {
                if (i.data && i.data.length == 0) {
                    this.$message.error('请填写完整信息！')
                    return false;
                }
                if (i.type === 'product') {
                    i.data = i.data.map(val => val.productId).join(',')
                }
            }
            await updateTraceTemplate({templateId:this.templateId,templateJson:JSON.stringify(form)});
            this.$modal.msgSuccess("提交成功");
            return true;
        },
        //预览
        async perView(){
            const res = await this.submit();
            if(res){
                this.isShow = true;
            }
        },
        // 切换视图组件
        selectType(index) {
            this.isRight = false
            this.props = this.view[index]
            this.$nextTick(() => this.isRight = true)
        },
        deleteItem(e, index) {
            e.preventDefault()
            e.stopPropagation()
            this.view.splice(index, 1)
            this.isRight = false
            this.props = {}
        },
        // 拖拽类型
        dragStart(e) {
            this.type = e.target.dataset.type
        },
        // 结束拖拽
        dragEnd(e) {
            this.$delete(this.view[this.index], 'status')
            this.isPush = false
            this.type = null
        },
        // 已放置到指定位置
        drog(e) {
            if (!this.type) { // 内容拖拽
                return
            }
            e.preventDefault()
            e.stopPropagation()
            this.dragEnd()
        },
        // 移动中
        dragOver(e) {
            if (!this.type) { // 内容拖拽
                return
            }
            e.preventDefault()
            e.stopPropagation()

            let className = e.target.className
            let name = className !== 'view-content' ? 'item' : 'view-content'

            const defaultData = {
                type: this.type,    // 组件类型
                status: 2,          // 默认状态
                data: [],           // 数据
                options: {}         // 选项操作
            }

            if (name == 'view-content') {
                if (!this.isPush) {
                    this.index = this.view.length
                    this.isPush = true
                    this.view.push(defaultData)
                }
            } else if (name == 'item') {

                let target = e.target
                let [ y, h, curIndex ] = [ e.offsetY, target.offsetHeight, target.dataset.index ]
                let direction = y < (h / 2)

                if (!this.isPush) {
                    // Push to Top or Bottom
                    if (direction) {
                        if (curIndex == 0) {
                            this.view.unshift(defaultData)
                        } else {
                            this.view.splice(curIndex, 0, defaultData)
                        }
                    } else {
                        curIndex = +curIndex + 1
                        this.view.splice(curIndex, 0, defaultData)
                    }
                } else {
                    // Moving
                    if (direction) {
                        var i = curIndex == 0 ? 0 : curIndex - 1
                        var result = this.view[i]['status'] == 2
                    } else {
                        var i = +curIndex + 1
                        var result = this.view.length > i && this.view[i]['status'] == 2
                    }

                    if (result) return

                    const temp = this.view.splice(this.index, 1)
                    this.view.splice(curIndex, 0, temp[0])
                }
                this.index = curIndex
                this.isPush = true
            }
        }
    }
}
</script>
<style lang="scss">
.decoration-edit{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    height: calc(100vh - 84px);
    position: relative;
    background: #f1f1f1;
    .l {
        width: 330px;
        height: 100%;
        padding: 15px 0;
        background: #fff;
    }
    .r {
        width: 340px;
        height: 100%;
        padding: 15px 0;
        background: #fff;
    }
    .l{
        ul{
            margin: 0 auto;
            padding: 0;
            li{
                width: 80px;
                height: 80px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                cursor: default;
                list-style: none;
                font-size: 14px;
                color: #666;
                float: left;
                margin: 0 15px;
                border-radius: 6px;
                transition: all .3s;
                cursor: pointer;
                &:hover{
                    background: #efefef;
                }
                span{
                    display: block;
                    font-size: 30px;
                    margin-bottom: 8px;
                    color: #999;
                }
                p{
                    display: block;
                    margin: 0;
                    font-size: 12px;
                }
            }
        }
    }
    .c{
        width: auto;
        max-width: 400px;
        position: relative;
        background-color: #f0f2f5;
        box-shadow: 0 0 10px #7a7a7a80;
        .top-nav{
            // position: relative;
            // top: 0;
            background: #fff;
            // z-index: 999;
            transition: all .3s;
            & * {
                pointer-events: none;
            }
            &:hover{
                transform: scale(0.95);
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 10px #afafaf;
            }
            .tit{
                // position: absolute;
                // left: 50%;
                // bottom: 10px;
                // transform: translateX(-50%);
                display: flex;
                justify-content: center;
                align-content: center;
                padding:10px 0;
            }
            img{
                max-width: 100%;
                image-rendering: -moz-crisp-edges;
                image-rendering: -o-crisp-edges;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
                -ms-interpolation-mode: nearest-neighbor;
            }
        }
        .img-banner{
            height:200px;
            width: 97%;
            margin:0 auto;
            background-image:url(~@/assets/images/trace/banner.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
        }
        .view-content{
            width: 400px;
            height: 500px;
            background: #f5f5f5;
            overflow-y: auto;
            overflow-x: hidden;
            // box-shadow: 0 2px 6px #ccc;
            &::-webkit-scrollbar{
                width: 6px;
            }
            &::-webkit-scrollbar-thumb{
                background: #dbdbdb;
            }
            &::-webkit-scrollbar-track{
                background: #f6f6f6;
            }

            .item{
                transition: all .3s;
                background: #f0f2f5;
                padding:0 10px;
                &:hover{
                    transform: scale(0.95);
                    border-radius: 10px;
                    box-shadow: 0 0 10px #afafaf;
                    .el-icon-error{
                        display: block;
                    }
                }
                div{
                    pointer-events: none;
                }
                .wait{
                    background: #deedff;
                    height: 35px;
                    text-align: center;
                    line-height: 35px;
                    font-size: 12px;
                    color: #666;
                }
                .el-icon-error{
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    color: red;
                    font-size: 25px;
                    cursor: pointer;
                    display: none;
                    z-index: 9999;
                }
            }
        }
    }
    .submit-btn{
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
