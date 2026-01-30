<template>
  <div>
    <LayOut :bg="bg" :title="title">
      <template v-slot:one>
        <top-center></top-center>
      </template>
      <template v-slot:two>
        <two-area></two-area>
      </template>
      <template v-slot:three>
        <support-level></support-level>
      </template>
      <template v-slot:four>
        <farmer-percent></farmer-percent>
      </template>
      <template v-slot:five>
        <five-area></five-area>
      </template>
      <template v-slot:six>
        <level-percent></level-percent>
      </template>
    </LayOut>
  </div>
</template>

<script>
import LayOut from '../layOut.vue';
import TopCenter from './TopCenter';
import TwoArea from './TwoArea';
import supportLevel from './supportlevel';
import farmerPercent from './farmerPercent.vue';
import levelPercent from './levelPercent.vue';
import FiveArea from './FiveArea.vue';
export default {
  components: {
    LayOut,
    TopCenter,
    TwoArea,
    supportLevel,
    farmerPercent,
    levelPercent,
    FiveArea,
  },
  data() {
    return {
      bg: require('../img/bg.png'),
      title: [
        '农民人均可收入',
        '支持水平',
        '带动农民占比',
        '科技支撑',
        '支持水平占比',
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
