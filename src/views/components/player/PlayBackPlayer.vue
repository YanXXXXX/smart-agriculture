<template>
  <div class="h100 w100">
    <div v-loading="loading" element-loading-text="正在读取摄像头录像" element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-spinner="el-icon-loading" ref="container" class="container h100 w100" ></div>
  </div>
</template>

<script>
import {
  playback,
  playbackPause,
  playbackReplay,
  playbackSeek,
  playbackSpeed,
  playbackStop,
} from '@/api/iot/channel';
import { getDevRecord } from "@/api/iot/record";

export default {
  name: 'PlayBackPlayer',
  mixins: [],
  components: {},
  props: {
    videoParam: {
      type: Object,
      default: function () {
        return null;
      },
    },
    recordDate:null,
  },
  data() {
    return {
        //视频loading
        loading:false,
        //视频的deviceSipId
        deviceId:'',
        //channelSipId
        channelId:'',
        //查询的时间范围
        start:'',end:'',
        //第一个录像的开始时间
        firstVideoStart:'',
        //第二个录像结束时间
        lastVideoEnd:'',
        //streamId
        streamId:'',
        //录像列表
        recordItems:[]
    };
  },
  computed: {},
  watch: {
    recordDate: {
      handler: async function (n, o) {
        //然后再赋值播放
        if(this.videoParam.deviceId!='' && this.videoParam.channelId!=''){
            //只要监听到外部的切换，就将当前流停掉
            // this.stopPlayBack();
            //重新创建播放器
            this.create();
            this.deviceId = this.videoParam.deviceId;
            this.channelId = this.videoParam.channelId;
            this.playBack();
        }else{
            this.$message({
            type: 'warning',
            message: '请先选择通道'
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
  },
  beforeDestroy() {
    //   this.stopPlay();
    //   this.stopPlayBack();
  },
  methods: {
     /** 创建播放器 */
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
          ptz: false,
          performance: true,
        }
      }
      const jessibucaPro = new JessibucaPro(config);
      jessibucaPro.on("playbackSeek",(d)=>{
          this.seekPlayBack(d);
      })
      this.$jessibucaPro = jessibucaPro;
    },
   /** 回播 */
   async playBack(){
     //转换成秒时间戳，选择日期的00:00
     this.start = this.recordDate/1000;
     //选择日期的 23:59:59
     this.end = Math.floor((this.start*1000 + 24 * 60 * 60 * 1000 - 1) / 1000);// yyyy-dd-hh 23:59:59时间戳的秒数
     //查询时间范围内的录像记录
     this.loading = true;
     const {data} = await getDevRecord(this.deviceId, this.channelId, {start:this.start,end:this.end});
     let recordItems = data?.recordItems;
     this.loading = false;
     if(recordItems && recordItems.length>0){
        this.recordItems=recordItems;
        this.firstVideoStart = recordItems[0].start;//第一段录像的开始时间
        this.lastVideoEnd = recordItems[recordItems.length-1].end;
         //播放时间为第一段录像的开始时间到最后一段录像的结束时间
        const res = await playback(this.deviceId, this.channelId, {start:this.firstVideoStart,end:this.lastVideoEnd});
        this.streamId = res.data.streamId;
        this.$jessibucaPro.playback(res.data.playurl, {playList: recordItems,fps: 20})
     }else{
        await this.$confirm('当前设备没有录像');
     }
   },
   /** 停止回播 */
   stopPlayBack(){
       if (this.deviceId && this.channelId) {
        playbackStop(this.deviceId, this.channelId, this.streamId)
       }
   },
   /** 暂停回播 */
   pausePlayBack(){
       if (this.deviceId && this.channelId) {
        playbackPause(this.deviceId, this.channelId, this.streamId)
       }
   },
   /** 重新播放回播*/
   replayPlayBack(){
        if (this.deviceId && this.channelId) {
            playbackReplay(this.deviceId, this.channelId, this.streamId);
        }
   },
   /** 选时播放 */
   async seekPlayBack(time){
      let seekTime = this.start + time.hour * 3600 + time.min * 60 + time.second;
      if (this.streamId) {
        if (this.deviceId && this.channelId) {
          //通知设备播放到当前时间点
          const {data} = await playbackSeek(this.deviceId, this.channelId, this.streamId, {firstVideoStart:this.firstVideoStart,seekTime: seekTime});
          if(data){
              await this.$jessibucaPro.playback(data, {playList: this.recordItems,fps: 20})
            //兼容萤石云，延迟三秒设置下面进度条
            setTimeout(() => {
            this.$jessibucaPro.setPlaybackStartTime(seekTime)
            }, 3000);
          }else{
              this.$jessibucaPro.setPlaybackStartTime(seekTime)
          }

        }
      }
   }
  },
};
</script>
<style lang="scss" scoped>
    .container{
        background: rgba(13, 14, 27, 0.7);
    }
</style>
