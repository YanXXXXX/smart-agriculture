<template>
  <div class="map_manager">
    <div class="manager_content">
        <div class="map_left">
            <map-area :baseId="baseId" :moveTarget="moveTarget" @refreshList="refresh"></map-area>
        </div>
        <div class="menu_right">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="地块" name="area">
                    <el-input v-model="landName" placeholder="地块名称" prefix-icon="el-icon-search" clearable @input="getLand"></el-input>
                    <el-menu default-active="activeIndex1">
                        <el-menu-item v-for="(item,index) in arealist" :index="String(index+1)" :key="index" class="flex jcsb aic" @click="moveTo(item,1)">
                            <div class="flex aic"><i class="el-icon-menu" style="color: #22BB78;"></i>{{item.landName.length>10?`${item.landName.substring(0,10)}...`:item.landName}}</div>
                            <div class="flex aic" v-if="item.landPath"><i class="el-icon-location" style="color: #22BB78;"></i>已标记</div>
                            <div class="flex aic" v-else style="color: #D9D9D9;"><i class="el-icon-location" style="color: #D9D9D9;"></i>未标记</div>
                        </el-menu-item>
                    </el-menu>
                </el-tab-pane>
                <el-tab-pane label="设备" name="device">
                    <el-input v-model="deviceName" placeholder="搜索设备名称" prefix-icon="el-icon-search" clearable @input="getDevice"></el-input>
                    <el-select v-model="productId" placeholder="选择设备类型" style="width:100%;margin-top:10px" clearable @change="getDevice">
                        <el-option v-for="item in options" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
                    </el-select>
                    <el-menu default-active="activeIndex1">
                        <el-menu-item v-for="(item,index) in deviceList" :index="String(index+1)" :key="index" class="flex jcsb aic" @click="moveTo(item,2)">
                            <div><img class="height-20 width-20 margin-right-6" :src="baseUrl+item.imgUrl.split(',')[1]" alt="">{{item.deviceName.length>10?`${item.deviceName.substring(0,10)}...`:item.deviceName}}</div>
                            <div class="flex aic" v-if="item.latitude"><i class="el-icon-location" style="color: #22BB78;"></i>已标记</div>
                            <div class="flex aic" v-else style="color: #D9D9D9;"><i class="el-icon-location" style="color: #D9D9D9;"></i>未标记</div>
                        </el-menu-item>
                    </el-menu>
                </el-tab-pane>
            </el-tabs>
            <div class="flex jcc">
                <el-pagination
                    small
                    background
                    layout="prev, pager, next"
                    :page-size="queryParams.pageSize"
                    :total="total"
                    @current-change="handlePagination"
                    @prev-click="handlePagination"
                    @next-click="handlePagination"
                >
                </el-pagination>
            </div>
        </div>
    </div>
    <base-select v-model="baseId" :type="2"></base-select>
  </div>
</template>

<script>
import MapArea from "./MapArea.vue"
import {listDevice} from "@/api/iot/device";
import {listProduct} from "@/api/iot/product";
import {listLand} from "@/api/agriculture/land";
export default {
    components:{
        MapArea
    },
    data() {
        return {
            baseUrl:process.env.VUE_APP_BASE_API,
            activeIndex1:null,
            activeName:'area',
            total:0,
            queryParams:{
                pageSize:12,
                pageNum:1
            },
            landName:null,
            productId:null,
            deviceName:null,
            options:[],
            arealist:[],
            deviceList:[],
            moveTarget:null,
            baseId:null
        }
    },
    watch:{
        baseId:{
            handler:function(n){
                if(n){
                    this.getLand()
                    this.getDevice()
                    this.getProduct()
                }
            }
        }
    },
    methods: {
        getLand(){
            listLand({baseId:this.baseId,landName:this.landName,...this.queryParams}).then(res=>{
                this.arealist=res.rows
                this.total=res.total
            })
        },
        getDevice(){
            listDevice({baseId:this.baseId,productId:this.productId,deviceName:this.deviceName,...this.queryParams}).then(res=>{
                this.deviceList=res.rows
                this.total=res.total
            })
        },
        getProduct(){
            listProduct({baseId:this.baseId}).then(res=>{
                this.options=res.rows
            })
        },
        handleClick(e){
            this.queryParams.pageNum=1
            this.activeIndex1=null
            if (e.label=="地块") {
                this.getLand()
            }else if(e.label=="设备"){
                this.getDevice()
            }
        },
        handlePagination(e){
            this.queryParams.pageNum=e;
            if (this.activeName=='area') {
                this.getLand()
            }else{
                this.getDevice()
            }
        },
        moveTo(data,index){
            if (index==1) {
                if (data.landPath) {
                    this.moveTarget=data.landId+"|"+new Date()+"|"+1
                }else{
                    this.$message({
                        message: '该地块还没绘制轮廓!',
                        type: 'warning'
                    });
                }
            }else if(index==2){
                if (data.longitude) {
                    this.moveTarget=data.deviceId+"|"+new Date()+"|"+2
                }else{
                    this.$message({
                        message: '该设备还没标记!',
                        type: 'warning'
                    });
                }
            }

        },
        refresh(){
            this.queryParams.pageNum=1
            this.getLand()
            this.getDevice()
        }
    },
}
</script>

<style lang="scss" scoped>
.map_manager{
    padding: 10px;
    box-sizing: border-box;
    background: #edeef0;
    height: calc(100vh - 84px);
    user-select: none;
    .manager_content{
        height: 100%;
        width: 100%;
        display: flex;
        border-radius: 10px;;
        overflow: hidden;
        .menu_right ::v-deep{
            width: 300px;
            padding: 0 10px;
            box-sizing: border-box;
            background: #fff;
            .el-tabs{
                height: calc(100% - 40px);
                .el-tabs__header{
                    .el-tabs__nav{
                        height: 45px;
                        line-height: 45px;
                    }
                    .el-tabs__nav-wrap::after{
                        height: 1px;
                    }
                }
            }
        }
        .map_left{
            width: calc(100% - 300px);
            overflow: hidden;
        }
    }
    ::v-deep {
        & .el-menu {
            border-right: none;
            width: 100%;
            margin-top: 10px;
        }
        & .el-menu-item {
            height: 50px;
            line-height: 50px;
            padding: 0 10px!important;
            border-bottom: 1px solid rgba(238,238,238,.5);
        }
    }
}
</style>
