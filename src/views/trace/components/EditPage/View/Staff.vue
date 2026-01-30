<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
      <div class="ibox">
        <div class="ibox_t">业务人员</div>
        <div class="ibox_m">
          <div class="ywry">
            <div class="item" v-for="(item,index) in data.data" :key="index">
              <div class="con">
                <div class="t">{{item.staffName}}<span>{{item.staffPosition}}</span></div>
                <div class="m">{{item.staffDes}}</div>
              </div>
              <div class="tel">{{item.staffTel}}</div>
              <a :href="`tel:${item.staffTel}`" class="btn">联系TA</a>
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
  name: 'Staff',
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
    .ywry { padding: 0 8 * $pcUnit; margin-top: -20 * $pcUnit;}
    .ywry .item { position: relative; padding: 26 * $pcUnit 0 !important; background-color: #fff !important; border-bottom: 1 * $pcUnit #dcd8d1 solid;}
    .ywry .item:last-child { border-bottom: none;}
    .ywry .con { color: #333333; width: 40%; }
    .ywry .con .t { font-size: 32 * $pcUnit; line-height: 56 * $pcUnit; height: 56 * $pcUnit; }
    .ywry .con .t span { display: inline-block; vertical-align: middle; margin-bottom: 2 * $pcUnit; margin-left: 14 * $pcUnit; padding: 0 12 * $pcUnit; height: 40 * $pcUnit; line-height: 40 * $pcUnit; border-radius: 20 * $pcUnit; color: #107dd2; font-size: 20 * $pcUnit; background: #dff1fc;}
    .ywry .con .m{ font-size: 24 * $pcUnit; line-height: 40 * $pcUnit; height: 40 * $pcUnit; overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
    .ywry .tel { position: absolute; right: 156 * $pcUnit; top: 50%; transform: translateY(-50%); display: block; line-height: 44 * $pcUnit; color: #333333; font-size: 24 * $pcUnit; background: url(~@/assets/images/trace/tel.png) left center no-repeat; background-size: 24 * $pcUnit auto; padding-left: 32 * $pcUnit;}
    .ywry .btn { position: absolute; right: 0; top: 50%; transform: translateY(-50%); display: block; width: 134 * $pcUnit; text-align: center; height: 44 * $pcUnit; line-height: 44 * $pcUnit; border-radius: 22 * $pcUnit; color: #fff; font-size: 24 * $pcUnit; background: #07c185; text-decoration: none;}
    .imore { padding: 30 * $pcUnit 0; }
    .imore a { display: block; width: 262 * $pcUnit; margin: 0 auto; text-align: center; font-size: 30 * $pcUnit; line-height: 80 * $pcUnit; height: 80 * $pcUnit; border-radius: 40 * $pcUnit; background: #e9f9f4; color: #07c185; text-decoration: none;}
    .imore a:after { display: inline-block; content: ''; vertical-align: middle; margin-left: 16 * $pcUnit; width: 0; height: 0; border-top: 12 * $pcUnit transparent solid; border-bottom: 12 * $pcUnit transparent solid; border-left: 12 * $pcUnit #51d3aa solid;}
  }
   .mobileImain { padding: 10 * $mobileUnit 0;
    .ibox { border-radius: 10 * $mobileUnit; background: #fff; }
    .ibox_t { padding: 0 50 * $mobileUnit; line-height: 116 * $mobileUnit; font-size: 36 * $mobileUnit; color: #333333; position: relative;}
    .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $mobileUnit; top: 50%; width: 8 * $mobileUnit; height: 40 * $mobileUnit; border-radius: 4 * $mobileUnit; background: #41dca2; margin-top: -20 * $mobileUnit;}
    .ibox_m { padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit; }
    .ywry { padding: 0 8 * $mobileUnit; margin-top: -20 * $mobileUnit;}
    .ywry .item { position: relative; padding: 26 * $mobileUnit 0; border-bottom: 1 * $mobileUnit #dcd8d1 solid;}
    .ywry .item:last-child { border-bottom: none;}
    .ywry .con { color: #333333; width: 40%; }
    .ywry .con .t { font-size: 32 * $mobileUnit; line-height: 56 * $mobileUnit; height: 56 * $mobileUnit; }
    .ywry .con .t span { display: inline-block; vertical-align: middle; margin-bottom: 2 * $mobileUnit; margin-left: 14 * $mobileUnit; padding: 0 12 * $mobileUnit; height: 40 * $mobileUnit; line-height: 40 * $mobileUnit; border-radius: 20 * $mobileUnit; color: #107dd2; font-size: 20 * $mobileUnit; background: #dff1fc;}
    .ywry .con .m{ font-size: 24 * $mobileUnit; line-height: 40 * $mobileUnit; height: 40 * $mobileUnit; overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
    .ywry .tel { position: absolute; right: 156 * $mobileUnit; top: 50%; transform: translateY(-50%); display: block; line-height: 44 * $mobileUnit; color: #333333; font-size: 24 * $mobileUnit; background: url(~@/assets/images/trace/tel.png) left center no-repeat; background-size: 24 * $mobileUnit auto; padding-left: 32 * $mobileUnit;}
    .ywry .btn { position: absolute; right: 0; top: 50%; transform: translateY(-50%); display: block; width: 134 * $mobileUnit; text-align: center; height: 44 * $mobileUnit; line-height: 44 * $mobileUnit; border-radius: 22 * $mobileUnit; color: #fff; font-size: 24 * $mobileUnit; background: #07c185; text-decoration: none;}
    .imore { padding: 30 * $mobileUnit 0; }
    .imore a { display: block; width: 262 * $mobileUnit; margin: 0 auto; text-align: center; font-size: 30 * $mobileUnit; line-height: 80 * $mobileUnit; height: 80 * $mobileUnit; border-radius: 40 * $mobileUnit; background: #e9f9f4; color: #07c185; text-decoration: none;}
    .imore a:after { display: inline-block; content: ''; vertical-align: middle; margin-left: 16 * $mobileUnit; width: 0; height: 0; border-top: 12 * $mobileUnit transparent solid; border-bottom: 12 * $mobileUnit transparent solid; border-left: 12 * $mobileUnit #51d3aa solid;}
  }
</style>
