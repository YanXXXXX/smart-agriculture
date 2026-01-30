<template>
  <div>
      <device-view-tab :deviceId="deviceId" :cfg="cfg">
          <template #p1="{device}">
              <cd-detail class="margin-lr-20" :device="device"></cd-detail>
          </template>
          <template #p3="{device}">
            <scada-view :device="device"></scada-view>
          </template>
      </device-view-tab>
  </div>
</template>

<script>
import DeviceViewTab from '@/views/iot/device/components/DeviceViewTab'
import CdDetail from './CdDetail.vue'
import ScadaView from './ScadaView.vue'
export default {
  name: 'CommonDeviceView',
  mixins: [],
  components: {DeviceViewTab,CdDetail,ScadaView},
  props: {
      deviceId:[Number,String]
  },
  data() {
    return{
    //配置device-view-tab的页签
    cfg: [
        { show: true, name: '数据采集' },
        { show: true, name: '定时任务' },
        { show: true, name: '设备组态' },
        { show: true, name: '设备日志' },
        { show: true, name: '数据分析' },
        { show: false, name: '设备通道' },
      ],
      guid:null
    }
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
