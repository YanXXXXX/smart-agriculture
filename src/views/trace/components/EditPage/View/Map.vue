<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
        <div class="ibox">
            <div class="ibox_t">产地地图</div>
            <div class="ibox_m">
                <div class="map_box">
                    <div class="con">
                        <b>{{data.data.name}}</b>
                        <span>{{data.data.address}}</span>
                    </div>
                    <div class="img">
                        <div id="Map" class="height-200 w100"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  mixins: [],
  components: {},
  props: ['data'],
  data() {
    return{
        mapData:this.data.data
    }
  },
  computed: {
      mapPosition(){
          const {position} = this.data.data;
          if(position && position.includes(',')){
              return position.split(',');
          }else{
              return [116.41,39.91];
          }
      },
      mapName(){
          const {name} = this.data.data;
          if(name){
              return name;
          }else{
              return '产地名称'
          }
      }
  },
  watch: {
      mapPosition(){
          this.map.destroy();
          this.initMap();
      },
      mapName(){
          this.map.destroy();
          this.initMap();
      },
  },
  created() {},
  mounted() {
      this.initMap();
  },
  destroyed() {},
  methods: {
    async initMap() {
      this.map = new this.AMap.Map("Map", {
        //设置地图容器id
        //pitch: 40,
        viewMode: "3D", //是否为3D地图模式
        zoom: 16, //初始化地图级别
        center:  this.mapPosition, //初始化地图中心点位置
        layers: [
        ],
      });
      this.map.add(new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: this.mapPosition,
        anchor:'bottom-center'
      }));
      this.map.add(new AMap.Text({
          position: this.mapPosition,
          text:this.mapName,
          offset:[20,-30]
      }));
    },
  },
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

        .map_box { position: relative; margin-bottom: 20 * $pcUnit;}
        .map_box .con { position: absolute; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.36); padding: 10 * $pcUnit 30 * $pcUnit 14 * $pcUnit 30 * $pcUnit; font-size: 32 * $pcUnit; color: #fff; line-height: 1.6; border-radius: 0 0 10 * $pcUnit 10 * $pcUnit; z-index: 10;}
        .map_box .con b { display: block; font-weight: normal; }
        .map_box .con span { display: block; padding-left: 40 * $pcUnit; background: url(~@/assets/images/trace/pos.png) left center no-repeat; background-size: 23 * $pcUnit auto; font-size: 24 * $pcUnit; }
        .map_box .img { position: relative; z-index: 1;}
        .map_box .img img { display: block; width: 100%; border-radius: 10 * $pcUnit; }
    }
     .mobileImain { padding: 10 * $mobileUnit 0;
        .ibox { border-radius: 10 * $mobileUnit; background: #fff; }
        .ibox_t { padding: 0 50 * $mobileUnit; line-height: 116 * $mobileUnit; font-size: 36 * $mobileUnit; color: #333333; position: relative;}
        .ibox_t:before { display: block; content: ''; position: absolute; left: 22 * $mobileUnit; top: 50%; width: 8 * $mobileUnit; height: 40 * $mobileUnit; border-radius: 4 * $mobileUnit; background: #41dca2; margin-top: -20 * $mobileUnit;}
        .ibox_m { padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit; }

        .map_box { position: relative; margin-bottom: 20 * $mobileUnit;}
        .map_box .con { position: absolute; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.36); padding: 10 * $mobileUnit 30 * $mobileUnit 14 * $mobileUnit 30 * $mobileUnit; font-size: 32 * $mobileUnit; color: #fff; line-height: 1.6; border-radius: 0 0 10 * $mobileUnit 10 * $mobileUnit; z-index: 10;}
        .map_box .con b { display: block; font-weight: normal; }
        .map_box .con span { display: block; padding-left: 40 * $mobileUnit; background: url(~@/assets/images/trace/pos.png) left center no-repeat; background-size: 23 * $mobileUnit auto; font-size: 24 * $mobileUnit; }
        .map_box .img { position: relative; z-index: 1;}
        .map_box .img img { display: block; width: 100%; border-radius: 10 * $mobileUnit; }
    }
</style>
