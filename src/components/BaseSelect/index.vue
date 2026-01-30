<template>
  <div class="display-inline">
      <el-form-item v-if="(type==1 &&(baseList.length>1)) || mustVisible" label="基地选择" :prop="prop" label-width="50">
        <el-select class="border-none w100" v-model="deptId" value-key="" placeholder="选择基地" @change="changeBase" filterable size="small">
            <el-option v-for="item in baseList"
                :key="item.deptId"
                :label="item.baseName"
                :value="item.deptId">
            </el-option>
        </el-select>
      </el-form-item>
      <template v-if="type==2 && (baseList.length>1)">
        <div class="baseBox" @click="open=true">
            {{currentBaseName||'选择基地'}}
        </div>
        <el-dialog
            title="选择基地"
            :visible.sync="open"
            append-to-body
            width="300px">
            <el-select class="border-none w100" v-model="deptId" value-key="" placeholder="选择基地" @change="changeBase" filterable size="small">
            <el-option v-for="item in baseList"
                :key="item.deptId"
                :label="item.baseName"
                :value="item.deptId">
            </el-option>
        </el-select>
        </el-dialog>
      </template>
  </div>
</template>

<script>
import {selectBaseinfoListByRoles} from "@/api/agriculture/baseinfo"
export default {
  name: '',
  mixins: [],
  components: {},
  props: {
      value:Number,
      //1 是下拉  2是悬浮
      type:{
          type:Number,
          default:1
      },
      //默认选择一个
      chooseOne:{
          type:Boolean,
          default:false
      },
      //必须显示
      mustVisible:{
          type:Boolean,
          default:false
      },
  },
  data() {
    return{
        deptId:null,
        baseList:[],
        currentBaseName:'',
        open:false
    }
  },
  computed:{
      //为了只有一个选项的时候重置按钮不清楚
      prop(){
          if(this.chooseOne || this.baseList.length==1){
              return ''
          }else{
              return 'baseId'
          }
      }
  },
  watch:{
      value(n){
        this.deptId=n;
      }
  },
  created() {
      this.getBaseList();
  },
  mounted() {},
  destroyed() {},
  methods: {
      async getBaseList(){
          const {data} = await selectBaseinfoListByRoles();
          this.baseList = data;
          if(this.baseList.length>0){
              if(this.type==2){
                  this.currentBaseName=this.baseList[0].baseName;
                  this.$emit('input',this.baseList[0].deptId);
              }
              if(this.chooseOne || this.baseList.length==1){
                  this.deptId = this.baseList[0].deptId;
                  this.$emit('input',this.baseList[0].deptId);
              }
          }
      },
      changeBase(e){
          this.currentBaseName=this.baseList.filter(item=>item.deptId==e)[0].baseName;
          this.$emit('input',e);
          this.open=false;
      }
  },
};
</script>
<style lang="scss" scoped>
.baseBox {
    position: absolute;
    bottom: calc(100vh / 2);
    right: 0px;
    z-index: 999;
    width: 20px;
    background: #2b7;
    color: #fff;
    padding: 10px 15px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    writing-mode: vertical-lr;
    letter-spacing: 4px;
    justify-content: center;
    align-items: center;
    font-size:14px;
    font-weight: bold;
    cursor: pointer;
    /* 添加透明度 */
    opacity: 0.8; /* 你可以根据需要调整这个值 */
    /* 添加阴影 */
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 你可以根据需要调整阴影的颜色和大小 */
}
</style>
