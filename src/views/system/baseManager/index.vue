<template>
  <div class="app-container-sm">
    <el-card class="card-margin-bottom">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
        class="form-minus-bottom"
      >
        <el-form-item label="基地编号" prop="baseCode">
          <el-input
            v-model="queryParams.baseCode"
            placeholder="请输入基地编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="基地全称" prop="baseName">
          <el-input
            v-model="queryParams.baseName"
            placeholder="请输入基地全称"
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
        <el-form-item class="fr">
          <!-- <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['agriculture:baseinfo:add']"
            >新增</el-button
          > -->
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['agriculture:baseinfo:export']"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card-padding-bottom">
      <el-table v-loading="loading" :data="baseinfoList">
        <el-table-column label="基地简称" align="center" prop="baseShortName" />
        <el-table-column label="基地编号" align="center" prop="baseCode" />
        <el-table-column label="基地全称" align="center" prop="baseName" />
        <el-table-column label="基地负责人" align="center" prop="baseLeader" />
        <el-table-column
          label="基地负责人电话"
          align="center"
          prop="leaderTel"
        />
        <el-table-column
          label="基地负责人地址"
          align="center"
          prop="baseAddress"
        />
        <el-table-column label="基地面积" align="center" prop="baseArea" />
        <el-table-column label="基地海拔" align="center" prop="baseAltitude" />
        <!-- <el-table-column label="现场图片" align="center" prop="baseImg" />
        <el-table-column label="基地描述" align="center" prop="baseDes" /> -->
        <!-- <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="排序" align="center" prop="orderNum" /> -->
        <!-- <el-table-column
          label="${comment}"
          align="center"
          prop="baseCoordinate"
        />
        <el-table-column label="基地关联部门id" align="center" prop="deptId" /> -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="padding-5"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['agriculture:baseinfo:edit']"
              >修改</el-button
            >
            <el-select  clearable filterable class="width-100 margin-left-10" @change="login" placeholder="去登录" size="mini">
                <el-option v-for="item in scope.row.children"
                    :key="item.userName"
                    :label="item.nickName"
                    :value="item.userName">
                </el-option>
            </el-select>

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
    </el-card>
    <!-- 添加或修改基地信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="form"
      >
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="基地关联部门" prop="deptId">
               <treeselect  :disabled="true" v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
            <el-form-item label="基地简称" prop="baseShortName">
              <el-input
                v-model="form.baseShortName"
                placeholder="请输入基地简称"
              />
            </el-form-item>
            <el-form-item label="基地编号" prop="baseCode">
              <el-input v-model="form.baseCode" placeholder="请输入基地编号" />
            </el-form-item>
            <el-form-item label="基地负责人" prop="baseLeader">
              <el-input
                v-model="form.baseLeader"
                placeholder="请输入基地负责人"
              />
            </el-form-item>
            <el-form-item label="基地负责人电话" prop="leaderTel">
              <el-input
                v-model="form.leaderTel"
                placeholder="请输入基地负责人电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="基地全称" prop="baseName">
              <el-input v-model="form.baseName" placeholder="请输入基地全称" />
            </el-form-item>
            <el-form-item label="基地面积" prop="baseArea">
              <el-input v-model="form.baseArea" placeholder="请输入基地面积">
                <template slot="append">亩</template>
              </el-input>
            </el-form-item>
            <el-form-item label="基地海拔" prop="baseAltitude">
              <el-input
                v-model="form.baseAltitude"
                placeholder="请输入基地海拔"
              >
                <template slot="append">米</template>
              </el-input>
            </el-form-item>
            <el-form-item label="基地负责人地址" prop="baseAddress">
              <el-input
                v-model="form.baseAddress"
                placeholder="请输入基地负责人地址"
              />
            </el-form-item>
            <el-form-item label="基地坐标" prop="baseCoordinate">
              <point-select v-model="form.baseCoordinate" :isDrawLand="false"></point-select>
            </el-form-item>
          </el-col>
        </el-row>
       <el-form-item label="基地描述" prop="baseDes">
          <el-input
            v-model="form.baseDes"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="现场图片" prop="baseImg">
          <imageUpload v-model="form.baseImg" :fileSize="30" :limit="1" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectBaseinfoListByRolesForTable,
  getBaseinfo,
  delBaseinfo,
  addBaseinfo,
  updateBaseinfo,
} from '@/api/agriculture/baseinfo';
import { listDept,getDept} from "@/api/system/dept";
import PointSelect from '@/views/iot/device/components/PointSelect';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: 'Baseinfo',
  components: { PointSelect,Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 基地信息表格数据
      baseinfoList: [],
      // 部门信息树
      deptOptions:[],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        baseCode: null,
        baseName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        baseShortName: [
          { required: true, message: '基地简称不能为空', trigger: 'blur' },
        ],
        baseCode: [
          { required: true, message: '基地编号不能为空', trigger: 'blur' },
        ],
        baseName: [
          { required: true, message: '基地全称不能为空', trigger: 'blur' },
        ],
        baseLeader: [
          { required: true, message: '基地负责人不能为空', trigger: 'blur' },
        ],
        leaderTel: [
          {
            required: true,
            message: '基地负责人电话不能为空',
            trigger: 'blur',
          },
        ],
        baseAddress: [
          {
            required: true,
            message: '基地负责人地址不能为空',
            trigger: 'blur',
          },
        ],
        baseArea: [
          { required: true, message: '基地面积不能为空', trigger: 'blur' },
        ],
        baseAltitude: [
          { required: true, message: '基地海拔不能为空', trigger: 'blur' },
        ],
        baseImg: [
          { required: true, message: '现场图片不能为空', trigger: 'blur' },
        ],
        baseDes: [
          { required: true, message: '基地描述不能为空', trigger: 'blur' },
        ],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
        ],
        baseCoordinate: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        deptId: [
          {
            required: true,
            message: '基地关联部门id不能为空',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询基地信息列表 */
    getList() {
      this.loading = true;
      selectBaseinfoListByRolesForTable(this.queryParams).then((response) => {
        this.baseinfoList = response.rows;
        console.log(123,this.baseinfoList)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        baseId: null,
        baseShortName: null,
        baseCode: null,
        baseName: null,
        baseLeader: null,
        leaderTel: null,
        baseAddress: null,
        baseArea: null,
        baseAltitude: null,
        baseImg: null,
        baseDes: null,
        remark: null,
        status: '0',
        orderNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        baseCoordinate: null,
        deptId: null,
      };
      this.resetForm('form');
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
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加基地信息';
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const baseId = row.baseId || this.ids;
      getBaseinfo(baseId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = '修改基地信息';
      });
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.baseId != null) {
            updateBaseinfo(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addBaseinfo(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const baseIds = row.baseId || this.ids;
      this.$modal
        .confirm('是否确认删除基地信息编号为"' + baseIds + '"的数据项？')
        .then(function () {
          return delBaseinfo(baseIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'agriculture/baseinfo/export',
        {
          ...this.queryParams,
        },
        `baseinfo_${new Date().getTime()}.xlsx`
      );
    },
    /** 自动登录 */
    async login(e){
        await this.$store.dispatch('LogOut')
        await this.$store.dispatch("Login", {username:e,password:'autologin'})
        this.$router.replace({path:"/logining"});
    }
  },
};
</script>
