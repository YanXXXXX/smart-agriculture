<template>
<el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
    <el-form ref="createForm" :model="createForm" :rules="rules"  label-width="100px">
        <el-form-item label="行政区划" prop="city">
            <el-cascader :options="cityOptions" class="w100" v-model="createForm.city" @change="changeProvince" change-on-select>
            </el-cascader>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="createForm.deviceType" class="w100" placeholder="请选择设备类型">
                <el-option v-for="dict in dict.type.video_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="通道类型" prop="channelType">
            <el-select v-model="createForm.channelType" class="w100" placeholder="请选择设备类型">
                <el-option v-for="dict in dict.type.channel_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="通道数量" prop="createNum">
            <el-input-number controls-position="right" class="w100" v-model="createForm.createNum" placeholder="请输入生成通道数量" type="number" style="width:220px;" />
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">生 成</el-button>
        <el-button @click="open = false;">取 消</el-button>
    </div>
</el-dialog>
</template>

<script>
import {regionData,CodeToText} from 'element-china-area-data'

import {addChannel} from "@/api/iot/channel";

export default {
    name: "sipid-dialog",
    dicts: ['video_type', 'channel_type'],
    props: {
        product: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            title: "生成设备编号和通道",
            // 总条数
            total: 0,
            // 打开选择产品对话框
            open: false,
            devsipid: "",
            createForm: {
                city: '',
                deviceType: '',
                channelType: '',
                createNum: 1,
            },
            // 城市
            cityOptions: regionData,
            city: '',
            cityCode: '',
            //校验
            rules: {
                city:[
                   { required: true, message: '行政区划不能为空', trigger: 'blur' },
                ],
                deviceType:[
                   { required: true, message: '设备类型不能为空', trigger: 'blur' },
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
    created() {

    },
    methods: {
        /** 行政区划改变 **/
        changeProvince(data) {
            if (data && data[0] != null && data[1] != null && data[2] != null) {
                const str = CodeToText[data[0]] + '/' + CodeToText[data[1]] + '/' + CodeToText[data[2]];
                this.createForm.citycode = str;
            }
        },
        /** 提交按钮 */
        submitForm() {
             this.$refs['createForm'].validate(async(valid) => {
                 if(valid){
                    this.createForm.productId = this.product.productId;
                    this.createForm.productName = this.product.productName;
                    this.createForm.tenantId = this.product.tenantId;
                    this.createForm.tenantName = this.product.tenantName;
                    //11 01 01 00   00                           132                     0
                    //省 市 区 基层  行业编码，00代表社会治安路面接入   类型编码比较重要不能选错    后面有七位，第一位就固定为0，后面redis生成
                    this.createForm.deviceSipId = this.createForm.city[2] + "0000" + this.createForm.deviceType + "0"
                    this.createForm.channelSipId = this.createForm.city[2] + "0000" + this.createForm.channelType + "0"
                    const {data} = await addChannel(this.createForm.createNum, this.createForm);
                    this.$modal.msgSuccess("已生成设备编号和通道");
                    this.devsipid = data;
                    this.confirmSelectProduct();
                 }
             })

        },
        /**触发提事件 */
        confirmSelectProduct() {
            this.open = false;
            this.$emit('addGenEvent', this.devsipid);
        }
    }
}
</script>

<style scoped>

</style>
