<template>
  <div>
      <device-view-tab :deviceId="deviceId" :grey="true" :no-padding="true">
          <template #p1="{device}">
              <bl-detail :device="device"></bl-detail>
          </template>
      </device-view-tab>
  </div>
</template>

<script>
import DeviceViewTab from '@/views/iot/device/components/DeviceViewTab'
import BlDetail from './BlDetail.vue'
export default {
  name: 'VenturiWm',
  mixins: [],
  components: {DeviceViewTab,BlDetail},
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
