<template>
   <div class="productPrices">
        <div class="box">
            <div class="label">
                <div>品种名称</div>
                <div>单位</div>
                <div>昨日</div>
                <div>今日</div>
                <div>涨跌</div>
            </div>
            <vue-seamless-scroll :data="scrollList" class="list" :class-option="defaultOption(scrollList)">
                <ul class="case-info">
                    <li v-for="(item, index) in scrollList" :key="index">
                        <div>{{item.type}}</div>
                        <div>{{item.unit}}</div>
                        <div>{{item.old}}元</div>
                        <div>{{item.new}}元</div>
                        <div>{{((item.new-item.old)/item.new).toFixed(2)}}% <i class="el-icon-bottom"></i></div>
                    </li>
                </ul>
            </vue-seamless-scroll>
        </div>
    </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
    components:{
        vueSeamlessScroll
    },
    data(){
        return {
            scrollList:[
                {
                    type:"西瓜",
                    unit:'KG',
                    old:2,
                    new:3,
                },{
                    type:"草莓",
                    unit:'KG',
                    old:2,
                    new:3,
                },
                {
                    type:"番茄",
                    unit:'KG',
                    old:2,
                    new:3,
                },
                {
                    type:"水蜜桃",
                    unit:'KG',
                    old:2,
                    new:3,
                },
                {
                    type:"哈密瓜",
                    unit:'KG',
                    old:2,
                    new:3,
                },
                {
                    type:"蓝莓",
                    unit:'KG',
                    old:2,
                    new:3,
                },
                {
                    type:"橘子",
                    unit:'KG',
                    old:2,
                    new:3,
                }
            ],
        }
    },
    computed: {
        defaultOption() {
            return (data) => {
                return {
                    step: 0.4, // 数值越大速度滚动越快
                    limitMoveNum: this.scrollList.length, // 开始无缝滚动的数据量 this.dataList.length
                    hoverStop: true, // 是否开启鼠标悬停stop
                    direction: 1, // 0向下 1向上 2向左 3向右
                    openWatch: true, // 开启数据实时监控刷新dom
                    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                    waitTime: 0 // 单步运动停止的时间(默认值1000ms)
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.productPrices{
    height: 100%;
    .box{
        height:100%;
        .label{
            display: flex;
            background: #203c4999;
            color: #c5d0d4;
            height: 30px;
            line-height: 30px;
            border-radius: 4px;
            padding-left:20px;
            box-sizing: border-box;
            div{
                flex: 1;
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &:nth-of-type(1){
                    flex: 1.5;
                }
            }
        }
        .list{
            height: calc(100% - 30px);
            overflow: hidden;
            .case-info{
                color: #fff;
                padding: 0;
                margin: 0;
                padding-left:20px;
                box-sizing: border-box;
                li{
                    display: flex;
                    height: 30px;
                    line-height: 30px;
                    div{
                        flex: 1;
                        overflow:hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 13px;
                        &:nth-of-type(1){
                            flex: 1.5;
                        }
                        &:nth-of-type(3){
                            color: #099aff;
                        }
                        &:nth-of-type(4){
                            color: #099aff;
                        }
                        &:nth-of-type(5){
                            color: #2effb7;
                            .el-icon-bottom{
                                color: #2effb7;
                                font-weight: 900;
                            }
                        }
                        
                    }
                }
            }
        }
    }
}
</style>