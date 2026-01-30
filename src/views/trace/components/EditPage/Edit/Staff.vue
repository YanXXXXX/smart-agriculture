<template>
  <div>
    <div
      class="flex jcc font-size-12 padding-bottom-10 margin-tb-18"
      style="border-bottom: 1px dashed #ddd; color: #666"
    >
      选择业务人员（可拖动排序）
    </div>
    <vuedraggable
      v-model="data.data"
      tag="ul"
      draggable="li"
      v-if="data.data && data.data.length > 0"
      class="data-list"
      :class="{ disable: data.tabType == 2 }"
    >
      <li v-for="(item, index) in data.data" :key="index">
        <div class="l-info">
            <p><span class="width-20 height-20 border-radius-10 flex jcc aic background-color-primary font-color-fff">{{ index + 1 }}</span></p>
          <div class="flex fdc">
              <span class="padding-top-5">姓名：{{item.staffName}}</span>
              <span class="padding-top-5">手机：{{item.staffTel}}</span>
              <span class="padding-top-5">职位：{{item.staffPosition}}</span>
              <span class="padding-top-5">描述：{{item.staffDes}}</span>
          </div>
          <!-- <p class="flex aic">
            <span>职位：</span>
            <el-input
              placeholder="请输入职位"
              v-model="item.staffPosition"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p>
          <p class="flex aic">
            <span>姓名：</span>
            <el-input
              placeholder="请输入姓名"
              v-model="item.staffName"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p>
          <p class="flex aic">
            <span>手机：</span>
            <el-input
              placeholder="请输入手机号"
              v-model="item.staffTel"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p>
          <p class="flex aic">
            <span>描述：</span>
            <el-input
              placeholder="请输入描述"
              v-model="item.staffDes"
              type="textarea"
              :rows="2"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p> -->
        </div>
        <span @click="remove(index)" class="el-icon-close"></span>
      </li>
    </vuedraggable>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="importItem"
      class="addButton"
    >
      导入业务人员
    </el-button>
    <!-- <div class="flex jcc">
        <el-button-group>
            <el-button type="primary" size="mini" @click="addItem">添加业务人员</el-button>
            <el-button type="primary" size="mini" plain @click="importItem">导入业务人员</el-button>
        </el-button-group>
    </div> -->
    <el-dialog
      title="业务人员"
      :visible.sync="dialogVisiable"
      v-if="dialogVisiable"
      width="50%"
      @close="dialogVisiable = false"
    >
      <el-card class="card-margin-bottom">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
          class="form-minus-bottom"
        >
          <el-form-item label="员工名称" prop="staffName">
            <el-input
              v-model="queryParams.staffName"
              placeholder="请输入员工名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card-padding-bottom">
        <el-table
          v-loading="loading"
          :data="staffList"
          @selection-change="handleSelectionChange"
          >>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            label="员工职位"
            align="center"
            prop="staffPosition"
          />
          <el-table-column label="员工名称" align="center" prop="staffName" />
          <el-table-column
            label="员工联系方式"
            align="center"
            prop="staffTel"
          />
          <el-table-column label="员工描述" align="center" prop="staffDes" />
          <!-- <el-table-column label="是否可用" align="center" prop="status" /> -->
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>
      <span slot="footer">
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listStaff } from '@/api/trace/staff';
import vuedraggable from 'vuedraggable';
export default {
  name: 'Staff',
  mixins: [],
  components: { vuedraggable },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisiable: false,
      // 溯源人员表格数据
      staffList: [],
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staffName: null,
        status: 0,
      },
      //选择的数据list
      dataList:[]
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /** 添加人员 */
    // addItem(){
    //     let data = {
    //     staffName: '',
    //     staffPosition: '',
    //     staffTel: '',
    //     staffDes: ''}
    //     this.data.data.push(data);
    // },
    /** 导入员工 */
    importItem() {
      this.dialogVisiable = true;
    },
    /** 移除人员 */
    remove(index){
        this.data.data.splice(index,1);
    },
    getList() {
      this.loading = true;
      listStaff(this.queryParams).then((response) => {
        this.staffList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    /** 多选操作 */
    handleSelectionChange(val) {
      this.dataList = val.map((item) => ({
        staffName: item.staffName,
        staffPosition: item.staffPosition,
        staffTel: item.staffTel,
        staffDes: item.staffDes,
      }));
    },
    /** 选择框确认操作 */
    confirm() {
        this.data.data = this.dataList;
        this.dialogVisiable = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.addButton {
  width: calc(100% - 20px);
  height: 34px;
  line-height: 34px;
  padding: 0;
  font-size: 12px;
  margin-left: 10px;
  margin-top: 10px;
}
.data-list {
  margin: 0;
  padding: 0 10px;
  overflow: auto;
  &::-webkit-scrollbar-thumb {
    background: #dbdbdb;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f6f6f6;
    border-radius: 10px;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  li {
    list-style: none;
    background: #f7f8f9;
    border-radius: 4px;
    padding: 6px 14px 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    &.disable div {
      pointer-events: none;
      user-select: none;
    }
    .l-info {
      font-size: 12px;
      width:200px;
      p {
        margin: 12px 0 0;
        white-space: nowrap;
        overflow: hidden;
        display: flex;
        .link {
          color: #1b8bff;
          cursor: pointer;
        }
        .text {
          white-space: nowrap;
          text-align: -webkit-auto;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .el-icon-close {
      color: #999;
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  }
}
</style>
