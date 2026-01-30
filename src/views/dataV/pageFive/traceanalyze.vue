<template>
  <div>
    <div class="bom">
      <div class="bomList" v-for="(item,index) in list" :key="index">
        <div class="bomLeft">
          <img :src="item.img" alt="">
        </div>
        <div class="bomRigtht">
          <p>{{item.name}}</p>
          <p>
            <span class="span1">{{item.num}}</span>
            <span class="span2">{{item.percent}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {selectRecordStatistics} from '@/api/trace/dataStatistics'
export default{
  data(){
    return{
      list:[
        {name:'扫码统计',num:111,percent:'次',img:require('../img/28.png')},
        {name:'溯源产品',num:10,percent:'种',img:require('../img/29.png')},
        {name:'溯源批次',num:9,percent:'个',img:require('../img/30.png')},
        {name:'宣传门店',num:4,percent:'个',img:require('../img/31.png')},
        {name:'线上门店',num:1,percent:'个',img:require('../img/32.png')},
        {name:'业务人员',num:1,percent:'个',img:require('../img/33.png')},
      ]
    }
  },
  props:{
      baseId:Number
  },
  watch: {
    baseId: {
      handler: async function (n) {
        if (n) {
            selectRecordStatistics(this.baseId).then((res)=>{
                this.list[0].num = res.rows[0].sm
                this.list[1].num = res.rows[0].cp
                this.list[2].num = res.rows[0].bb
                this.list[3].num = res.rows[0].xxdp
                this.list[4].num = res.rows[0].xsdp
                this.list[5].num = res.rows[0].ry
            })
        }
      },
      immediate: true,
    },
  }
}
</script>
<style lang="scss" scoped>
.bom{
  display: flex;
  flex-wrap: wrap;
  margin-top:10px;
  padding: 0 20px;
  .bomList{
    width:33.3%;
    display: flex;
    margin-top: 26px;
    .bomLeft{
      img{
        width:80px;
        height: 80px;
        margin-right:10px
      }
    }
    .bomRigtht{
     p:nth-child(1){
      font-size: 18px;
      color:#ccc;
      margin:0;
      margin-top:10px
     }
      p:nth-child(2){
      font-size: 16px;
      color:#ccc;
      margin:0;
      margin-top:5px
     }
      .span1{
        font-size: 20px;
        color:#ccefff
      }
      .span2{
        font-size: 10px;
        color:#99afbf;margin-left:10px
      }
    }
  }
  .bomList:nth-child(4),.bomList:nth-child(5),.bomList:nth-child(6){
    margin-top:50px
  }
}
</style>
