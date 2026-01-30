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
export default{
  data(){
    return{
      list:[
        {name:'农产品认证',num:40.2,percent:'%',img:require('../img/10.png')},
        {name:'农产品面积',num:5475,percent:'亩',img:require('../img/11.png')},
        {name:'综合利用率',num:93.9,percent:'%',img:require('../img/12.png')},
        {name:'化肥利用率',num:40.2,percent:'%',img:require('../img/13.png')},
        {name:'农药利用率',num:40.7,percent:'%',img:require('../img/14.png')},
        {name:'监测合格率',num:99.9,percent:'%',img:require('../img/15.png')},
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.bom{
  display: flex;
  flex-wrap: wrap;
  margin-top:10px;
  .bomList{
    width:33%;
    display: flex;
    margin-top: 28px;
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
    margin-top:32px
  }
}
</style>