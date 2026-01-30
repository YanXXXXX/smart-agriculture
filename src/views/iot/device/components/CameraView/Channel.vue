<template>
  <div class="margin-top-20">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" class="form-minus-bottom">
      <el-form-item label="通道ID" prop="channelSipId">
        <el-input
          v-model="queryParams.channelSipId"
          placeholder="请输入通道ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择设备状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sip_gen_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
        <el-form-item class="fr">
            <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['sip:channel:add']"
            >新增</el-button>
        </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="channelList" >
      <!-- <el-table-column label="租户名称" align="center" prop="tenantName" /> -->
      <!-- <el-table-column label="产品名称" align="center" prop="productName" /> -->
      <!-- <el-table-column label="用户ID" align="center" prop="userId" /> -->
      <!-- <el-table-column label="用户名称" align="center" prop="userName" /> -->
      <el-table-column label="设备ID" align="center" prop="deviceSipId" />
      <el-table-column label="通道ID" align="center" prop="channelSipId" />
      <el-table-column label="设备状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sip_gen_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="通道名称" align="center" prop="channelName" />
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="设备类型" align="center" prop="deviceType" /> -->
      <!-- <el-table-column label="通道类型" align="center" prop="channelType" /> -->
      <!-- <el-table-column label="城市编码" align="center" prop="citycode" /> -->
      <!-- <el-table-column label="行政区域" align="center" prop="civilcode" /> -->
      <el-table-column label="厂商名称" align="center" prop="manufacture" />
      <!-- <el-table-column label="产品型号" align="center" prop="model" /> -->
      <!-- <el-table-column label="设备归属" align="center" prop="owner" /> -->
      <!-- <el-table-column label="警区" align="center" prop="block" /> -->
      <!-- <el-table-column label="安装地址" align="center" prop="address" /> -->
      <!-- <el-table-column label="父级id" align="center" prop="parentid" /> -->
      <!-- <el-table-column label="设备入网IP" align="center" prop="ipaddress" /> -->
      <!-- <el-table-column label="设备接入端口号" align="center" prop="port" /> -->
      <!-- <el-table-column label="密码" align="center" prop="password" /> -->
      <!-- <el-table-column label="PTZ类型" align="center" prop="ptztype" /> -->
      <!-- <el-table-column label="PTZ类型描述字符串" align="center" prop="ptztypetext" /> -->
      <!-- <el-table-column label="设备经度" align="center" prop="longitude" /> -->
      <!-- <el-table-column label="设备纬度" align="center" prop="latitude" /> -->
      <el-table-column label="流媒体ID" align="center" prop="streamid"  show-overflow-tooltip/>
      <!-- <el-table-column label="子设备数" align="center" prop="subcount" /> -->
      <!-- <el-table-column label="是否有子设备" align="center" prop="parental" /> -->
      <!-- <el-table-column label="是否含有音频" align="center" prop="hasaudio" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            class="padding-5"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            :disabled="scope.row.status==3"
            v-hasPermi="['sip:channel:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
<!-- 弹窗 -->
   <el-dialog  :title="title" :visible.sync="open" width="450px" append-to-body>
        <el-form :model="createForm" :rules="rules" label-width="80px" ref="createForm">
            <el-form-item label="行政区划" prop="city" >
                <el-cascader class="w100" :options="cityOptions" v-model="createForm.city" @change="changeProvince" change-on-select>
                </el-cascader>
            </el-form-item>
            <el-form-item label="通道类型" prop="channelType" >
                <el-select class="w100" v-model="createForm.channelType" placeholder="请选择设备类型">
                    <el-option v-for="dict in dict.type.channel_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通道数量" prop="createNum">
                <el-input-number controls-position="right" v-model="createForm.createNum" placeholder="请输入生成通道数量" type="number" style="width:330px;" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">生 成</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { listChannel, addChannelToDevice, delChannel} from "@/api/iot/channel";
import {
    regionData,
    CodeToText
} from 'element-china-area-data'

export default {
  name: "Channel",
  dicts: ['sip_gen_status', 'video_type', 'channel_type'],
  props:{
      device:Object
  },
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
      // 监控设备通道信息表格数据
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        channelSipId: '',
        deviceSipId:'',
        status: null,
      },
      // 表单参数
        createForm: {
            city: '',
            channelType: '',
            createNum: 1,
            remark: '',
            area: '',
            productId:'',
            deviceName:'',
            tenantId:'',
            tenantName:'',
            deviceSipId:''

        },
        // 城市
        cityOptions: regionData,
        //校验
        rules: {
            city:[
                { required: true, message: '行政区划不能为空', trigger: 'blur' },
            ],
            channelType:[
                { required: true, message: '通道类型不能为空', trigger: 'blur' },
            ],
            createNum: [
                { required: true, message: '通道数量不能为空', trigger: 'blur' },
                { validator: (rule, value, callback) => {
                    if (value < 1) {
                        callback(new Error('至少生成一个通道'));
                    } else{
                        callback();
                    }
                }, trigger: 'blur' }
            ]
        }

    };
  },
  watch: {
    device:{
        handler:function(n,o){
            //按设备deviceSipId查询通道
            this.queryParams.deviceSipId=n?.serialNumber;
            this.getList();
            //给sipChannel赋值
            this.createForm.productId =n?.productId;
            this.createForm.deviceName=n?.deviceName;
            this.createForm.deviceSipId=n?.serialNumber;

        },
        immediate:true,
        deep:true
    }
  },
  methods: {
    /** 查询监控设备通道信息列表 */
    getList() {
      this.loading = true;
      listChannel(this.queryParams).then(response => {
        this.channelList = response.rows;
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

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加监控设备通道信息";
    },
    /** 提交按钮 */
    submitForm() {
        this.$refs['createForm'].validate(async(valid) => {
            if(valid){
            //11 01 01 00   00                           132                     0
            //省 市 区 基层  行业编码，00代表社会治安路面接入   类型编码比较重要不能选错    后面有七位，第一位就固定为0，后面redis生成

            this.createForm.channelSipId = this.createForm.city[2] + "0000" + this.createForm.channelType + "0";
            await addChannelToDevice(this.createForm.createNum, this.createForm);
            this.open=false;
            this.getList();
            }
        })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除监控设备通道信息编号为"' + ids + '"的数据项？').then(function() {
        return delChannel(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 行政区划改变 **/
    changeProvince(data) {
        if (data && data[0] != null && data[1] != null && data[2] != null) {
            const str = CodeToText[data[0]] + '/' + CodeToText[data[1]] + '/' + CodeToText[data[2]];
            this.createForm.citycode = str;
        }
    },
  }
};
</script>
