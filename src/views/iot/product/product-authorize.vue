<template>
<div class="padding-left-20">
    <el-alert class="margin-bottom-20" title="未使用授权码所有设备都可以使用，已绑定的只能绑定备使用，点击生成密码查看授权加密的mqtt密码" type="warning" effect="light" show-icon closable></el-alert>

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="设备编号" prop="serialNumber">
            <el-input v-model="queryParams.serialNumber" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="授权码" prop="authorizeCode">
            <el-input v-model="queryParams.authorizeCode" placeholder="请输入授权码" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
                <el-option v-for="dict in dict.type.iot_auth_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:authorize:add']">生成授权码</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['iot:authorize:remove']">批量删除</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['iot:authorize:export']">导出</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-link type="info" style="padding-top:5px" :underline="false">Tips：双击可以复制授权码。</el-link>
        </el-col>
    </el-row>

    <el-table v-loading="loading" :data="authorizeList" @selection-change="handleSelectionChange" @cell-dblclick="celldblclick" size="small">
        <el-table-column type="selection" :selectable="selectable" width="55" align="center" />
        <el-table-column label="授权码" width="320" align="center" prop="authorizeCode" />
        <el-table-column label="状态" align="center" prop="active" width="100">
            <template slot-scope="scope">
                <dict-tag :options="dict.type.iot_auth_status" :value="scope.row.status" />
            </template>
        </el-table-column>
        <el-table-column label="设备编号" width="150" align="center" prop="serialNumber">
            <template slot-scope="scope">
                <el-link type="primary" @click="getDeviceBySerialNumber(scope.row.serialNumber)" :underline="false">{{scope.row.serialNumber}}</el-link>
            </template>
        </el-table-column>
        <el-table-column label="授权时间" align="center" prop="updateTime" width="180">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
            </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" type="warning" class="padding-5" icon="el-icon-s-ticket" @click="generatePassword(scope.row)" v-hasPermi="['iot:authorize:edit']" v-if="product.isAuthorize==1">生成密码</el-button>
                <el-button size="mini" type="primary"  plain class="padding-5" icon="el-icon-notebook-1" @click="handleUpdate(scope.row)" v-hasPermi="['iot:authorize:edit']">备注</el-button>
                <el-button size="mini" type="danger" class="padding-5" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:authorize:remove']" v-if="!scope.row.deviceId">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination class="margin-bottom-30" v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 设备授权和授权备注对话框 -->
    <el-dialog title="备注信息" :visible.sync="open" width="500px" append-to-body>
        <el-input v-model="form.remark" type="textarea" rows="4" placeholder="请输入内容" />
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>

    <!-- 设备详情对话框 -->
    <el-dialog title="设备详情" :visible.sync="openDevice" width="600px" append-to-body>
        <div v-if="device==null" style="text-align:center;"><i class="el-icon-warning" style="color:#E6A23C;"></i>  提示：查找不到设备，可能已经被删除</div>
        <el-descriptions border :column="2" size="medium" v-if="device!=null">
            <el-descriptions-item label="设备ID">{{device.deviceId}}</el-descriptions-item>
            <el-descriptions-item label="设备名称">{{device.deviceName}}</el-descriptions-item>
            <el-descriptions-item label="设备编号">{{device.serialNumber}}</el-descriptions-item>
            <el-descriptions-item label="设备状态">
                <!-- （1-未激活，2-禁用，3-在线，4-离线） -->
                <el-tag v-if="device.status==1" type="warning">未激活</el-tag>
                <el-tag v-else-if="device.status==2" type="danger">禁用</el-tag>
                <el-tag v-else-if="device.status==3" type="success">在线</el-tag>
                <el-tag v-else-if="device.status==4" type="info">离线</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="设备影子">
                <el-tag v-if="device.isShadow==1" type="success">启用</el-tag>
                <el-tag v-else type="info">未启用</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="定位方式">
                <!-- (1=ip自动定位，2=设备定位，3=自定义) -->
                <el-tag v-if="device.locationWay==1" type="success">自动定位</el-tag>
                <el-tag v-else-if="device.locationWay==2" type="warning">设备定位</el-tag>
                <el-tag v-else-if="device.locationWay==3" type="primary">自定义位置</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="产品名称">{{device.productName}}</el-descriptions-item>
            <el-descriptions-item label="租户名称">{{device.userName}}</el-descriptions-item>
            <el-descriptions-item label="固件版本">Version {{device.firmwareVersion}}</el-descriptions-item>
            <el-descriptions-item label="所在地址">{{device.networkAddress}}</el-descriptions-item>
            <el-descriptions-item label="设备经度">{{device.longitude}}</el-descriptions-item>
            <el-descriptions-item label="设备纬度">{{device.latitude}}</el-descriptions-item>
            <el-descriptions-item label="入网IP">{{device.networkIp}}</el-descriptions-item>
            <el-descriptions-item label="设备信号">{{device.rssi}}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{device.createTime}}</el-descriptions-item>
            <el-descriptions-item label="激活时间">{{device.activeTime}}</el-descriptions-item>
            <el-descriptions-item label="备注信息">{{device.remark}}</el-descriptions-item>
        </el-descriptions>
        <div slot="footer" class="dialog-footer">
            <el-button @click="openDevice=false">关 闭</el-button>
        </div>
    </el-dialog>
    <!-- 密钥弹窗 -->
    <el-dialog
        title="请复制密钥"
        :visible.sync="keyOpen"
        v-if="keyOpen"
        width="30%"
        @close="keyOpen=false">
        <div v-if="product.vertificateMethod!=2">
           <span>普通密码：</span>
           <span>{{password}}</span>
        </div>
        <div v-if="product.vertificateMethod!=1">
           <span>加密密码：</span>
           <span>{{enPassword}}</span>
        </div>
        <span slot="footer">
            <el-button @click=" keyOpen= false">关闭</el-button>
        </span>
    </el-dialog>

