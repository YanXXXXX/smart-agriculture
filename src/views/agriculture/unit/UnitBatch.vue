<template>
  <div class="h100 overflow-auto">
        <div>
          <el-table :data="batchList" border stripe>
              <el-table-column
                  prop="batchName"
                  show-overflow-tooltip
                  label="批次名称">
              </el-table-column>
              <el-table-column
                  prop="germplasmName"
                  label="种植作物">
              </el-table-column>
              <el-table-column
                  prop="cropArea"
                  label="种植面积(亩)">
              </el-table-column>
              <!-- <el-table-column
                  prop="finish"
                  label="已完成">
              </el-table-column>
              <el-table-column
                  prop="total"
                  label="总计">
              </el-table-column> -->
              <el-table-column
                  prop="percent"
                  label="完成进度">
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right"  width="60" class-name="small-padding fixed-width">
                <template #default="{row}">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-eye"
                        @click="handleBatchTask(row)"
                    >查看</el-button>
                    </template>
            </el-table-column>
          </el-table>

        </div>
    <!-- 种植计划对话框 -->
    <el-dialog v-if="batchTask.open" :title="batchTask.title" :visible.sync="batchTask.open" width="1300px">
      <div style="height:500px;width:100%;overflow:auto;">
      <task :batchId="this.batchTask.batchId" :tableBorder="true" :mode="2"></task>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import { selectBatchList } from '@/api/agriculture/unit';
import  Task  from "../components/Task";
export default {
  name: '',
  mixins: [],
  components: {Task},
  props: {
    landId: Number,
    refresh:[String,Number]
  },
  data() {
    return {
      batchList: [],
      //种植计划
      batchTask:{
          open:false,
          title:'',
          batchId:null
      },
    };
  },
  computed: {},
  watch: {
    landId: {
      handler: function (n, o) {
        this.landId=n;
        this.getBatchList();
      },
    },
    refresh: {
      handler: function (n, o) {
        this.getBatchList();
      },
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    async getBatchList() {
      const { rows } = await selectBatchList(this.landId);
      this.batchList = rows;
    },
    /** 种植计划按钮操作 */
    handleBatchTask(row){
      this.batchTask.open=true;
      this.batchTask.title = row.batchName;
      this.batchTask.batchId = row.batchId;
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
