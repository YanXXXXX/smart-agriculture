<template>
  <div class="w100 h100 flex">
       <div class="topLeft">
          <div>
            <el-date-picker
              v-model="value1"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </div>
        </div>
        <div class="topRight">
          <div class="topOne">
            <span>支持总水平</span>
            <span>23,564,521</span>
          </div>
          <div class="topTwo">
            <span>劳动农民总数</span>
            <span>4503人</span>
          </div>
          <div class="topThree">
            <span>综合机械化率</span>
            <span>93.6%</span>
          </div>
          <div class="topFour">
            <span>良种覆盖率</span>
            <span>97.1%</span>
          </div>
          <div class="topFive">
            <span>经费支出</span>
            <span>1700万元</span>
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
      value1:'',

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
.topLeft{
  width: 30%;
  height: 100%;
  ::v-deep .el-input__inner{
    background: rgba(32,60,73,.4)!important;
    border: none;
    color: #fff
  }
}
.topRight{
  position: relative;

  .topOne{
    width:260px;
    height: 480px;
    background: url('../img/20.png');
    background-size: 100% 100%;
    position: absolute;
    left:160px;top:50px;
    span:nth-child(1){
      position: absolute;
      left:70px;
      top:60px;
      color: #e1eaf3;
      font-size: 20px;
      font-weight: 700;
    }
    span:nth-child(2){
      position: absolute;
      left:40px;
      top:102px;
      color: #e1eaf3;
      font-size: 40px;
      font-weight: 700;
    }
  }
  .topTwo{
    width:130px;
    height: 210px;
    background: url('../img/21.png');
    background-size: 100% 100%;
    position: absolute;
    left:-70px;top:190px;
    span:nth-child(1){
      position: absolute;
      left:26px;
      top:4px;
      color: #e1eaf3;
      font-size: 14px;
    }
    span:nth-child(2){
      position: absolute;
      left:33px;
      top:32px;
      color: #e1eaf3;
      font-size: 22px;
      font-weight: 700;
    }
  }
  .topThree{
    width:130px;
    height: 210px;
    background: url('../img/17.png');
    background-size: 100% 100%;
    position: absolute;
    left:-20px;top:390px;
    span:nth-child(1){
      position: absolute;
      left:26px;
      top:4px;
      color: #e1eaf3;
      font-size: 14px;
    }
    span:nth-child(2){
      position: absolute;
      left:33px;
      top:32px;
      color: #e1eaf3;
      font-size: 22px;
      font-weight: 700;
    }
  }
  .topFour{
    width:130px;
    height: 210px;
    background: url('../img/18.png');
    background-size: 100% 100%;
    position: absolute;
    left:440px;top:390px;
    span:nth-child(1){
      position: absolute;
      left:26px;
      top:4px;
      color: #e1eaf3;
      font-size: 14px;
    }
    span:nth-child(2){
      position: absolute;
      left:33px;
      top:32px;
      color: #e1eaf3;
      font-size: 22px;
      font-weight: 700;
    }
  }
  .topFive{
    width:130px;
    height: 210px;
    background: url('../img/19.png');
    background-size: 100% 100%;
    position: absolute;
    left:540px;top:190px;
    span:nth-child(1){
      position: absolute;
      left:26px;
      top:4px;
      color: #e1eaf3;
      font-size: 14px;
    }
    span:nth-child(2){
      position: absolute;
      left:20px;
      top:32px;
      color: #e1eaf3;
      font-size: 20px;
      font-weight: 700;
    }
  }
}
</style>
