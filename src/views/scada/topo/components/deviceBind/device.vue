<template>
    <div>
        <el-form @submit.native.prevent :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="设备编号" prop="serialNumber">
                <el-input v-model="queryParams.serialNumber" placeholder="请输入设备编号" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" ref="table" :row-key="rowKey" :data="deviceList" @selection-change="handleSelectionChange" size="mini">
            <el-table-column :reserve-selection="true" type="selection" width="55" align="center" />
            <el-table-column label="设备名称" align="center" prop="deviceName" />
            <el-table-column label="设备编号" align="center" prop="serialNumber" />
            <el-table-column label="产品名称" align="center" prop="productName" />
            <el-table-column label="设备状态" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.iot_device_status" :value="scope.row.status" />
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { listDevice } from '@/api/iot/device';

export default {
    name: 'Device',
    dicts: ['iot_device_status'],
    data() {
        return {
            loading: true, // 遮罩层
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deviceName: '',
                serialNumber: '',
            },
            deviceList: [], // 设备表格数据
            total: 0, // 总条数
            selectDevices: [],
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        // 设备列表
        getList() {
            this.loading = true;
            listDevice(this.queryParams)
                .then((res) => {
                    if (res.code == 200) {
                        this.deviceList = res.rows.filter((item) => item.status !== 1 || item.status !== 2)
                                                  .map(item=>{
                                                      const {children,...rest}=item;
                                                      return rest;
                                                  });
                        this.total = res.total;
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        handleSelectionChange(selection) {
            this.selectDevices = selection;
        },
        selectRowDataClick() {
            return this.selectDevices.map((item) => item.serialNumber);
        },
        // 取消选择
        clearSelection() {
            this.$refs.table.clearSelection();
        },
        // 行数据的 Key，用来优化 Table 的渲染
        rowKey(row) {
            return row.serialNumber;
        },
    },
};
</script>
