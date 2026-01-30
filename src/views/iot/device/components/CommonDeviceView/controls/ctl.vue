<template>
  <div>
        <div class="flex aic width-330 height-50 border-radius-10 border-d8d8d8" style="background-color:#fbfafa;">
            <div @dblclick="dbClick(item)" class="margin-lr-10 width-35 height-35 border-radius-30 flex aic jcc" :style="{ backgroundColor: item.color }" >
                <el-tooltip class="item" effect="dark" :content="item.id+','+item.dataType.type" placement="top-start">
                    <svg-icon class="font-size-20 font-color-fff" :icon-class="item.modelIcon" ></svg-icon>
                </el-tooltip>
            </div>
                <span class="font-size-14 margin-right-10 width-70">{{item.name}}</span>
                <div class="width-185">
                    <basectl :item="item" :device="device" @mqttPublish="mqttPublish" ></basectl>
                </div>
        </div>
  </div>
</template>

<script>
import basectl from './basectl.vue'
export default {
  name: 'ctl',
  mixins: [],
  components: {basectl},
  props: {
      item:Object,
      device:Object
  },
  data() {
    return{}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  destroyed() {},
  methods: {
      mqttPublish(item){
          this.$emit('mqttPublish',item)
      },
      dbClick(item){
          if(item.dataType.type=='decimal' || item.dataType.type=='integer'){
            this.$emit('dbClick',item.id);
          }
      }
  },
};
</script>
<style lang="scss" scoped>
</style>
