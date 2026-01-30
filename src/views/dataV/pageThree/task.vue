<template>
  <div class="gantt-container">
    <div class="search">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="计划开始日期" prop="psr">
          <el-date-picker size="small" v-model="queryParams.psr" type="daterange" range-separator="-" start-placeholder="时间范围开始" value-format="yyyy-MM-dd" end-placeholder="时间范围结束">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="info" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" type="info" plain size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table v-loading="loading" element-loading-background="#263840" :data="taskList" :header-cell-style="{ background: '#092944', color: '#fff' }" :row-class-name="tableRowClassName" :cell-style="{ color: '#fff' }">
        <el-table-column label="批次名称" align="center" prop="batchName" />
        <el-table-column label="任务名称" align="center" prop="taskName" />
        <el-table-column label="计划开始日期" align="center" prop="planStart" width="180" />
        <el-table-column label="计划结束日期" align="center" prop="planFinish" width="180" />
        <el-table-column label="实际开始日期" align="center" prop="actualStart" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.actualStart?scope.row.actualStart:'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际结束日期" align="center" prop="actualFinish" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.actualFinish?scope.row.actualFinish:'/'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.agriculture_batch_task_status" :value="scope.row.status" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" :background="false" />
    </div>
  </div>
</template>

<script>
import { listBatchTask } from '@/api/agriculture/batchTask';
export default {
  name: 'BatchTask',
  props: {
    baseId: Number,
  },
  dicts: ['agriculture_batch_task_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 批次任务表格数据
      taskList: [],
      //任务id
      taskId: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: null,
        planStart: null,
        planStartStart: null,
        planStartEnd: null,
        planFinish: null,
        psr: null,
      },
    };
  },
  watch: {
    baseId: {
      handler: function (n) {
        if (n) {
          this.getList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    /** 查询批次任务列表 */
    async getList() {
      this.loading = true;
      const {
        queryParams: { psr },
      } = this;
      if (psr && Array.isArray(psr) && psr.length == 2) {
        this.queryParams.params = {
          planStartStart: psr[0],
          planStartEnd: psr[1],
        };
      }
      const response = await listBatchTask({
        baseId: this.baseId,
        ...this.queryParams,
      });
      this.taskList = response.rows;
      this.total = response.total;
      this.loading = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    tableRowClassName({ row, rowIndex }) {
      return 'even';
    },
  },
};
</script>
<style lang="scss" scoped>
$colorL1: #0c2438;
$colorL2: #092944;
$colorL3: #0d3758;
$colorL4: #132f41;
.gantt-container {
  height: 100%;
  .table {
    background: #0b2439;
    padding: 0 20px;
    height: calc(100% - 70px - 70px);
    .gantt {
      overflow: hidden;
      position: relative;
      height: 100%;
    }
    ::v-deep .el-table {
      .even {
        background: #132f41;
      }
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: rgba(0, 0, 0, 0) !important;
    }
  }
  .search {
    background: #0b2439;
    height: 70px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0px;
    z-index: 2;
    &::v-deep .el-form {
      color: #fff;
      .el-form-item__label {
        color: #b9dbea;
      }
      input {
        border: none;
        color: #fff;
      }
      .el-date-editor {
        border: none;
        color: #fff;
      }
      .el-input__inner,
      .el-range-input {
        background: #132f42;
      }
    }
  }
}

.pagination-container ::v-deep {
  height: 50px;
  background: #0b2439;
  .el-pagination {
    .el-pagination__total,
    .el-pagination__jump {
      color: #fff;
    }
    .el-input__inner,
    button,
    .el-pager .number,
    .el-icon {
      background: #132f42;
      color: #fff;
    }
    .el-pager li.active {
      font-weight: 900;
      font-size: 16px;
    }
    input {
      border: none;
      color: #fff;
    }
  }
}
.search ::v-deep .el-form-item {
  margin-bottom: 0;
}
.search ::v-deep .el-form {
  flex: 1;
}
</style>
