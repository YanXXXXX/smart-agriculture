<template>
  <div class="padding-20">
      <!-- <div class="flex jcc aic margin-tb-20 padding-bottom-10 font-size-12" style=" border-bottom:1px dashed #eee;color:#666;">
          请选择样式
      </div> -->
      <el-form label-width="100px" :inline="false" size="normal">
          <el-form-item >
              <template #label>
                文本内容
                <el-tooltip content="溯源的次数文本" placement="top" effect="dark">
                   <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <el-input v-model="text"></el-input>
          </el-form-item>
      </el-form>

  </div>
</template>

<script>
export default {
  name: 'TraceTime',
  mixins: [],
  components: {},
  props: {
    data: {
        type: Object,
        default: () => {}
    }
  },
  data() {
    return{
        text:this.data.data.text
    }
  },
  computed: {},
  watch:{
      text:{
          handler:function(n){
              this.text = n;
              this.data.data={text:this.text,times:''}
          }
      }
  },
  created() {

  },
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
