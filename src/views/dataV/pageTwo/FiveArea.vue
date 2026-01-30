<template>
  <div>
      <div class="bom">
          <div class="bomLeft">
            <div class="bomer">
              <img src="../img/23.png" alt="" class="img1">
              <div class="conent">
                <p>新品种新技术研发引进推广经费支出</p>
                <p>
                  <span>2000</span>
                  <span>万元</span>
                </p>
              </div>
            </div>
            <div class="bomer">
              <img src="../img/24.png" alt="" class="img1">
              <div class="conent">
                <p>专业技术人员数量</p>
                <p>
                  <span>134</span>
                  <span>人</span>
                </p>
              </div>
            </div>
          </div>
          <div class="bomRight">
            <div class="top">
              <p>
                <span>4</span>
                <span>个</span>
              </p>
              <p>研发平台</p>
            </div>
            <div class="center">
              <p>
                <span>3</span>
                <span>个</span>
              </p>
              <p>孵化企业</p>
            </div>
            <div class="bomst">
              <p>
                <span>67.6</span>
                <span>%</span>
              </p>
              <p>贡献率</p>
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
    return{}
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
.bom{
  display: flex;
  padding:20px
}
.bomLeft{
  width:70%;
  .bomer{
    display: flex;
    align-items: center;
  }
  .img1{
    width:56px;
    height: 60px;
    margin-right: 10px;
  }
  .conent{
    p:nth-child(1){
      color: #ccc;
      font-size: 16px;
      margin-top: 32px;
    }
    p:nth-child(2){
      span:nth-child(1){
        color:#2effb7;
        font-size: 24px;
      }
      span:nth-child(2){
        color:#ccc;
        font-size: 16px;
        margin-left:20px
      }
    }
  }
}
.bomRight{
  width:30%;
  position: relative;
  .top{
    width:120px;
    height: 120px;
    background: url('../img/25.png');
    background-size: 100% 100%;
    position: absolute;
    top:10px;
    p:nth-child(1){
      text-align: center;
      margin:0;
      margin-top:28px;
      span:nth-child(1){
        color:#ccefff;
        font-size: 18px;
      }
      span:nth-child(2){
        color:#ccc;font-size: 14px;margin-left:6px
      }
    }
    p:nth-child(2){
      margin:0;
      text-align: center;
      margin-top:10px;
      color: #ccc;
    }
  }
  .center{
    width:100px;
    height: 100px;
    background: url('../img/27.png');
    background-size: 100% 100%;
    position: absolute;
    top:120px;
    left:-30px;
    p:nth-child(1){
      text-align: center;
      margin:0;
      margin-top:20px;
      span:nth-child(1){
        color:#ccefff;
        font-size: 18px;
      }
      span:nth-child(2){
        color:#ccc;font-size: 14px;margin-left:6px
      }
    }
    p:nth-child(2){
      margin:0;
      text-align: center;
      margin-top:10px;
      color: #ccc;
    }
  }
  .bomst{
    width:110px;
    height: 110px;
    background: url('../img/26.png');
    background-size: 100% 100%;
    position: absolute;
    top:96px;
    left:90px;
    p:nth-child(1){
      text-align: center;
      margin:0;
      margin-top:30px;
      span:nth-child(1){
        color:#ccefff;
        font-size: 18px;
      }
      span:nth-child(2){
        color:#ccc;font-size: 14px;margin-left:6px
      }
    }
    p:nth-child(2){
      margin:0;
      text-align: center;
      margin-top:10px;
      color: #ccc;
    }
  }
}
</style>
