<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
      <div class="ibox">
        <div class="ibox_t">{{data.data.sellproName||'产品信息'}}</div>
        <div class="ibox_m">
          <div class="smrz">
            <div class="img">
                <img v-if="data.data.sellproImg" :src="$baseUrl+data.data.sellproImg"  />
                <img v-else src="@/assets/images/trace/1.jpg"  />
            </div>
            <div class="con">
              <div class="item item_t">
                <span>规格</span>
                <span>重量</span>
                <span>产地位置</span>
              </div>
              <div class="item">
                <span>{{data.data.sellproGuige||'请选择产品'}}</span>
                <span>{{data.data.sellproWeight||'请选择产品'}}</span>
                <span>{{data.data.sellproArea ||'请选择产品'}}</span>
              </div>
              <div class="item">
                {{data.data.remark||'请选择产品'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductInfo',
  mixins: [],
  components: {},
  props: ['data'],
  data() {
    return {

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
    $pcUnit:400px / 750;
    $mobileUnit:100vw / 750;
    .pcImain { padding: 10 * $pcUnit 0;
        .ibox { border-radius: 10 * $pcUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $pcUnit; line-height: 116 * $pcUnit; font-size: 36 * $pcUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $pcUnit; top: 50%; width: 8 * $pcUnit; height: 40 * $pcUnit; border-radius: 4 * $pcUnit; background: #41dca2; margin-top: -20 * $pcUnit;}
        .ibox_m { padding: 0 22 * $pcUnit 2 * $pcUnit 22 * $pcUnit; }

        .smrz .img { margin-bottom: 22 * $pcUnit;}
        .smrz .img img { display: block; width: 100%; height:300 * $pcUnit; border-radius: 10 * $pcUnit;}
        .smrz .con { margin-bottom: 22 * $pcUnit; background: #e9e9e9; border-radius: 10 * $pcUnit; padding: 8 * $pcUnit;}
        .smrz .con .item { margin-bottom: 10 * $pcUnit; background: #ffffff; border-radius: 10 * $pcUnit; padding: 18 * $pcUnit 22 * $pcUnit; font-size: 26 * $pcUnit; line-height: 40 * $pcUnit; color: #000000;}
        .smrz .con .item span { float: left; width: 30%;}
        .smrz .con .item span:last-child { width: 40%;}
        .smrz .con .item_t { background: none; line-height: 20 * $pcUnit;}
        .smrz .con .item:last-child { margin-bottom: 0;}
        .smrz .con .item:after { display: block; content: ''; clear: both;}
    }
    .mobileImain {
        padding: 10 * $mobileUnit 0;
        .ibox { border-radius: 10 * $mobileUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $mobileUnit; line-height: 116 * $mobileUnit; font-size: 36 * $mobileUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $mobileUnit; top: 50%; width: 8 * $mobileUnit; height: 40 * $mobileUnit; border-radius: 4 * $mobileUnit; background: #41dca2; margin-top: -20 * $mobileUnit;}
        .ibox_m { padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit; }

        .smrz .img { margin-bottom: 22 * $mobileUnit;}
        .smrz .img img { display: block; width: 100%; height:300 * $mobileUnit; border-radius: 10 * $mobileUnit;}
        .smrz .con { margin-bottom: 22 * $mobileUnit; background: #e9e9e9; border-radius: 10 * $mobileUnit; padding: 8 * $mobileUnit;}
        .smrz .con .item { margin-bottom: 10 * $mobileUnit; background: #ffffff; border-radius: 10 * $mobileUnit; padding: 18 * $mobileUnit 22 * $mobileUnit; font-size: 26 * $mobileUnit; line-height: 40 * $mobileUnit; color: #000000;}
        .smrz .con .item span { float: left; width: 30%;}
        .smrz .con .item span:last-child { width: 40%;}
        .smrz .con .item_t { background: none; line-height: 20 * $mobileUnit;}
        .smrz .con .item:last-child { margin-bottom: 0;}
        .smrz .con .item:after { display: block; content: ''; clear: both;}
    }
</style>
