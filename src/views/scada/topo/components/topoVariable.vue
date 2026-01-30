<template>
    <div>
        <el-form @submit.native.prevent :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="设备编号" prop="serialNumber">
                <el-input v-model="queryParams.serialNumber" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-if="!multiple" ref="singleTable" v-loading="loading" :data="bDeviceRealDataList" @select="selectRow" size="mini">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column v-if="scadaType!=1" label="设备名称" align="center" prop="deviceName" />
            <el-table-column v-if="scadaType!=1" label="设备编号" align="center" prop="serialNumber" />
            <el-table-column label="变量名称" align="center" prop="modelName" />
            <el-table-column label="变量标识" align="center" prop="identifier" />
        </el-table>
        <el-table v-else ref="multipleTable" v-loading="loading" :data="bDeviceRealDataList" @selection-change="handleSelectionChange" size="mini">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column v-if="scadaType!=1" label="设备名称" align="center" prop="deviceName" />
            <el-table-column v-if="scadaType!=1" label="设备编号" align="center" prop="serialNumber" />
            <el-table-column label="变量名称" align="center" prop="modelName" />
            <el-table-column label="变量标识" align="center" prop="identifier" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { listDeviceThingsModel } from '@/api/scada/topo';

export default {
    name: 'TopoVariable',
    props: {
        deviceImei: String,
        multiple: Boolean, // 非多个禁用
        textStatic: String,
    },
    data() {
        return {
            loading: true, // 遮罩层
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                serialNumber: '',
                scadaGuid: this.$route.query.guid,
                productId:this.$route.query.productId,
            },
            bDeviceRealDataList: [], // 设备实时数据表格数据
            total: 0, // 总条数
            selectRowData: {}, // 单选数据
            selectRowsData: [], // 多选数据
            scadaType:this.$route.query.scadaType
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        // 查询设备实时数据列表
        getList() {
            this.loading = true;
            listDeviceThingsModel(this.queryParams)
                .then((res) => {
                    if (res.code == 200) {
                        this.bDeviceRealDataList = res.rows;
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
        // 单选
        selectRow(val, row) {
            this.$refs.singleTable.clearSelection();
            this.$refs.singleTable.toggleRowSelection(row, true);
            this.selectRowData = row;
        },
        // 单选回调
        selectRowDataClick() {
            return this.selectRowData;
        },
        // 多选回调
        selectRowsDataClick() {
            return this.selectRowsData;
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            if (this.textStatic == '') {
                this.selectRowsData = ['上传时间'];
            } else {
                this.selectRowsData = [];
            }
            selection.forEach((element) => {
                this.selectRowsData.push(element.modelName);
            });
        },
        // 取消选择 (外部调用)
        clearSelection() {
            const type = this.multiple ? 'multipleTable' : 'singleTable';
            this.$refs[type].clearSelection();
        },
    },
};
</script>

<style lang="scss" scoped></style>
