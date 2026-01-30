<template>
    <div class="industrialBase">
        <LayOut :baseId="baseId" :title="title">
            <template v-slot:two>
                <base-info :baseId="baseId"></base-info>
            </template>
            <template v-slot:three>
                <product-prices :baseId="baseId"></product-prices>
            </template>
            <template v-slot:four>
                <farm-task :baseId="baseId" @show="show=true"></farm-task>
            </template>
            <template v-slot:five>
                <plant-area :baseId="baseId"></plant-area>
            </template>
            <template v-slot:six>
                <intelligent-devices :baseId="baseId"></intelligent-devices>
            </template>
        </LayOut>
        <el-dialog :visible.sync="show" width="60%" custom-class="taskDetail" :modal="false">
            <div slot="title">农事任务</div>
            <task :baseId="baseId"></task>
        </el-dialog>
    </div>
</template>

<script>
import LayOut from "../layOut.vue";
import baseInfo from './baseInfo.vue';
import productPrices from './productPrices.vue';
import farmTask from './farmTask.vue';
import plantArea from './plantArea.vue';
import intelligentDevices from './intelligentDevices.vue';
import task from "./task.vue"
export default {
    components: {
        LayOut,baseInfo,productPrices,farmTask,plantArea,intelligentDevices,task
    },
    props: {
      baseId:Number
   },
    data() {
        return {
            title: [
                "基地概况",
                "农产品价格",
                "农事任务",
                "种植批次统计",
                "智能设备",
            ],
            show:false,
        };
    },
    watch:{
      baseId:{
          handler:function(n){
          },
          immediate:true
      }
  },
};
</script>

<style lang="scss" scoped>
.industrialBase::v-deep{
    height: 100%;
    width: 100%;
    .taskDetail{
        .el-dialog__header{
            background: #0B2439;
            color: #fff;
        }
        .el-dialog__body{
            background: #0B2439;
        }
    }
}
</style>
