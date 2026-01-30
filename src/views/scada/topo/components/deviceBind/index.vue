<template>
    <div>
        <el-form @submit.native.prevent :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="设备编号" prop="serialNumber">
                <el-input v-model="queryParams.serialNumber" placeholder="请输入设备编号" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button icon="el-icon-plus" type="primary" size="mini" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="deviceBindList" size="mini">
            <el-table-column label="id" align="center" prop="id" width="80" />
            <el-table-column label="设备名称" align="center" prop="deviceName" />
            <el-table-column label="设备编号" align="center" prop="serialNumber" />
            <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                    <el-button style="color: #f56c6c" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog title="设备管理" :visible.sync="isDeviceDialog" width="800px" append-to-body :close-on-click-modal="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <device ref="device" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="isDeviceDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleSelectDevice">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Device from './device';
import { listDeviceBind, saveDeviceBind, removeDeviceBind } from '@/api/scada/topo';

export default {
    components: {
        Device,
    },
    name: 'DeviceBind',
    data() {
        return {
            loading: true, // 遮罩层
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                serialNumber: '',
                scadaGuid: this.$route.query.guid,
            },
            deviceBindList: [], // 关联设备表格数据
            total: 0, // 总条数
            isDeviceDialog: false, // 设备对话框
            serialNumbers: '', // 选中设备
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        // 查询云组态组件关联设备列表
        getList() {
            this.loading = true;
            listDeviceBind(this.queryParams)
                .then((res) => {
                    if (res.code == 200) {
                        this.deviceBindList = res.rows;
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
        // 新增按钮操作
        handleAdd() {
            this.isDeviceDialog = true;
            this.$refs.device && this.$refs.device.clearSelection();
        },
        // 选择设备
        handleSelectDevice() {
            this.isDeviceDialog = false;
            const list = this.$refs.device.selectRowDataClick();
            this.serialNumbers = list.join(',');
            this.saveBind();
        },
        saveBind() {
            let params = {
                scadaGuid: this.$route.query.guid,
                serialNumbers: this.serialNumbers,
            };
            saveDeviceBind(params)
                .then((res) => {
                    this.getList();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id;
            let that = this;
            this.$confirm('您是否确认移除此关联设备').then(function () {
                removeDeviceBind(ids)
                    .then((res) => {
                        if (res.code === 200) {
                            that.$modal.msgSuccess('移除成功');
                            that.getList();
                        }
                    })
                    .catch((err) => {
                        that.$modal.msgError(err);
                    });
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
