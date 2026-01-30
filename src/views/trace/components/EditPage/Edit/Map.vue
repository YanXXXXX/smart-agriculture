<template>
  <div class="margin-lr-30 margin-tb-20">
      <el-form label-width="100px" size="normal">
          <el-form-item >
              <template #label>
                  定位坐标
                  <el-tooltip content="到https://lbs.amap.com/tools/picker获取坐标，坐标格式：116.22,40.13" placement="top" effect="dark">
                      <i class="el-icon-info"></i>
                  </el-tooltip>

              </template>
              <el-input v-model="data.data.position" placeholder="格式：116.22,40.13" size="normal"></el-input>
          </el-form-item>
          <el-form-item >
              <template #label>
                  产地名称
                  <el-tooltip content="基地名称" placement="top" effect="dark">
                      <i class="el-icon-info"></i>
                  </el-tooltip>

              </template>
              <el-input v-model="data.data.name" placeholder="请输入名称" size="normal"></el-input>
          </el-form-item>
          <el-form-item >
              <template #label>
                  产地地址
                  <el-tooltip content="产地地址" placement="top" effect="dark">
                      <i class="el-icon-info"></i>
                  </el-tooltip>

              </template>
              <el-input v-model="data.data.address" placeholder="请输入地址" size="normal"></el-input>
          </el-form-item>
      </el-form>

  </div>
</template>

<script>
export default {
  name: 'Map',
  mixins: [],
  components: {},
  props: {
      data:{
          type:Object,
          default:()=>{}
      }
  },
  data() {
    return{
    }
  },
  computed: {},
  created() {
      //把data.data初始化的数组变成对象
      if(Array.isArray(this.data.data)){
          this.data.data={};
      }
  },
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
