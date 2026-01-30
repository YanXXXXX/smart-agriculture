<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
      <div class="ibox">
        <div class="ibox_t" >生长环境数据</div>
        <div class="ibox_m">
          <div class="szhjss">
            <div class="item" v-for="(item,index) in data.data" :key="index">
              <div class="img"><img :src="$baseUrl+item.url" /></div>
              <div class="con" :style="{color:item.color}">
                <p><b :style="{color:item.color}">{{item.value}}</b>{{item.unit}}</p>
                <span>{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlantEnv',
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
    .pcImain { padding: 10 * $pcUnit 0;
        .ibox { border-radius: 10 * $pcUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $pcUnit; line-height: 116 * $pcUnit; font-size: 36 * $pcUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $pcUnit; top: 50%; width: 8 * $pcUnit; height: 40 * $pcUnit; border-radius: 4 * $pcUnit; background: #41dca2; margin-top: -20 * $pcUnit;}
        .ibox_m { padding: 0 22 * $pcUnit 2 * $pcUnit 22 * $pcUnit; }

        .szhjss { padding:0 0 20 * $pcUnit 0; margin: 0 -22 * $pcUnit;}
        .szhjss .item { float: left; width: 50%; position: relative; height: 140 * $pcUnit; padding-left: 180 * $pcUnit !important; background-color: #fff !important; box-sizing: border-box;}
        .szhjss .item:nth-child(2n):before { display: block; content: ''; position: absolute; left: 0; top: 50%; width: 1 * $pcUnit; height: 60 * $pcUnit; background: #9a8e85; transform: translateY(-50%);}
        .szhjss .img { position: absolute; left: 40 * $pcUnit; top: 50%; transform: translateY(-50%);}
        .szhjss .img img { display: block; height: 94 * $pcUnit;width: 94 * $pcUnit; }
        .szhjss .con { padding: 22 * $pcUnit 0; color: #4e3829; font-size: 26 * $pcUnit; line-height: 34 * $pcUnit;}
        .szhjss .con p{ display: block; line-height: 52 * $pcUnit; margin: 0; padding: 0;}
        .szhjss .con p b { font-size: 50 * $pcUnit; color: #333333;}
        .szhjss:after { display: block; content: ''; clear: both;}
    }
    .mobileImain { padding: 10 * $mobileUnit 0;
        .ibox { border-radius: 10 * $mobileUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $mobileUnit; line-height: 116 * $mobileUnit; font-size: 36 * $mobileUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $mobileUnit; top: 50%; width: 8 * $mobileUnit; height: 40 * $mobileUnit; border-radius: 4 * $mobileUnit; background: #41dca2; margin-top: -20 * $mobileUnit;}
        .ibox_m { padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit; }

        .szhjss { padding:0 0 20 * $mobileUnit 0; margin: 0 -22 * $mobileUnit;}
        .szhjss .item { float: left; width: 50%; position: relative; height: 140 * $mobileUnit; padding-left: 180 * $mobileUnit; box-sizing: border-box;}
        .szhjss .item:nth-child(2n):before { display: block; content: ''; position: absolute; left: 0; top: 50%; width: 1 * $mobileUnit; height: 60 * $mobileUnit; background: #9a8e85; transform: translateY(-50%);}
        .szhjss .img { position: absolute; left: 40 * $mobileUnit; top: 50%; transform: translateY(-50%);}
        .szhjss .img img { display: block; height: 94 * $mobileUnit; width: 94 * $mobileUnit; }
        .szhjss .con { padding: 22 * $mobileUnit 0; color: #4e3829; font-size: 26 * $mobileUnit; line-height: 34 * $mobileUnit;}
        .szhjss .con p{ display: block; line-height: 52 * $mobileUnit; margin: 0; padding: 0;}
        .szhjss .con p b { font-size: 50 * $mobileUnit; color: #333333;}
        .szhjss:after { display: block; content: ''; clear: both;}
    }
</style>
