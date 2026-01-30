<template>
  <div>
      <div  class="inline-flex border-d8d8d8 border-radius-20 aic" >
            <div @dblclick="dbClick(item)" class="width-35 height-35 border-radius-20 flex aic jcc" :style="{ backgroundColor: item.color }" >
                 <el-tooltip class="item" effect="dark" :content="item.id+','+item.dataType.type" placement="top-start">
                      <svg-icon class="font-size-20 font-color-fff" :icon-class="item.modelIcon" ></svg-icon>
                </el-tooltip>
            </div>
            <span class="padding-lr-10 font-color-l1 font-size-14">{{ item.name }}</span>
            <span class="padding-right-10 font-color-l1 font-size-14">
                <span class="font-weight-bold font-size-17">{{ itemValue(item)}}</span>
                <span class="margin-left-5">{{ item.unit }}</span>
            </span>
        </div>
  </div>
</template>

<script>
export default {
  name: 'txt',
  mixins: [],
  components: {},
  props: {
      item:Object
  },
  data() {
    return{}
  },
  computed: {

  },
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
      itemValue(item){
          if(item.dataType.type=="decimal"||item.dataType.type=="integer"){
              return (item.value/item.dataType.step).toString();
          }
          else{
              return item.value || '--'
          }
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
