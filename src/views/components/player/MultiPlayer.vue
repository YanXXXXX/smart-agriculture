<template>
  <div class="w100 h100 flex fdc">
    <div class="height-40 flex aic">
        <div class="background-color-primary  padding-lr-10 padding-tb-5 border-top-left-radius-5 border-bottom-left-radius-5">
          <svg-icon icon-class="1" class="font-size-20" style="color:#fff" @click="dSplit = 1"/>
        </div>
        <div class="background-color-primary  padding-lr-10 padding-tb-5">
            <svg-icon icon-class="2" class="font-size-20 " style="color:#fff" @click="dSplit = 2"/>
        </div>
        <div class="background-color-primary  padding-lr-10 padding-tb-5 border-top-right-radius-5 border-bottom-right-radius-5">
            <svg-icon icon-class="3" class="font-size-20 " style="color:#fff" @click="dSplit = 3"/>
        </div>
    </div>
    <div ref="container" class="flexauto"></div>
  </div>
</template>

<script>
import {
  startPlay,
  stopPlay,
  getStreaminfo,
  playback,
  playbackPause,
  playbackReplay,
  playbackSeek,
  playbackSpeed,
  playbackStop,
} from '@/api/iot/channel';
import { ptzdirection, ptzscale } from '@/api/iot/sipdevice';
import { getYs } from '@/api/iot/ys';

export default {
  name: 'MultiPlayer',
  mixins: [],
  components: {},
  props: {
    //布局类型：1 2 4 5 3-1 4-1
    split: {
      type: [Number, String],
      default: 1,
    },
    videoParam: {
      type: Object,
      default: function () {
        return null;
      },
    }
  },
  data() {
    return {
      replayActive: false,
      dSplit: 0,
      streamIds: [],
      chooseWin: null,
      playWinList: [],
    };
  },
  computed: {},
  watch: {
    dSplit: {
      handler: function () {
        this.updateSplit();
      },
    },
    videoParam: {
      handler: function (n, o) {
        this.play();
      },
      deep: true,
    }
  },
  created() {},
  mounted() {
    this.create();
  },
  methods: {
    create() {
      this.$jessibuca && this.$jessibuca.destroy();
      const jessibucaMulti = new JessibucaProMulti({
        container: this.$refs.container,
        videoBuffer: 0.1, // 缓存时长
        videoBufferDelay: 0.2, //
        decoder: '/js/jessibuca-pro/decoder-pro.js',
        split: this.split,
        isResize: false,
        loadingText:'加载视频',
        isFlv: true,
        debug: false,
        useMSE: false,
        useSIMD: true,
        debugLevel: 'debug',
        hasAudio: false,
        showBandwidth: true, // 显示网速
        showPerformance: false, // 显示性能
        showPlaybackOperate: true,
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
          record: true,
          ptz: true,
          //   quality: true,
          performance: true,
        },
        ptzClickType: 'mouseDownAndUp',
        ptzZoomShow: true,
        // ptzMoreArrowShow: true,
        // ptzApertureShow: true,
        // controlHtml: '<div>我是 <span @click="updateSplit(2)" style="color: red">test</span>文案</div>'
        // qualityConfig: ['720P', '1080P', '4K']
      });
      jessibucaMulti.on('ptz', (index, d) => {
        switch (d) {
          case 'up':
            this.ptzDirection(0, 1, index);
            break;
          case 'down':
            this.ptzDirection(0, 2, index);
            break;
          case 'left':
            this.ptzDirection(2, 0, index);
            break;
          case 'right':
            this.ptzDirection(1, 0, index);
            break;
          case 'zoomExpand':
            this.ptzScale(1, index);
            break;
          case 'zoomNarrow':
            this.ptzScale(2, index);
            break;
          case 'stop':
            this.ptzDirection(0, 0, index);
            this.ptzScale(0, index);
            break;
        }
      });

      this.$jessibuca = jessibucaMulti;
    },
    updateSplit() {
      this.$jessibuca && this.$jessibuca.arrangeWindow(this.dSplit);
    },
    /** 直播 */
    async play() {
      if (this.videoParam?.deviceId && this.videoParam?.channelId) {
         const {data}= await startPlay(this.videoParam.deviceId, this.videoParam.channelId);
          //存储流数组，方便统一停止流
          this.streamId = data.streamId;
          //存储播放状态的窗口
          //根据index查找一下窗口是否存在信息
          let index = this.playWinList.findIndex((item) => item.index == this.$jessibuca.getSelectedWindowIndex());
          //窗口信息
          let winInfo = {
                index: this.$jessibuca.getSelectedWindowIndex(),
                deviceId: this.videoParam.deviceId,
                channelId: this.videoParam.channelId,
                streamId: data.streamId,
                type: this.videoParam.type,
            };
          index==-1?this.playWinList.push(winInfo):this.playWinList[index]=winInfo;
          data.playurl && this.$jessibuca.play(data.playurl);
      }
    },
    /** 停止播放直播 */
    async stopPlay(streamId) {
      stopPlay(this.videoParam.deviceId, this.videoParam.channelId, streamId);
    },
    /**PTZ控制*/
    ptzDirection(leftRight, upDown, index) {
      var data = {
        leftRight: leftRight,
        upDown: upDown,
        moveSpeed: 125,
      };
      let curWin = this.playWinList.find((item) => item.index == index);
      if (curWin) {
        ptzdirection(curWin.deviceId, curWin.channelId, data);
      }
    },
    //缩放控制
    ptzScale: function (inOut, index) {
      var data = {
        inOut: inOut,
        scaleSpeed: 30,
      };
      let curWin = this.playWinList.find((item) => item.index == index);
      ptzscale(curWin.deviceId, curWin.channelId, data);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
