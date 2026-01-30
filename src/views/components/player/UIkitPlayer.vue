<template>
  <div>
    <!-- <div class="height-500 width-800" id="ezuikit-player"></div> -->
    <div ref="container" class="height-500 width-800"></div>
  </div>
</template>

<script>
import EZUIKit from 'ezuikit-js';
import qs from 'qs';
import axios from 'axios';
export default {
  name: '',
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
        url:''
    };
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {
    await this.geturl();
    this.createJs();
    this.createUIkit();
  },
  destroyed() {},
  methods: {
    async geturl() {
      const data = await axios.post(
        'https://open.ys7.com/api/lapp/v2/live/address/get',
        qs.stringify({
          accessToken:'at.512ctqv59rsjeo1b2g1ykce8b98meo0t-1ovh6y2gqj-1hyqjfl-pwmhhkzb7',
          deviceSerial: 'FE6427631',
          protocol:4
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      this.url=data.data.data.url
      console.log(4444,this.url)
    },
    async createUIkit() {
      const UIKitDEMO = new EZUIKit.EZUIKitPlayer({
        id: `ezuikit-player`,
        url: this.url,
        accessToken:
          'at.512ctqv59rsjeo1b2g1ykce8b98meo0t-1ovh6y2gqj-1hyqjfl-pwmhhkzb7',
        useHardDev: true, //开启高性能模式
      });
    },
    async createJs() {
      this.$jessibucaPro && (await this.$jessibucaPro.destroy());
      const baseConfig = {
        container: this.$refs.container,
        videoBuffer: 0.1, // 缓存时长
        videoBufferDelay: 0.2, //
        loadingText: '加载中',
        decoder: '/js/jessibuca-pro/decoder-pro.js',
        isResize: false,
        isFlv: true,
        debug: false,
        useMSE: false,
        useSIMD: true,
        debugLevel: 'debug',
        showBandwidth: true, // 显示网速
        showPerformance: false, // 显示性能
        showPlaybackOperate: true,
      };
      const jessibucaPro = new JessibucaPro(baseConfig);
      this.$jessibucaPro = jessibucaPro;
      console.log(this.url)
      this.$jessibucaPro.play(
        this.url
      );
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
