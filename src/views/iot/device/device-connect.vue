<template>
    <div>
        <el-alert class="margin-bottom-10" title="Tips：双击可以复制。" type="warning" effect="light" show-icon closable />
        <el-descriptions :column="1" border>
            <el-descriptions-item label="简单认证clientId" v-if="vertificateMethod != 2">
                <span @dblclick="celldblclick({ form, property: 'sClientId' })">{{ form.sClientId }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="加密认证clientId" v-if="vertificateMethod != 1">
                <span @dblclick="celldblclick({ form, property: 'eClientId' })">{{ form.eClientId }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="地址">
                <span @dblclick="celldblclick({ form, property: 'ipAddress' })">{{ form.ipAddress }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="账号" :span="2">
                <span @dblclick="celldblclick({ form, property: 'mqttAccount' })">{{ form.mqttAccount }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="简单认证密码" v-if="isAuthorize != 1 && vertificateMethod != 2">
                <span @dblclick="celldblclick({ form, property: 'sConnect' })">{{ form.sConnect }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="加密认证密码(动态生成，有效期三个小时)" v-if="isAuthorize != 1 && vertificateMethod != 1">
                <span @dblclick="celldblclick({ form, property: 'eConnect' })">{{ form.eConnect }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="密码" v-if="isAuthorize == 1">
                <span>设备开启授权，请到产品管理界面获取授权密码。</span>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>


<script>
import { getProduct, generateAesKey } from "@/api/iot/product";
import { getUserProfile } from "@/api/system/user.js";
export default {
    name: "connect-params-dialog",
    props: {
        device: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            user: null,
            productId: null,
            //产品认证方式 1=简单、2=加密、3=简单+加密
            vertificateMethod: null,
            //是否启用授权码（0-否，1-是）
            isAuthorize: null,
            //IP
            ipAddress: null,
            // 表单参数
            form: {
                sClientId: '',
                eClientId: '',
                ipAddress: '',
                mqttAccount: '',
                sConnect: '',
                eConnect: ''
            },
        };
    },
    created() {
        // 获取用户信息，再获取产品信息
        this.getUser();
    },
    methods: {
        /** 获取当前用户及产品 */
        async getUser() {
            const { data } = await getUserProfile();
            this.user = data;
            if (this.device != null) {
                this.productId = this.device.productId;
                this.getProduct();
            }
        },
        /** 获取产品信息 */
        getProduct() {
            getProduct(this.productId).then(response => {
                this.vertificateMethod = response.data.vertificateMethod;
                this.isAuthorize = response.data.isAuthorize;
                this.form.mqttAccount = response.data.mqttAccount;
                this.form.ipAddress = "mqtt://你的IP:1883";
                if (this.vertificateMethod == 1) {
                    this.form.sClientId = "S&" + this.device.serialNumber + "&" + this.device.productId + "&" + this.user.userId;
                } else if ((this.vertificateMethod == 2)) {
                    this.form.eClientId = "E&" + this.device.serialNumber + "&" + this.device.productId + "&" + this.user.userId;
                }else if ((this.vertificateMethod == 3)) {
                    this.form.sClientId = "S&" + this.device.serialNumber + "&" + this.device.productId + "&" + this.user.userId;
                    this.form.eClientId = "E&" + this.device.serialNumber + "&" + this.device.productId + "&" + this.user.userId;
                }
                if (this.vertificateMethod == 1) {
                    this.form.sConnect = response.data.mqttPassword;
                } else if (this.vertificateMethod == 2) {
                    this.generateAesKey();
                } else {
                    this.form.sConnect = response.data.mqttPassword;
                    this.generateAesKey();
                }
            });
        },
        //生成asc加密密钥
        async generateAesKey() {
            const { data } = await generateAesKey(this.productId, 0);
            this.form.eConnect = data;
        },
        /** 表格增加复制功能 */
        celldblclick({ form, property }) {
            this.$copyText(form[property]).then(() => {
                this.$notify({
                    title: '成功',
                    message: '复制成功！',
                    type: 'success',
                    offset: 50,
                    duration: 2000
                });
            }).catch(() => {
                this.$notify({
                    title: '失败',
                    message: '复制失败！',
                    type: 'error',
                    offset: 50,
                    duration: 2000
                });
            });
        }
    }
}
</script>

<style scoped></style>
