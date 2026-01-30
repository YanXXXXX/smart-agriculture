<template>
  <div class="w100 h100">
       <div ref="container" class="container h100" ></div>
  </div>
</template>

<script>
import {startPlay,stopPlay,} from '@/api/iot/channel';
import { ptzdirection, ptzscale } from '@/api/iot/sipdevice';

export default {
  name: 'SinglePlayer',
  mixins: [],
  components: {},
  props: {
    videoParam: {
      type: Object,
      default: function () {
        return null;
      },
    }
  },
  data() {
    return {
        deviceId:'',
        channelId:'',
        streamId:'',
        recordDate:null,
        open:false
    };
  },
  computed: {},
  watch: {
    videoParam: {
      handler: async function (n, o) {
        //只要监听到外部的切换，就将当前流停掉
        this.stopPlay();
        //重新创建播放器
        this.create();
        //然后再赋值播放
        if(!n.deviceId.includes('time') && !n.channelId.includes('time')){
            this.deviceId = n.deviceId;
            this.channelId = n.channelId;
            this.play();
        }else{
            this.$message({
            type: 'warning',
            message: '没有在线通道'
        })
        }
      },
      deep: true
    },
    width: {
      handler: function (n, o) {
        this.$nextTick(() => {
          this.create();
        });
      }
    },
  },
  created() {
  },
  mounted() {
    this.create();
    //然后再赋值播放
    if(!this.videoParam.deviceId.includes('time') && !this.videoParam.channelId.includes('time')){
        this.deviceId = this.videoParam.deviceId;
        this.channelId = this.videoParam.channelId;
        this.play();
    }else{
        this.$message({
          type: 'warning',
          message: '没有在线通道'
      })
    }
  },
  beforeDestroy() {
    //   this.stopPlay();
    //   this.stopPlayBack();
  },
  methods: {
     async create() {
      this.$jessibucaPro && await this.$jessibucaPro.destroy();
      const config = {
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
        showPlaybackOperate:true,
        ptzZoomShow:true,
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
          record: true,
          ptz: true,
          performance: true,
        },
        ptzClickType: 'mouseDownAndUp'
      }
      const jessibucaPro = new JessibucaPro(config);

      jessibucaPro.on('ptz', (d) => {
        switch (d) {
          case 'up':
            this.ptzDirection(0, 1);
            break;
          case 'down':
            this.ptzDirection(0, 2);
            break;
          case 'left':
            this.ptzDirection(2, 0);
            break;
          case 'right':
            this.ptzDirection(1, 0);
            break;
          case 'zoomExpand':
            this.ptzScale(1);
            break;
          case 'zoomNarrow':
            this.ptzScale(2);
            break;
          case 'stop':
            this.ptzDirection(0, 0);
            this.ptzScale(0);
            break;
        }
      });
      this.$jessibucaPro = jessibucaPro;
    },
    /** 直播 */
    async play() {
      if (this.deviceId && this.channelId) {
        const {data:{playurl,streamId}} = await startPlay(this.deviceId, this.channelId);
        this.streamId = streamId;
        playurl && this.$jessibucaPro.play(playurl);
        console.log(playurl);
      }
    },
    /** 停止播放直播 */
    async stopPlay(){
        if (this.deviceId && this.channelId) {
            stopPlay(this.deviceId, this.channelId, this.streamId)
        }
    },
   /** 方向控制 */
    ptzDirection(leftRight, upDown) {
      var data = {
        leftRight: leftRight,
        upDown: upDown,
        moveSpeed: 125,
      };
      if (this.deviceId && this.channelId) {
        ptzdirection(this.deviceId, this.channelId, data);

      }
    },
     /**缩放控制*/
    ptzScale: function (inOut) {
      console.log('云台缩放：' + inOut);
      var data = {
        inOut: inOut,
        scaleSpeed: 30
      }
      ptzscale(this.deviceId, this.channelId, data)
    },
  },
};
</script>
<style lang="scss" scoped>
    .container{
        background: rgba(13, 14, 27, 0.7);
    }
</style>