</div>
</template>
<script>
import { getDeviceBySerialNumber} from "@/api/iot/device";
import { listAuthorize,getAuthorize,delAuthorize,addProductAuthorizeByNum,updateAuthorize} from "@/api/iot/authorize";
import {generateAesKey} from "@/api/iot/product";
export default {
    name: "product-authorize",
    dicts: ['iot_auth_status', 'iot_device_status'],
    props: {
        product: {
            type: Object,
            default: null
        }
    },
    watch: {
        // 获取到父组件传递的productId后，刷新列表
        product: {
            handler:function (newVal, oldVal) {
                this.productInfo = newVal;
                if (this.productInfo && this.productInfo.productId != 0) {
                    this.queryParams.productId = this.productInfo.productId;
                    this.getList();
                }
            },
            immediate:true
        }
    },
    data() {
        return {
            // 设备信息
            device: {},
            // 设备信息对话框
            openDevice: false,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 产品授权码表格数据
            authorizeList: [],
            // 备注坛状
            open: false,
            // 新增授权码个数
            createNum: 10,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                authorizeCode: null,
                productId: null,
                deviceId: null,
                serialNumber: null,
                userId: null,
                userName: null,
                status: null,
            },
            // 表单参数
            form: {},
            // 产品
            productInfo: {},
            //普通授权密码
            password:'',
            //加密授权密码
            enPassword:'',
            //密钥弹窗
            keyOpen:false
        };
    },
    created() {

    },
    methods: {
        /**获取设备详情*/
        getDeviceBySerialNumber(serialNumber) {
            this.openDevice = true;
            getDeviceBySerialNumber(serialNumber).then(response => {
                this.device = response.data;
            });
        },
        /** 查询产品授权码列表 */
        getList() {
            this.loading = true;
            listAuthorize(this.queryParams).then(response => {
                this.authorizeList = response.rows;
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
                authorizeId: null,
                authorizeCode: null,
                productId: "",
                userId: "",
                deviceId: null,
                serialNumber: null,
                userName: null,
                delFlag: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null
            };
            this.device = {};
            this.resetForm("form");
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.authorizeId)
            this.multiple = !selection.length
        },
        /** 批量新增按钮操作 */
        handleAdd() {
            this.$prompt('', '输入授权码数量', {
                customClass: 'createNum',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[0-9\-]/,
                inputErrorMessage: '数量内容不正确',
                inputType: 'number',
                inputValue: this.createNum
            }).then(({
                value
            }) => {
                this.createNum = value
                if (this.queryParams.productId != null) {
                    let _addData = {
                        productId: this.queryParams.productId,
                        createNum: this.createNum
                    }
                    addProductAuthorizeByNum(_addData).then(response => {
                        this.$modal.msgSuccess("新增授权码成功");
                        this.getList();
                        this.createNum = 10;
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消新增'
                });
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const authorizeId = row.authorizeId || this.ids
            getAuthorize(authorizeId).then(response => {
                this.form = response.data;
                this.open = true;
            });
        },
        /** 提交按钮 */
        submitForm() {
            updateAuthorize(this.form).then(response => {
                this.$modal.msgSuccess("备注成功");
                this.open = false;
                this.getList();
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const authorizeIds = row.authorizeId || this.ids;
            this.$modal.confirm('确定删除？').then(function () {
                return delAuthorize(authorizeIds);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('iot/authorize/export', {
                ...this.queryParams
            }, `${this.product.productName}产品授权码-${new Date().getTime()}.xlsx`)
        },
        /** 禁用有绑定设备的复选框 */
        selectable(row) {
            return row.deviceId != null ? false : true;
        },
        /** 表格增加复制功能 */
        celldblclick(row, column, cell, event) {
            this.$copyText(row[column.property]).then(e => {
                this.$notify({
                title: '成功',
                message: '复制成功！',
                type: 'success',
                offset: 50,
                duration: 2000
            })
            }, function (e) {
                this.$notify({
                title: '失败',
                message: '复制失败！',
                type: 'error',
                offset: 50,
                duration: 2000
            })
            })
        },
        /** 生成加密模式密码 */
        async generatePassword(row){
            //简单模式
            if(this.product.vertificateMethod==1){
                this.password=`${this.product.mqttPassword}&${row.authorizeCode}`;
                this.keyOpen=true;
            }

            //加密模式
            if(this.product.vertificateMethod==2){
                const {data} = await generateAesKey(row.productId,row.authorizeId);
                this.enPassword = data;
                this.keyOpen=true;
            }
            //简单+加密
            if(this.product.vertificateMethod==3){
                const {data} = await generateAesKey(row.productId,row.authorizeId);
                this.enPassword = data;
                this.password=`${this.product.mqttPassword}&${row.authorizeCode}`;
                this.keyOpen=true;
            }
        }
    }
};
</script>
