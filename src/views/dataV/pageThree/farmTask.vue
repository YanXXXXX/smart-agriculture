<template>
    <div style="height:100%">
        <div class="farmTask">
            <div class="echarts">
                <div class="pie" id="taskInfo"></div>
                <div class="detail">
                    <div class="info">农事任务详情：<span @click="showDetail">点击查看明细></span></div>
                    <div class="progress"><div>农事任务进度：</div>
                    <el-progress  style="width:65%" :percentage="percentage"></el-progress></div>
                </div>
            </div>
            <div class="info">
                <div class="item" v-for="item in taskTotal" :key="item.id">
                    <div class="num">{{item.value}}</div>
                    <div class="label">{{item.name}}任务(项)</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { selectTaskInfo } from "@/api/agriculture/dataStatistics"
import { pie,autoHover } from "../echartsOption"
export default {
    data(){
        return {
            percentage:0,
            taskTotal:[]
        }
    },
    props:{
        baseId:Number
    },
    watch:{
        baseId:{
            handler:async function(n){
                if(n){
                    const {rows} = await selectTaskInfo(this.baseId);
                    this.taskTotal=rows;
                    //已分配 已完成 未分配 进行中
                    await this.$nextTick();
                    //完成率统计
                    let total = rows.reduce((sum,item)=>sum+item.value,0);
                    this.percentage = total==0?0:Number(((rows[1].value/total)*100).toFixed(1))
                    //饼图赋值
                    let option ={
                        color:this.$colorList,
                        series: [
                            {
                                type: "pie",
                                radius: ["75%", "90%"],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    borderRadius: 2,
                                },
                                label: {
                                    show: false,
                                    position: "center",
                                    color:"#fff",
                                    textBorderColor:'transparent'
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        fontSize: 14,
                                        formatter: `{b}\n{d}%`
                                    },
                                },
                                labelLine: {
                                    show: false,
                                },
                                data: rows,
                            },
                        ],
                    }
                    let myChart = this.$echarts.init(document.getElementById("taskInfo"))
                    myChart.setOption(option)
                    autoHover(myChart,option,3000)
                }
            },
            immediate:true
        }
    },
    methods:{
        showDetail(){
            this.$emit('show')
        }
    }
}
</script>

<style lang="scss" scoped>
.farmTask{
    height: 100%;
    padding-left:20px;
    box-sizing: border-box;
    .echarts{
        height: 50%;
        display: flex;
        .pie{
            height: 100%;
            width: 120px;
            margin-right: 20px;
        }
        .detail{
            flex: 1;
            color:#fff;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 0;
            box-sizing: border-box;
            .progress::v-deep{
                display: flex;
                align-items: center;
                .el-progress__text{
                    color:#fff;
                }
                .el-progress-bar__outer{
                    height: 20px !important;
                }
            }
            span{
                color: #2EFFB7;
                cursor: pointer;
            }
        }
    }
    .info{
        height: 50%;
        display: flex;
        .item{
            flex: 1;
            height: 100%;
            font-size: 20px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            .num{
                font-size: 26px;
            }
            .label{
                color: #fff;
                font-size: 16px;
            }
            &:nth-of-type(1){
                color: #2EFFB7;
            }
            &:nth-of-type(2){
                color: #099AFF;
            }
            &:nth-of-type(3){
                color: #32EBF2;
            }
            &:nth-of-type(4){
                color: #FCDE1F;
            }
        }
    }
}
</style>
