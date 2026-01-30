<template>
  <div>
      <div :class="$isMobile?'mobileImain':'pcImain'">
			<div class="ibox">
				<div class="ibox_t">质检信息</div>
				<div class="ibox_m">
					<div class="zjxx">
                        <el-carousel class="carousel" :interval="4000" type="card" arrow="always" indicator-position="none"	>
                            <template v-if="data.data.length>0">
                                <el-carousel-item class="carouselItem"  v-for="(item,index) in data.data"  :key="index">
                                    <a :href="item.link" target="_blank"><img :src="$baseUrl+item.url"></a>
                                </el-carousel-item>
                            </template>
                            <template v-else>
                                 <el-carousel-item class="carouselItem"  v-for="item in 3" :key="item">
                                    <a href="http://www.frogny.cn/" target="_blank"><img src="@/assets/images/trace/zhijian.png"></a>
                                </el-carousel-item>
                            </template>
                        </el-carousel>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: 'Quality',
  mixins: [],
  components: {},
  props: ['data'],
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
    $pcUnit : 400px / 750;
    $mobileUnit : 100vw / 750;
    .pcImain { padding: 10 * $pcUnit 0;
        .ibox { border-radius: 10 * $pcUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $pcUnit; line-height: 116 * $pcUnit; font-size: 36 * $pcUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $pcUnit; top: 50%; width: 8 * $pcUnit; height: 40 * $pcUnit; border-radius: 4 * $pcUnit; background: #41dca2; margin-top: -20 * $pcUnit;}
        .ibox_m { padding: 0 22 * $pcUnit 2 * $pcUnit 22 * $pcUnit; }
        .carousel{height: 500 * $pcUnit;}
        .carouselItem{height: 500 * $pcUnit;}
        ::v-deep .el-carousel__container{height: 500 * $pcUnit;}
        .zjxx {padding: 12 * $pcUnit 0 10 * $pcUnit 0;}
        .zjxx  img { height: 500 * $pcUnit; display: block; width: 100%; }
    }
    .mobileImain {
        padding: 10 * $mobileUnit 0;
        .ibox { border-radius: 10 * $mobileUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $mobileUnit; line-height: 116 * $mobileUnit; font-size: 36 * $mobileUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $mobileUnit; top: 50%; width: 8 * $mobileUnit; height: 40 * $mobileUnit; border-radius: 4 * $mobileUnit; background: #41dca2; margin-top: -20 * $mobileUnit;}
        .ibox_m { padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit; }
        .carousel{height: 500 * $mobileUnit;}
        .carouselItem{height: 500 * $mobileUnit;}
        ::v-deep .el-carousel__container{height: 500 * $mobileUnit;}
        .zjxx { padding: 12 * $mobileUnit 0 10 * $mobileUnit 0;}
        .zjxx  img { height:100%; display: block; width: 100%; }
    }
</style>
