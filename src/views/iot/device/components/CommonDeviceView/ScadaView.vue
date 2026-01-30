<template>
  <div >
      <full-screen v-if="params.guid" :params="params"></full-screen>
      <el-empty v-else description="暂无组态，请到产品中设置组态"></el-empty>
  </div>
</template>

<script>
import FullScreen from '@/views/scada/topo/fullscreen.vue';
import {getScadaByProductId} from '@/api/scada/center'
export default {
  name: '',
  mixins: [],
  components: {FullScreen},
  props: {
      device:Object
  },
  data() {
    return{
        params:{
            guid:null,
            scadaType:1,
            serialNumber:null,
            productId:null,
            deviceName:null
        }
    }
  },
  computed: {},
  watch: {
      device:{
          handler:function(n,o){
              this.getScadaByProductId();
          }
      }
  },
  created() {

  },
  mounted() {

  },
  destroyed() {},
  methods: {
      async getScadaByProductId(){
          const {data} = await getScadaByProductId(this.device.productId)
          if(data?.guid){
            this.params.guid=data.guid,
            this.params.serialNumber=this.device.serialNumber
            this.params.productId = this.device.productId;
            this.params.deviceName = this.device.deviceName;
          }
      }
  },
};
</script>
<style lang="scss" scoped>
</style>
