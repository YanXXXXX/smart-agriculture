<template>
<div >
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="日志类型" prop="logType">
            <el-select v-model="queryParams.logType" placeholder="请选择类型" clearable size="small">
                <el-option v-for="dict in dict.type.iot_device_log_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="标识符" prop="identity">
            <el-input v-model="queryParams.identity" placeholder="请输入标识符" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="deviceLogList" size="mini">
        <el-table-column label="类型" align="center" prop="logType" width="150">
            <template slot-scope="scope">
                <dict-tag :options="dict.type.iot_device_log_type" :value="scope.row.logType" />
            </template>
        </el-table-column>
        <el-table-column label="模式" align="center" prop="logType" width="150">
            <template slot-scope="scope">
                <el-tag type="primary" v-if="scope.row.mode==1">影子模式</el-tag>
                <el-tag type="success" v-else-if="scope.row.mode==2">在线模式</el-tag>
                <el-tag type="info" v-else>其他信息</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="时间" align="center" prop="createTime" width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
            </template>
        </el-table-column>
        <el-table-column label="标识符" align="center" prop="identity" width="250" />
        <el-table-column label="动作" align="left" header-align="center" prop="logValue">
            <template slot-scope="scope">
                <div v-if="scope.row.logType==1 ||scope.row.logType==2||scope.row.logType==3">
                    {{'{'+`id:${scope.row.identity},value:${scope.row.logValue},remark:${scope.row.remark}`+'}'}}
                </div>
                <div v-if="scope.row.logType==4">
                    设备升级
                </div>
                <div v-if="scope.row.logType==5">
                    设备上线
                </div>
                <div v-if="scope.row.logType==6">
                    设备离线
                </div>
            </template>
        </el-table-column>

        <!-- <el-table-column label="备注" header-align="center" align="left" prop="remark">
            <template slot-scope="scope">
                {{scope.row.remark==null ?"无":scope.row.remark}}
            </template>
        </el-table-column> -->

    </el-table>
    <div style="height:40px;">
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>

</div>
</template>

<script>
import {
    listDeviceLog
} from "@/api/iot/deviceLog";

export default {
    name: "DeviceLog",
    dicts: ['iot_device_log_type', "iot_yes_no"],
    props: {
        device: {
            type: Object,
            default: null
        }
    },
    watch: {
        // 获取到父组件传递的device后，刷新列表
        device: function (newVal, oldVal) {
            this.deviceInfo = newVal;
            if (this.deviceInfo && this.deviceInfo.deviceId != 0) {
                this.queryParams.serialNumber = this.deviceInfo.serialNumber;
                this.getList();
                // 解析缓存物模型
                this.thingsModel = this.deviceInfo.cacheThingsModel;
            }
        }
    },
    data() {
        return {
            // 物模型
            thingsModel: {},
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 设备日志表格数据
            deviceLogList: [],
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                logType: null,
                logValue: null,
                deviceId: null,
                serialNumber: null,
                deviceName: null,
                identity: null,
                isMonitor: null,
            },
        };
    },
    created() {

    },
    methods: {
        /** 查询设备日志列表 */
        getList() {
            this.loading = true;
            listDeviceLog(this.queryParams).then(response => {
                this.deviceLogList = response.rows;
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
            this.download('iot/deviceLog/export', {
                ...this.queryParams
            }, `deviceLog_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
