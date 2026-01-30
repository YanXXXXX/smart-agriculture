<template>
  <div class="w100 h100">
      <div class="topBox">
              <div class="topLft">
                <p>6%</p>
                <p>家庭农场</p>
              </div>
              <div class="topRit">
                <div class="topList" v-for="(item,index) in dataList" :key="index">
                  <p>
                    <img :src="item.imgs" alt="">
                    <span>{{item.nums}}</span>
                  </p>
                  <p>
                    <span>{{item.name}}</span>
                    <span>{{item.homer}}</span>
                  </p>
                </div>
              </div>
            </div>
  </div>
</template>

<script>
export default {
  name: '',
  mixins: [],
  components: {},
  props: {},
  data() {
    return{
        dataList:[
            {name:'龙头企业',nums:10,imgs:require('../img/5.png'),homer:'（家）'},
            {name:'入园参与',nums:28,imgs:require('../img/6.png'),homer:'（家）'},
            {name:'家庭农场',nums:56,imgs:require('../img/7.png'),homer:'（家）'},
            {name:'合作社',nums:811,imgs:require('../img/8.png'),homer:'（家）'}
          ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.topBox{
  display: flex;
  .topLft{
    padding:20px 0 0 30px;
    width:40%;
    text-align: center;
    p:nth-child(1){
      background: url('../img/4.png');
      background-size: 100% 100%;
      width:144px;
      height: 112px;
      text-align: center;
      line-height: 112px;
      color:#ccefff ;
      font-size: 24px;
    }
    p:nth-child(2){
      background: url('../img/9.png');
      background-size: 100% 100%;
      width:125px;
      height: 38px;
      text-align: center;
      line-height: 38px;
      color:#ccefff ;
      font-size: 18px;
      margin-left:10px
    }
  }
  .topRit{
    width:56%;
    display: flex;
    padding:50px 0 0 30px;
    flex-wrap: wrap;
    .topList{
      width:50%;
      p:nth-child(1){
        display: flex;
        margin:0;
        align-items: center;
        img{
          width:24px;
          height: 24px;
          margin-right:8px
        }
        span{
          font-size: 22px;
          color: #ccefff;
        }
      }
      p:nth-child(2){
        display: flex;
        margin:0;
        align-items: center;
        padding-top:10px;
        color:#ccc
      }
    }
    .topList:nth-child(3){
      margin-top:30px
    }
    .topList:nth-child(4){
      margin-top:30px
    }
  }
}
</style>
