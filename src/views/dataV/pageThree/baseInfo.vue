<template>
    <div class="baseInfo">
      <div class="farm">
        <div class="img">
          <img :src="baseUrl + baseInfo.baseImg" alt="" srcset="" />
        </div>
        <div class="farmInfo">
          <div><span>基地名称：</span>{{ baseInfo.baseName }}</div>
          <div><span>基地负责人：</span>{{ baseInfo.baseLeader }}</div>
        </div>
      </div>
      <div class="info">
        <div class="item">
          <img src="../img/icon1.png" alt="" />
          <div class="num">{{ baseInfo.areaCount }}</div>
          <div class="label">基地面积（亩）</div>
        </div>
        <div class="item">
          <img src="../img/icon2.png" alt="" />
          <div class="num">{{ baseInfo.diCount + baseInfo.pengCount }}</div>
          <div class="label">地块数量（块）</div>
        </div>
        <div class="item">
          <img src="../img/icon3.png" alt="" />
          <div class="num">{{ baseInfo.germplasmCount }}</div>
          <div class="label">种养作物（种）</div>
        </div>
        <div class="item">
          <img src="../img/icon4.png" alt="" />
          <div class="num">{{ baseInfo.batchCount }}</div>
          <div class="label">种植批次（个）</div>
        </div>
      </div>
    </div>
</template>

<script>
import { selectBaseInfo } from "@/api/agriculture/dataStatistics"
export default {
    data(){
        return {
            baseInfo:{},
            baseUrl:process.env.VUE_APP_BASE_API,
        }
    },
    props:{
        baseId:Number
    },
    watch:{
        baseId:{
            handler:function(n){
                selectBaseInfo(this.baseId).then(res=>{
                    this.baseInfo=res.rows[0]
                })
            },
            immediate:true
        }
    }
};
</script>

<style lang="scss" scoped>
.baseInfo{
    height: 100%;
    padding-left:20px;
    box-sizing: border-box;
    .farm{
        height: 40%;
        display: flex;
        display: flex;
        align-items: center;
        .img{
            width: 100px;
            height: 90%;
            margin-right: 20px;
            border-radius: 10px;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .farmInfo{
            height: 100%;
            padding: 12px 0;
            color: #CCEFFF;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            div{
                font-size: 18px;
                span{
                    color: #8EA5B5;
                }
            }
        }
    }
    .info{
        height: 60%;
        display: flex;
        .item{
            flex: 1;
            height: 100%;
            font-size: 24px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            img{
                width: 30px;
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
