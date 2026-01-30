<template>
  <div>
      <div class="width-330 border-radius-10 border-d8d8d8" style="background-color:#fbfafa">
          <div class="flex height-40 aic " style="border-bottom:1px solid #eee;" >
              <!-- <div class=" margin-left-5 width-30 height-30 border-radius-20 flex aic jcc" :style="{ backgroundColor: item.color }" >
                <svg-icon class="font-size-17 font-color-fff" :icon-class="item.modelIcon" ></svg-icon>
              </div> -->
              <span class="margin-left-10 font-size-14">{{item.name}}</span>
              </div>
          <div class="padding-5 height-260 overflow-auto">

              <el-form v-for="(arrayParam,index) in item.dataType.arrayParams" :key="index" label-width="120px" :inline="false" size="mini">
                  <el-form-item v-for="(param,index) in arrayParam" :key="index" >
                      <template #label>
                          <div class="flex aic">
                              <div @dblclick="dbClick(param)" class=" margin-left-5 width-20 height-20 border-radius-20 flex aic jcc" :style="{ backgroundColor: item.color }" >
                                <el-tooltip class="item" effect="dark" :content="param.id+','+param.dataType.type" placement="top-start">
                                    <svg-icon class="font-size-20 font-color-fff" :icon-class="param.modelIcon" ></svg-icon>
                                </el-tooltip>
                              </div>
                              <span class="margin-left-3 font-size-13" style="font-weight:none">{{param.name}}</span>
                          </div>
                      </template>
                    <basectl :item="param" :device="device" @mqttPublish="mqttPublish" ></basectl>
                  </el-form-item>
              </el-form>

          </div>
      </div>
  </div>
</template>

<script>
import basectl from './basectl.vue'
export default {
  name: 'aoctl',
  mixins: [],
  components: {basectl},
  props: {
      device:Object,
      item:Object
  },
  data() {
    return{}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
      mqttPublish(param){
          this.$emit('mqttPublish',param)
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
