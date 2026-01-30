<template>
  <div class=" flex aic h100 overflow-auto">
      <template v-if="landList.length>0">
        <div v-for="(item,index) in landList"  @click="ocClick(item,index)"  :key="index" :class="index==currentIndex?'active':'inActive'"  class="border-radius-5 padding-lr-15 padding-tb-7 cursor-pointer margin-left-10 h70 width-130 flex fdc jcsb flexnone ">
            <div class="font-size-14 flex jcsb">
                <el-tooltip class="item" effect="light" :content="item.landName" placement="top-start">
                    <span>{{item.landName.substring(0,5)}}</span>
                </el-tooltip>
                <i @click.stop="dbClick(item,index)" class="el-icon-s-tools"></i>
                </div>
            <div class="font-size-12">总面积：{{item.landArea}}亩</div>
        </div>
      </template>
      <template v-else>
          <div class="margin-left-20 font-color-l3">暂无地块数据</div>
      </template>
  </div>
</template>

<script>
import {listLand} from '@/api/agriculture/land'
export default {
  name: '',
  mixins: [],
  components: {},
  props: {
      baseId:Number
  },
  data() {
    return{
        landList:[],
        currentIndex:0
    }
  },
  computed: {},
  watch: {
      baseId(){
          this.getLandList();
      },
  },
  mounted() {},
  destroyed() {},
  methods: {
      async getLandList(){
          const {rows}= await listLand({baseId:this.baseId});
          this.landList = rows;
          this.$emit('ocClick',rows[this.currentIndex]);
      },
      ocClick(item,index){
          this.$emit('ocClick',item);
          this.currentIndex = index;
      },
      dbClick(item,index){
          this.$emit('dbClick',item);
      }
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/element-variables.scss'; // ruoyi css
.active{
    background-color: $--color-primary;
    color:#fff;
}
.inActive{
    // border-left:2px solid $--color-primary;
    color:#363636;
    background-color:#f3f3f3;
}
.el-icon-s-tools:hover{
    color:$--color-warning;
}
</style>
