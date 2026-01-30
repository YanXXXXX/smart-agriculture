<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
        <template v-if="data.data.length>0">
            <a v-for="(item,index) in data.data" :key="index" :href="item.link" target="_blank" rel="noopener noreferrer">
                <div class="fimg"><img :src="$baseUrl+item.url" /></div>
            </a>
        </template>
        <template v-else>
            <a href="http://www.frogny.cn/" target="_blank" rel="noopener noreferrer">
                <div class="fimg"><img src="@/assets/images/trace/7.jpg" /></div>
            </a>
        </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Brand',
  mixins: [],
  components: {},
  props: ['data'],
  data() {
    return {};
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
$pcUnit: 400px / 750;
$mobileUnit: 100vw / 750;
.pcImain {
    padding: 10 * $pcUnit 0;
    .fimg img { display: block; width: 100%; border-radius: 10 * $pcUnit; border: 2 * $pcUnit #fff solid; box-sizing: border-box; }
}
.mobileImain {
    padding: 10 * $mobileUnit 0;
    .fimg img { display: block; width: 100%; border-radius: 10 * $mobileUnit; border: 2 * $mobileUnit #fff solid; box-sizing: border-box; }
}
</style>
