<template>
  <div>
      <!-- <venturi-wm v-if="productId == 100" :deviceId="deviceId"></venturi-wm>
      <bug-lamp v-if="productId == 101" :deviceId="deviceId"></bug-lamp> -->
      <camera-view v-if="isCamera=='1'" :deviceId="deviceId"></camera-view>
      <common-device-view v-else :deviceId="deviceId"></common-device-view>
  </div>
</template>

<script>
//设备组件
import BugLamp from '@/views/iot/device/components/BugLamp';
import VenturiWm from '@/views/iot/device/components/VenturiWm';
import CommonDeviceView from '@/views/iot/device/components/CommonDeviceView';
import CameraView from '@/views/iot/device/components/CameraView';
export default {
  name: '',
  mixins: [],
  components: {BugLamp,VenturiWm,CommonDeviceView,CameraView},
  props: {},
  data() {
    return{
        productId:null,
        deviceId:null,
        isCamera:0
    }
  },
  computed: {},
  watch: {},
  created() {
      this.deviceId = this.$route.query.deviceId;
      this.productId = this.$route.query.productId;
      this.isCamera = this.$route.query.isCamera;
      console.log(1223,this.isCamera);
    //   console.log(this.deviceId,this.productId)
  },
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
