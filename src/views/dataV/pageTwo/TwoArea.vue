<template>
  <div>
      <div class="topBox">
          <div class="topLft">
            <p>56%</p>
            <p>园区内农民人均收入</p>
          </div>
          <div class="topRit">
            <div class="topTop">
              <div class="tile">全县农民人均收入</div>
              <el-progress color="#1890ff" :percentage="40" ></el-progress>
            </div>
            <div class="topTop">
              <div class="tile">园区内农民人均收入</div>
              <el-progress color="rgb(64, 219, 165)" :percentage="70" ></el-progress>
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
      width:155px;
      height: 38px;
      text-align: center;
      line-height: 38px;
      color:#ccefff ;
      font-size: 16px;
      margin-left:10px
    }
  }
  .topTop:nth-child(2){
    margin-top:60px
  }
  .topRit{
    width:56%;
    padding:50px 0 0 30px;
    .tile{
      color:#ccc;
      margin-bottom:10px
    }
    ::v-deep .el-progress__text{
      color:#ccefff
    }
    ::v-deep .el-progress-bar__outer{
      background: rgb(33, 62, 73);
    }

  }
}
</style>
