<template>
  <div class="w100 h100">
      <!-- 选择控件 -->
      <el-select class="selectDevice" size="mini" v-model="deviceId" @change="handleChangeDevice"  placeholder="请选择设备" clearable filterable>
          <el-option v-for="item in deviceList"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceId">
          </el-option>
      </el-select>
      <!-- 选择控件 -->
      <el-select class="selectChannel" size="mini" v-model="channelSipId" @change="handleChange"  placeholder="请选择通道" clearable filterable>
          <el-option v-for="item in channelList"
              :key="item.channelSipId"
              :label="item.channelName"
              :value="item.channelSipId">
          </el-option>
      </el-select>
      <!-- 播放器 -->
      <single-player :video-param="videoParam" :width="'100%'" class="h100 "></single-player>
  </div>
</template>

<script>
import SinglePlayer from "@/views/components/player/SinglePlayer";
import { listCamera } from '@/api/iot/device';

export default {
  name: 'Camera',
  mixins: [],
  components: {SinglePlayer},
  props: {
      baseId:Number
  },
  data() {
    return{
        //设备列表
        deviceList:[],
        //通道列表
        channelList:[],
        //被选中的device ID
        deviceId:null,
        //被选中的channel的id
        channelSipId:null,
        //播放器播放参数
        videoParam:{
            //摄像头序列号
            deviceId:null,
            //频道序列号
            channelId:null
        }
    }
  },
  computed: {},
  watch: {
      baseId:{
          handler:async function(n){
              if(n){
                //查询设备
                await this.getCameraList();
              }
          },
          immediate:true
      }
  },
  async created() {

  },
  methods: {
      //查询设备
      async getCameraList(){
          const {rows} = await listCamera({baseId:this.baseId});
          this.deviceList = rows;
      },
      //处理设备选择
      handleChangeDevice(){

          let list = this.deviceList.filter(item=>item.deviceId==this.deviceId);
          if(list.length==1){
            this.channelList = list[0].children.filter(item=>item.sipStatus==3);
          }
      },
      //处理摄像头选择
      handleChange(){
          //根据被选中的channel的id，从channel列表中获取deviceSipId和channelSipId
          let channel = this.channelList.filter(item=>item.channelSipId == this.channelSipId);
          if(channel.length=1){
              this.videoParam.deviceId = channel[0].deviceSipId;
              this.videoParam.channelId = channel[0].channelSipId;
          }
      }
  },
};
</script>
<style lang="scss" scoped>
.selectDevice{
    position: absolute;
    top:50px;
    right: 130px;
    z-index:10;
    width:110px;
    ::v-deep .el-input__inner {
        background:#214247;
        border:none;
    }
}
.selectChannel{
    position: absolute;
    top:50px;
    right: 15px;
    z-index:10;
    width:110px;
    ::v-deep .el-input__inner {
        background:#214247;
        border:none;
    }
}

</style>
