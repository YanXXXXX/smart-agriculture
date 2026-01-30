<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
      <div class="ibox">
        <div class="ibox_t">店铺信息</div>
        <div class="ibox_m">
          <div class="dpif">
            <div class="item" v-for="(item,index) in data.data" :key="index">
              <a :href="item.shopUrl" target="_blank">
                <div class="img"><img :src="$baseUrl+item.shopImg" /></div>
                <div class="con">
                    <div class="t">{{item.shopName}}</div>
                    <div class="m">{{item.shopType=='1'?'线上店铺,请点击访问店铺':'线下店铺'}}</div>
                    <div class="pos">{{item.shopAddress}}</div>
                    <div class="tel">
                        <a :href="`tel:${item.shopTel}`"> {{item.shopTel}} </a>
                    </div>
                </div>
              </a>
            </div>
          </div>
          <!-- <div class="imore"><a href="#">查看更多</a></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Shop',
  mixins: [],
  components: {},
  props: ['data'],
  data() {
    return {};
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
  $pcUnit: 400px / 750;
  $mobileUnit: 100vw / 750;
  .pcImain { padding: 10 * $pcUnit 0;
    .ibox { border-radius: 10 * $pcUnit; background: #fff; }
    .ibox_t { padding: 0 50 * $pcUnit; line-height: 116 * $pcUnit; font-size: 36 * $pcUnit; color: #333333; position: relative;}
    .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $pcUnit; top: 50%; width: 8 * $pcUnit; height: 40 * $pcUnit; border-radius: 4 * $pcUnit; background: #41dca2; margin-top: -20 * $pcUnit;}
    .ibox_m { padding: 0 22 * $pcUnit 2 * $pcUnit 22 * $pcUnit; }
    .dpif { margin-top: -20 * $pcUnit;}
    .dpif .item { position: relative; padding: 27 * $pcUnit 0 27 * $pcUnit 258 * $pcUnit !important; background-color: #fff !important; height: 249 * $pcUnit; box-sizing: border-box;}
    .dpif .item .img { position: absolute; left: 0; top: 27 * $pcUnit; width: 233 * $pcUnit; height: 195 * $pcUnit; }
    .dpif .item .img img { display: block; width: 233 * $pcUnit; height: 195 * $pcUnit; border-radius: 10 * $pcUnit; object-fit: cover; }
    .dpif .item .con { }
    .dpif .item .con .t { color: #333; font-size: 32 * $pcUnit; line-height: 40 * $pcUnit; height: 40 * $pcUnit; overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
    .dpif .item .con .m { color: #2b7; font-size: 26 * $pcUnit; line-height: 54 * $pcUnit; height: 54 * $pcUnit; overflow: hidden; white-space: nowrap;text-overflow: ellipsis; margin-bottom: 22 * $pcUnit;}
    .dpif .item .con .pos { line-height: 44 * $pcUnit; height: 44 * $pcUnit; padding-left: 42 * $pcUnit; font-size: 24 * $pcUnit; color: #333333; overflow: hidden; white-space: nowrap;text-overflow: ellipsis; background: url(~@/assets/images/trace/pos.png) left center no-repeat; background-size: 23 * $pcUnit auto;}
    .dpif .item .con .tel { line-height: 44 * $pcUnit; height: 44 * $pcUnit; padding-left: 42 * $pcUnit; font-size: 24 * $pcUnit; color: #333333; overflow: hidden; white-space: nowrap;text-overflow: ellipsis; background: url(~@/assets/images/trace/tel.png) left center no-repeat; background-size: 24 * $pcUnit auto;}
    .imore { padding: 30 * $pcUnit 0; }
    .imore a { display: block; width: 262 * $pcUnit; margin: 0 auto; text-align: center; font-size: 30 * $pcUnit; line-height: 80 * $pcUnit; height: 80 * $pcUnit; border-radius: 40 * $pcUnit; background: #e9f9f4; color: #07c185; text-decoration: none;}
    .imore a:after { display: inline-block; content: ''; vertical-align: middle; margin-left: 16 * $pcUnit; width: 0; height: 0; border-top: 12 * $pcUnit transparent solid; border-bottom: 12 * $pcUnit transparent solid; border-left: 12 * $pcUnit #51d3aa solid;}
  }
  .mobileImain { padding: 10 * $mobileUnit 0;
    .ibox { border-radius: 10 * $mobileUnit; background: #fff; }
    .ibox_t { padding: 0 50 * $mobileUnit; line-height: 116 * $mobileUnit; font-size: 36 * $mobileUnit; color: #333333; position: relative;}
    .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $mobileUnit; top: 50%; width: 8 * $mobileUnit; height: 40 * $mobileUnit; border-radius: 4 * $mobileUnit; background: #41dca2; margin-top: -20 * $mobileUnit;}
    .ibox_m { padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit; }
    .dpif { margin-top: -20 * $mobileUnit;}
    .dpif .item { position: relative; padding: 27 * $mobileUnit 0 27 * $mobileUnit 258 * $mobileUnit; height: 249 * $mobileUnit; box-sizing: border-box;}
    .dpif .item .img { position: absolute; left: 0; top: 27 * $mobileUnit; width: 233 * $mobileUnit; height: 195 * $mobileUnit; }
    .dpif .item .img img { display: block; width: 233 * $mobileUnit; height: 195 * $mobileUnit; border-radius: 10 * $mobileUnit; object-fit: cover; }
    .dpif .item .con { }
    .dpif .item .con .t { color: #333; font-size: 32 * $mobileUnit; line-height: 40 * $mobileUnit; height: 40 * $mobileUnit; overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
    .dpif .item .con .m { color: #2b7; font-size: 26 * $mobileUnit; line-height: 54 * $mobileUnit; height: 54 * $mobileUnit; overflow: hidden; white-space: nowrap;text-overflow: ellipsis; margin-bottom: 22 * $mobileUnit;}
    .dpif .item .con .pos { line-height: 44 * $mobileUnit; height: 44 * $mobileUnit; padding-left: 42 * $mobileUnit; font-size: 24 * $mobileUnit; color: #333333; overflow: hidden; white-space: nowrap;text-overflow: ellipsis; background: url(~@/assets/images/trace/pos.png) left center no-repeat; background-size: 23 * $mobileUnit auto;}
    .dpif .item .con .tel { line-height: 44 * $mobileUnit; height: 44 * $mobileUnit; padding-left: 42 * $mobileUnit; font-size: 24 * $mobileUnit; color: #333333; overflow: hidden; white-space: nowrap;text-overflow: ellipsis; background: url(~@/assets/images/trace/tel.png) left center no-repeat; background-size: 24 * $mobileUnit auto;}
    .imore { padding: 30 * $mobileUnit 0; }
    .imore a { display: block; width: 262 * $mobileUnit; margin: 0 auto; text-align: center; font-size: 30 * $mobileUnit; line-height: 80 * $mobileUnit; height: 80 * $mobileUnit; border-radius: 40 * $mobileUnit; background: #e9f9f4; color: #07c185; text-decoration: none;}
    .imore a:after { display: inline-block; content: ''; vertical-align: middle; margin-left: 16 * $mobileUnit; width: 0; height: 0; border-top: 12 * $mobileUnit transparent solid; border-bottom: 12 * $mobileUnit transparent solid; border-left: 12 * $mobileUnit #51d3aa solid;}
  }
</style>
