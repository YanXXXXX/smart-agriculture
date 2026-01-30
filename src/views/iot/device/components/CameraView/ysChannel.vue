<template>
  <div class="margin-top-20">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px" class="form-minus-bottom">
      <el-form-item label="通道号" prop="channelNo">
        <el-input
          v-model="queryParams.channelNo"
          placeholder="请输入通道号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通道名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入通道名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="channelList" class="margin-top-20">
      <el-table-column label="设备序列号" align="center" prop="deviceSerial" />
      <el-table-column label="通道号" align="center" prop="channelNo" />
      <el-table-column label="通道名称" align="center" prop="channelName" />
     <el-table-column label="设备状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sip_gen_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片地址" align="center" prop="picUrl" /> -->
      <el-table-column label="是否加密" align="center" prop="isEncrypt" />
      <el-table-column label="视频质量" align="center" prop="videoLevel" />
      <el-table-column label="分享设备的权限字段" align="center" prop="permission" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listYsChannel } from "@/api/iot/ysChannel";

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
      // 萤石云设备通道表格数据
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceSerial: null,
        channelNo: null,
        channelName: null,
        status: null,
        picUrl: null,
        isEncrypt: null,
        videoLevel: null,
        permission: null,
        isAdd: null,
        orderNum: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询萤石云设备通道列表 */
    getList() {
      this.loading = true;
      this.queryParams.deviceSerial=this.device.serialNumber;
      listYsChannel(this.queryParams).then(response => {
        this.channelList = response.rows;
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
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('iot/channel/export', {
        ...this.queryParams
      }, `channel_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
