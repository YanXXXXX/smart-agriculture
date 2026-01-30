<template>
  <div class="flex jcsb" style="height: 680px;">
    <div class="w68" style="overflow-y: scroll;padding: 0 10px;box-sizing: border-box;">
      <el-form class="taskInfo" label-position="top" ref="form" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="当前状态">
              <el-select v-model="form.status" @change="submitForm" style="margin-right: 10px;width: 100%;">
                <el-option label="未分配" value="0"></el-option>
                <el-option label="已分配" value="1"></el-option>
                <el-option label="进行中" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际开始时间">
              <el-date-picker v-model="form.actualStart" type="date" placeholder="实际开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
              :editable="false" :clearable="false" @change="submitForm" style="margin-right: 10px;width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际完成时间">
              <el-date-picker v-model="form.actualFinish" type="date" placeholder="实际完成时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" 
              :editable="false" :clearable="false" @change="submitForm" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人" prop="taskHead">
              <el-select v-model="form.taskHead" @change="submitForm" style="margin-right: 10px;width: 100%;">
                <el-option v-for="item in employeeList" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人员信息">
              <el-select v-model="selectEmployeeList" multiple collapse-tags placeholder="请选择"  @change="handleTaskEmployeeChange" style="width: 100%;">
                <el-option v-for="item in employeeList" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="任务信息">
              <el-input type="textarea" :rows="20" resize="none" v-model="form.remark" placeholder="" :maxlength="-1" 
              :show-word-limit="false" :autosize="{ minRows: 5, maxRows: 5 }" @blur="submitForm" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs v-model="activeName" class="margin-top-20;">
        <el-tab-pane name="costEmployee">
          <template #label> <i class="el-icon-user"></i> 人工工时 </template>
          <cost-employee :task-id="taskId" @log="getLoglist"></cost-employee>
          </el-tab-pane>
        <el-tab-pane name="costMachine"
          ><template #label> <i class="el-icon-truck"></i> 机械工时 </template>
            <cost-machine :task-id="taskId" @log="getLoglist"></cost-machine>
          </el-tab-pane>
        <el-tab-pane name="costMaterial"
          ><template #label>
            <i class="el-icon-suitcase-1"></i> 农资用量
          </template>
            <cost-material :taskId="taskId" @log="getLoglist"></cost-material>
          </el-tab-pane>
        <el-tab-pane name="annex"
          ><template #label> <i class="el-icon-paperclip"></i> 附件 </template>
            <div class="font-weight-bold">图片:</div>
            <image-upload class="margin-top-10" @change="submitForm" v-model="form.taskImages" :is-rectangle="true" :is-show-tip="false"></image-upload>
          <div class="font-weight-bold margin-top-10">视频:</div>
          <video-upload class="margin-top-10" v-model="form.taskVideos" @change="submitForm"></video-upload>
          </el-tab-pane
        >
      </el-tabs>
    </div>
    <div class="logInfo w30">
      <div class="title">操作日志</div>
      <ul class="list" v-if="logList.length>0">
        <li class="info" v-for="(item, index) in logList" :key="index">
          <div class="flex aic jcsb margin-bottom-10" >
            <div class="user">{{ item.operName }}</div>
            <div class="time">{{ item.createTime }}</div>
          </div>
          <div class="con">{{item.operDes}}</div>
        </li>
      </ul>
      <el-empty v-else description="暂无数据"></el-empty>
    </div>
    <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
  </div>
</template>
<script>
import {
  getBatchTask,
  addBatchTask,
  updateBatchTask,
} from "@/api/agriculture/batchTask";
import { listBatch } from "@/api/agriculture/batch";
import { listUser } from "@/api/system/user";
import { listLand } from "@/api/agriculture/land";
import { listLog,addLog } from "@/api/agriculture/log";
import { listData } from "@/api/system/dict/data";
import { listEmployee } from "@/api/agriculture/employee";
import { listTaskEmployee,addTaskEmployee,delTaskEmployeeByTaskIdAndEmployeeId} from "@/api/agriculture/taskEmployee";

