<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
      <div class="ibox">
        <div class="hycs" >{{data.data.text||'请设置文本'}}<span>{{data.data.times||'未核验'}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TraceTime',
  mixins: [],
  components: {},
  props: ['data'],
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  mounted() {
  },
  destroyed() {},
  methods: {

  },
};
</script>
<style lang="scss" scoped>
  $pcUnit: 400px / 750;
  $mobileUnit: 100vw / 750;
  /** 电脑端样式 */
  .pcImain {
    padding: 10 * $pcUnit 0;
    .ibox {
      border-radius: 10 * $pcUnit;
      background: #fff;
      .hycs {
        padding: 0 0 0 172 * $pcUnit;
        height: 142 * $pcUnit;
        line-height: 142 * $pcUnit;
        background: url(~@/assets/images/trace/heyan.png) 25 * $pcUnit bottom no-repeat;
        background-size: 108 * $pcUnit auto;
        font-size: 32 * $pcUnit;
        position: relative;
        span {
          position: absolute;
          right: 50 * $pcUnit;
          top: 0;
          color: #26bd5f;
        }
      }
    }
  }
   /** 手机端样式 */
  .mobileImain {
    padding: 10 * $mobileUnit 0;
    .ibox {
      border-radius: 10 * $mobileUnit;
      background: #fff;
      .hycs {
        padding: 0 0 0 172 * $mobileUnit;
        height: 142 * $mobileUnit;
        line-height: 142 * $mobileUnit;
        background: url(~@/assets/images/trace/heyan.png) 25 * $mobileUnit bottom no-repeat;
        background-size: 108 * $mobileUnit auto;
        font-size: 32 * $mobileUnit;
        position: relative;
        span {
          position: absolute;
          right: 50 * $mobileUnit;
          top: 0;
          color: #26bd5f;
        }
      }
    }
  }
</style>
