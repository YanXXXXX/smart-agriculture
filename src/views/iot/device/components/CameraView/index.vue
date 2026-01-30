<template>
  <div>
    <device-view-tab
      :deviceId="deviceId"
      :grey="true"
      :cfg="cfg"
      :no-padding="true"
    >
      <template #p1="{device}">
          <camera :device="device" ></camera>
      </template>
      <template #p2="{device}">
          <channel class="margin-lr-20" v-if="device.deviceType==3" :device="device"></channel>
          <ys-channel class="margin-lr-20" v-if="device.deviceType==4" :device="device"></ys-channel>
      </template>
      <template #p5="{device}">
          <record :device="device"></record>
      </template>
    </device-view-tab>
  </div>
</template>

<script>
import DeviceViewTab from '@/views/iot/device/components/DeviceViewTab';
import camera from './Camera.vue'
import channel from './Channel.vue'
import ysChannel from './ysChannel.vue'
import record from './Record.vue'
export default {
  name: 'VenturiWm',
  mixins: [],
  components: { DeviceViewTab,camera ,channel,ysChannel,record},
  props: {
    deviceId: [Number, String],
  },
  data() {
    return {
      //配置device-view-tab的页签
      cfg: [
        { show: true, name: '监控直播' },
        { show: true, name: '设备通道' },
        { show: false, name: '设备用户' },
        { show: true, name: '设备日志' },
        { show: true, name: '监控录像' },
        { show: false, name: '' },
      ],
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
</style>
