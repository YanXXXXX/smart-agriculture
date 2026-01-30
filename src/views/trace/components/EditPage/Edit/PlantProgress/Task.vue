<template>
  <div class="container">
    <div class="table margin-top-20">
      <el-table
        v-loading="loading"
        :data="taskList"
        :border="tableBorder"
        @selection-change="handleChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="任务名称" align="center" prop="taskName" />
        <el-table-column label="负责人" align="center" prop="taskHeadName" />
        <el-table-column label="任务图片" align="center" prop="taskImages" >
            <template #default={row}>
                <el-image class="width-40 height-40" v-if="row.taskImages" :src="$baseUrl+row.taskImages.split(',')[0]" fit="fill" :lazy="true"></el-image>
                <span class="font-color-l4" v-else>暂无图片</span>
            </template>
        </el-table-column>
        <!-- <el-table-column
          label="计划开始日期"
          align="center"
          prop="planStart"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.planStart, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划结束日期"
          align="center"
          prop="planFinish"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.planFinish, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="实际开始日期"
          align="center"
          prop="actualStart"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.actualStart, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="实际结束日期"
          align="center"
          prop="actualFinish"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.actualFinish, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
         <el-table-column label="任务详情" align="center" prop="taskDetail" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
          <dict-tag
            :options="dict.type.agriculture_batch_task_status"
            :value="scope.row.status"
          />
        </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import {checkPermi} from '@/utils/permission';
import { listBatchTask,getBatchTask,addBatchTask,updateBatchTask, delBatchTask } from "@/api/agriculture/batchTask";
export default {
  name: "BatchTask",
  props: {
    batchId: [Number],
    tableBorder: {
      type: Boolean,
      default: false,
    },
  },
  dicts:['agriculture_batch_task_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      total: 0,
      // 批次任务表格数据
      taskList: [],
      //任务id
      taskId: null,
      //被选择的数据list
      dataList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        batchId: this.batchId,
      }
    };
  },
  watch: {
    batchId: {
      handler: function (n, o) {
        this.queryParams.batchId = n;
        this.getList();
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermi,
    /** 查询批次任务列表 */
    getList() {
      this.loading = true;
      listBatchTask(this.queryParams).then((response) => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 处理任务按钮 */
    handleTask(taskId) {
      this.taskId = taskId;
      this.oprType = 'update';
      this.open=true;
      this.title="编辑任务";
    },
    /** 处理多选 */
    handleChange(val){
        this.dataList = val.map(item=>({
            taskName:item.taskName,
            taskHeadName:item.taskHeadName,
            taskImage:item.taskImages?item.taskImages.split(',')[0]:'',
            remark:item.remark,
            actualStart:item.actualStart,
            actualFinish:item.actualFinish

        }));
        this.$emit('selection-change',JSON.parse(JSON.stringify(this.dataList)));
    }
  },
};
</script>
<style lang="scss" scoped>
.gantt-container {
  height: 100%;
  .table {
    background: #fff;
    padding: 0 10px;
    height: calc(100% - 70px - 70px);
  }
}

.pagination-container {
  height: 50px;
}
</style>
