<template>
  <div class="w100 h100 flex aic">
    <div class="topLeft">

      <div>
        <el-date-picker v-model="value1" type="year" placeholder="选择年">
        </el-date-picker>
      </div>
      <ul>
        <li>
          <img src="../img/output.png" alt="" />
          <div class="topRit">
            <p>农业总产值（亿元）</p>
            <p style="color: #2effb7">1,000.00</p>
          </div>
        </li>
        <li>
          <img src="../img/level.png" alt="" />
          <div class="topRit">
            <p>产业园总产值（亿元）</p>
            <p style="color: #ff6e6f">27.51</p>
          </div>
        </li>
        <li>
          <img src="../img/production.png" alt="" />
          <div class="topRit">
            <p>主导鸡肉产量（吨）</p>
            <p style="color: #fcde1f">30,656.00</p>
          </div>
        </li>
        <li>
          <img src="../img/123.png" alt="" />
          <div class="topRit">
            <p>主导小麦产量（吨）</p>
            <p style="color: #00f6ff">44,120.00</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="topRight">
      <img src="../img/3.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
          value1:'',
    };
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
    background: #203c4966!important;
    border: none;
    color: #fff
  }
  ul{
    padding-left:0px
  }
  ul li{
    list-style: none;
    display: flex;
    align-items: center;
    margin:20px 0;
    img{
      width:112px;
      height: 118px;
    }
    .topRit{
      margin-left:10px;
      p:nth-child(1){
        color:#fff;
         font-size: 16px;
         margin-top:20px
      }
      p:nth-child(2){
        font-size: 30px;
        margin-top:10px
      }
    }
  }
}
</style>
