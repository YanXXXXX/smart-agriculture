<template>
  <div class="productInfo padding-20" >
      <el-form label-width="100px">
          <el-form-item>
            <template #label>
                选择产品
                <el-tooltip content="选择溯源的产品信息" placement="top" effect="dark">
                   <i class="el-icon-info"></i>
                </el-tooltip>

            </template>
            <el-select v-model="sellproId" @change="handleChange" filterable placeholder="请选择" clearable>
                <el-option
                v-for="item in sellproList"
                :key="item.id"
                :label="item.sellproName"
                :value="item.sellproId">
                </el-option>
            </el-select>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { listSellpro} from "@/api/trace/sellpro";
export default {
  name: 'ProductInfo',
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
        sellproList:[],
        sellproId:this.data.data.sellproId
    }
  },
  computed: {},
  watch: {},
  async created() {
      const {rows} = await listSellpro({pageNum:1,pageSize:20});
      this.sellproList = rows;
  },
  mounted() {},
  destroyed() {},
  methods: {
      handleChange(){
          const {sellproId,sellproList} = this;
          if(sellproId && sellproList.length>0){
            //找出被选择的产品的信息
            let _arr = this.sellproList.filter(item=>item.sellproId == sellproId);
            //去掉不需要的产品字段信息
            if(_arr.length>0){
                this.data.data = _arr.map(item=>({
                    sellproId:item.sellproId,
                    sellproName:item.sellproName,
                    remark:item.remark,
                    sellproArea:item.sellproArea,
                    sellproGuige:item.sellproGuige,
                    sellproImg:item.sellproImg,
                    sellproWeight:item.sellproWeight
                }))[0];
            }
          }
      }
  },
};
</script>
<style lang="scss" scoped>

</style>
