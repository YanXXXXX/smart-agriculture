<template>
<div style="padding:6px;">
    <el-card style="margin-bottom:15px;" class="box-card" v-if="!isGeneralUser">
        <div slot="header" class="clearfix">
            <span>流媒体服务器配置</span>
            <el-button style="float: right;" type="primary" size="small" @click="submitMediaForm" v-hasPermi="['iot:video:edit']">保存</el-button>
        </div>
        <el-form :model="form" :rules="rules" label-width="160px" size="mini" ref="form">
            <el-row :gutter="80">
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="使能开关" prop="enabled">
                        <el-switch v-model="form.enabled" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="流媒体密钥" prop="secret">
                        <template #label>
                            <span>流媒体密钥</span>
                            <el-tooltip  effect="dark" placement="top" class="margin-left-3">
                                <i class="el-icon-question"/>
                                <div slot="content">
                                   zlmediaAPI密钥
                                </div>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.secret" placeholder="请输入流媒体密钥"/>
                    </el-form-item>
                    <el-form-item label="播放协议" prop="protocol">
                        <el-select v-model="form.protocol"  class="w100">
                            <el-option key="http" label="http" value="http"></el-option>
                            <el-option key="https" label="https" value="https"></el-option>
                            <!-- <el-option key="ws" label="ws" value="ws"></el-option>
                            <el-option key="rtmp" label="rtmp" value="rtmp"></el-option>
                            <el-option key="rtsp" label="rtsp" value="rtsp"></el-option> -->
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="" prop="ip">
                         <template #label>
                            <span>服务器IP</span>
                            <el-tooltip  effect="dark" placement="top" class="margin-left-3">
                                <i class="el-icon-question"/>
                                <div slot="content">
                                   设备推流IP地址
                                </div>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.ip" placeholder="请输入服务器IP" />
                    </el-form-item>
                    <el-form-item label="" prop="rtpPortRange">
                        <template #label>
                            <span>rtp推流端口范围</span>
                            <el-tooltip  effect="dark" placement="top" class="margin-left-3">
                                <i class="el-icon-question"/>
                                <div slot="content">
                                   设备推流端口范围
                                </div>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.rtpPortRange" placeholder="使用英文逗号分隔" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="" prop="domain">
                        <template #label>
                            <span>视频播放域名</span>
                            <el-tooltip  effect="dark" placement="top" class="margin-left-3">
                                <i class="el-icon-question"/>
                                <div slot="content">
                                   http协议播放可以填写IP地址，但是https播放必须填写域名
                                </div>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.domain" placeholder="请输入服务器域名" />
                    </el-form-item>
                    <el-form-item label="http端口" prop="portHttp">
                        <el-input v-model="form.portHttp" placeholder="请输入http端口" type="number" />
                    </el-form-item>
                    <el-form-item label="https端口" prop="portHttps">
                        <el-input v-model="form.portHttps" placeholder="请输入https端口" type="number" />
                    </el-form-item>
                    <!-- <el-form-item label="ws端口" prop="portWs">
                        <el-input v-model="form.portWs" placeholder="请输入ws端口" type="number" />
                    </el-form-item>
                    <el-form-item label="rtmp端口" prop="portRtmp">
                        <el-input v-model="form.portRtmp" placeholder="请输入rtmp端口" type="number" />
                    </el-form-item>
                    <el-form-item label="rtsp端口" prop="portRtsp">
                        <el-input v-model="form.portRtsp" placeholder="请输入rtsp端口" type="number" />
                    </el-form-item> -->
                </el-col>
            </el-row>

        </el-form>
    </el-card>

</div>
</template>

<script>
import {
    getDeviceBySerialNumber,
} from "@/api/iot/device";
import {
    getmediaServer,
    updatemediaServer,
    addmediaServer
} from "@/api/iot/mediaServer";
import {
    regionData,
    CodeToText
} from 'element-china-area-data'
import {
    listChannel,
    getChannel,
    delChannel,
    addChannelToDevice,
} from "@/api/iot/channel";
import productList from "./product-list"
import deviceList from "./device-list"

export default {
    name: "Sip",
    dicts: ['sip_gen_status', 'video_type', 'channel_type'],
    components: {
        productList,
        deviceList
    },
    props: {
        product: {
            type: Object,
            default: null
        }
    },
    watch: {
    },
    data() {
        return {
            // 是否普通用户
            isGeneralUser: true,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // sipid表格数据
            sipidList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deviceSipId: null,
                deviceChannelId: null,
                status: null,
            },
            form: {},
            // 产品
            productInfo: {},
            // 城市
            cityOptions: regionData,
            city: '',
            // 表单校验
            rules: {
                protocol: [{
                    required: true,
                    message: "默认播放协议不能为空",
                    trigger: "blur"
                }],
                ip: [{
                    required: true,
                    message: "服务器ip不能为空",
                    trigger: "blur"
                }],
                domain: [{
                    required: true,
                    message: "服务器域名不能为空",
                    trigger: "blur"
                }],
                secret: [{
                    required: true,
                    message: "流媒体密钥不能为空",
                    trigger: "blur"
                }],
                portHttp: [{
                    required: true,
                    message: "http端口不能为空",
                    trigger: "blur"
                }],
                portHttps: [{
                    required: true,
                    message: "https端口不能为空",
                    trigger: "blur"
                }],
                portWs: [{
                    required: true,
                    message: "ws端口不能为空",
                    trigger: "blur"
                }],
                portRtmp: [{
                    required: true,
                    message: "rtmp端口不能为空",
                    trigger: "blur"
                }],
                portRtsp: [{
                    required: true,
                    message: "rtsp端口不能为空",
                    trigger: "blur"
                }],
                rtpPortRange: [{
                    required: true,
                    message: "rtp端口范围不能为空",
                    trigger: "blur"
                }],
                delFlag: [{
                    required: true,
                    message: "删除标志不能为空",
                    trigger: "blur"
                }],
                createBy: [{
                    required: true,
                    message: "创建者不能为空",
                    trigger: "blur"
                }],
                createTime: [{
                    required: true,
                    message: "创建时间不能为空",
                    trigger: "blur"
                }],
            }
        };
    },
    created() {
        // 普通用户只能查看自己的通道
        if (this.$store.state.user.roles.indexOf("general") === -1) {
            this.isGeneralUser = false;
            this.getMediaUpdate();
        }
    },
    methods: {
        /** 修改流媒体服务器按钮操作 */
        getMediaUpdate() {
            getmediaServer().then(response => {
                this.form = response.data;
            });
        },
        /** 提交流媒体服务器按钮 */
        submitMediaForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updatemediaServer(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                        });
                    } else {
                        addmediaServer(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.form = response.data;
                        });
                    }
                }
            });
        },
        /**获取设备详情*/
        getDeviceBySerialNumber(serialNumber) {
            this.openDevice = true;
            getDeviceBySerialNumber(serialNumber).then(response => {
                this.device = response.data;
            });
        }
    }
};
</script>
