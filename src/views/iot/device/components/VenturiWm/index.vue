<template>
  <div>
      <device-view-tab :deviceId="deviceId">
          <template #p1="{device}">
              <vm-detail :device="device"></vm-detail>
          </template>
      </device-view-tab>
  </div>
</template>

<script>
import DeviceViewTab from '@/views/iot/device/components/DeviceViewTab'
import VmDetail from './VmDetail.vue'
export default {
  name: 'VenturiWm',
  mixins: [],
  components: {DeviceViewTab,VmDetail},
  props: {
      deviceId:[Number,String]
  },
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
</style>