import RadioSelect from "../RadioSelect";
import CalendarSelect from "../CalendarSelect";
import MultipleSelect from "../MultipleSelect";
import StatusSelect from "../StatusSelect";
import CostEmployee from "./CostEmployee.vue"
import CostMachine from './CostMachine.vue';
import CostMaterial from './CostMaterial.vue';
export default {
  name: "TaskDetail",
  components: { MultipleSelect, CalendarSelect, RadioSelect, StatusSelect,CostEmployee,CostMachine,CostMaterial},
  props: {
    taskId: {
      type: Number,
    },
    oprType: {
      type: String,
      default: "",
    },
    batchId: {
      type: Number,
    },
  },
  data() {
    return {
      activeName: "costEmployee",
      batchList: [],
      userList: [],
      landList: [],
      batchTaskStatusList: [],
      selectEmployeeList: [],
      employeeList: [],
      logList: [],
      remarkOpen: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        taskHead: [
          { required: true, message: "责任人不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    oprType: {
      handler: function (n, o) {
        if (n.includes("add")) {
          this.handleAdd();
        } else if (n.includes("update")) {
          this.handleUpdate();
        }
      },
      immediate: true,
    },
    'form.taskHead':{
        handler:function(n){
            console.log('taskHead',n)
            let arr = this.employeeList.filter(item=>item.employeeId==n);
            if(arr.length>0){
                this.form.taskHeadName = arr[0].employeeName;
            }
        }
    }
  },
  created() {
    this.getBatchList();
    this.getUserList();
    this.getLandList();
    this.getBatchTaskStatusList();
    this.getLoglist();
    this.getEmployeeList();
    this.getTaskEmployee();
  },
  methods: {
    /** 查询批次 */
    getBatchList() {
      listBatch().then((response) => {
        this.batchList = response.rows;
      });
    },
    /** 查询用户 */
    getUserList() {
      listUser().then((response) => {
        this.userList = response.rows;
      });
    },
    /** 查询雇员 */
    getEmployeeList() {
      listEmployee().then((response) => {
        this.employeeList = response.rows;
      });
    },
    /** 查询地块 */
    getLandList() {
      listLand().then((response) => {
        this.landList = response.rows;
      });
    },
    /** 查询taskEmployee */
    getTaskEmployee(){
      listTaskEmployee({taskId:this.taskId}).then(response=>{
        const { rows } = response;
        this.selectEmployeeList = rows.map(item=>item.employeeId);
      });
    },
    /** 查询任务日志 */
    getLoglist() {
      listLog({ taskId: this.taskId }).then((response) => {
        this.logList = response.rows;
      });
    },
    /** 查询字典agriculture_batch_task_status值  */
    getBatchTaskStatusList() {
      listData({ dictType: "agriculture_batch_task_status" }).then(
        (response) => {
          this.batchTaskStatusList = response.rows;
        }
      );
    },

    // 表单重置
    reset() {
      this.form = {
        taskId: null,
        batchId: null,
        taskName: null,
        planStart: null,
        planFinish: null,
        actualStart: null,
        actualFinish: null,
        taskDetail: null,
        taskImages: null,
        taskVideos: null,
        remark: null,
        status: "0",
        orderNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        userName: null,
        batchHead: null,
        batchHeadName:null
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加批次任务";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      const taskId = this.taskId;
      getBatchTask(taskId).then((response) => {
        this.form = response.data;
      });
    },
    /** 插入任务日志 */
    async addTaskLog(des){
        await addLog({ taskId: this.taskId,operDes:des });
        this.getLoglist()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.taskId != null) {
            updateBatchTask(this.form).then((response) => {
              this.addTaskLog('完善任务信息')
              this.$modal.msgSuccess("修改成功");
            });
          } else {
            addBatchTask(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
            });
          }
        }
      });
    },
    /** 处理任务雇员选择事件 */
    handleTaskEmployeeChange(e){
      const {type,value,values} = e;
      if(type === 'add'){
        addTaskEmployee({taskId:this.taskId,employeeId:value}).then(respose=>{
          this.addTaskLog("增加参与人员")
          this.$modal.msgSuccess("添加成功");
        });
      }else if(type === 'del'){
        delTaskEmployeeByTaskIdAndEmployeeId(this.taskId,value).then(respose=>{
            this.addTaskLog("删除参与人员")
          this.$modal.msgSuccess("删除成功");
        });
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.taskInfo::v-deep{
  .el-form-item{
    margin-bottom: 10px;
  }
  .el-form-item__label{
    padding: 0;
  }
}
.logInfo{
  height: 100%;
  overflow:auto;
  background: #FAFAFA;
  .title{
    background: #FAFAFA;
    position: sticky;
    top: 0;
    left: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .list{
    padding: 0 20px;
    box-sizing: border-box;
    margin: 0;
    list-style: none;
  }
  .info{
    margin-bottom: 10px;
    background: #fff;
    padding: 10px 20px;
    box-sizing: border-box;
    .user{
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
    .time{
      font-weight: 400;
      font-size: 12px;
      color: #999999;
    }
    .con{
      font-weight: 400;
      font-size: 14px;
      color: #555555;
    }
  }
}
::v-deep  .el-tabs__nav-wrap::after {
    height: 1px;
  }
</style>
