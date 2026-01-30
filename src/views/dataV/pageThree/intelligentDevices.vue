<template>
    <div class="intelligentDevices">
        <div id="pieChart"></div>
        <div id="barChart"></div>
    </div>
</template>

<script>
import { autoHover } from "../echartsOption"
import { selectDeviceInfo } from "@/api/agriculture/dataStatistics"
export default {
    data(){
        return {
            product:[],
        }
    },
    props:{
        baseId:Number
    },
    watch:{
        baseId:{
            handler:async function(n){
                if(n){
                    await this.$nextTick();
                    let pieChart = this.$echarts.init(document.getElementById("pieChart"))
                    let barChart = this.$echarts.init(document.getElementById("barChart"))
                    const {rows} = await selectDeviceInfo(this.baseId)
                    this.product = rows;
                    let option1 = {
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
                    };
                    pieChart.setOption(option1)
                    autoHover(pieChart,option1,1500)

                    let option2 ={
                        tooltip: {
                            trigger: "axis",
                            showContent: false,
                            axisPointer: {
                                type: "shadow",
                            },
                        },
                        grid:{
                            left:100,
                            top:20,
                            right:50,
                            bottom:20
                        },
                        yAxis: {
                            type: 'category',
                            data: rows.map(item=>item.name),
                            axisLabel:{
                                color:'#fff'
                            }
                        },
                        xAxis: {
                            type: 'value',
                            axisLabel:{
                                color:'#fff'
                            }
                        },
                        series: [
                            {
                                data: rows.map(item=>item.value),
                                type: 'bar',
                                barWidth:20,
                                emphasis: {
                                    label: {
                                        show: true,
                                        fontSize: 12,
                                        formatter: '{c}个',
                                        position:'right',
                                        color:"#fff",
                                        textBorderColor:'transparent'
                                    },
                                },
                                itemStyle:{
                                    normal: {
                                        borderRadius: [0, 20, 20, 0],
                                        color: (params)=> {
                                            return this.$colorList[params.dataIndex]
                                        }
                                    }
                                }
                            }
                        ]
                    }

                    barChart.setOption(option2)
                    autoHover(barChart,option2,1500)
                }
            },
            immediate:true
        },

    }
}
</script>

<style lang="scss" scoped>
.intelligentDevices{
    height: 100%;
    width: 100%;
    display: flex;
    #pieChart{
        width: 30%;
        height: 100%;
    }
    #barChart{
        width: 70%;
        height: 100%;
    }
}
</style>
