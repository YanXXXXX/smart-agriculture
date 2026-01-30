<template>
    <div>
        <el-card class="margin-10">
            <el-tabs v-model="activeName"  tab-position="left" style="padding:10px;min-height:400px;">
                <el-tab-pane name="basic">
                    <span slot="label"><span style="color:red;">* </span>基本信息</span>
                    <el-alert class="margin-bottom-20" title="非授权模式请在此页面获取密码：简单授权使用简单mqtt密码，加密认证使用加密mqtt密码，加密认证mqtt密码请每次使用前重新获取,加密密码有效期为3小时！" type="warning" effect="light" show-icon closable></el-alert>
                    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                        <el-row :gutter="100">
                            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                                <el-form-item label="产品编号" prop="productId">
                                    <el-input v-model="form.productId" placeholder="自动生成" :disabled="true" readonly />
                                </el-form-item>
                                <el-form-item label="产品名称" prop="productName">
                                    <el-input v-model="form.productName" placeholder="请输入产品名称" :disabled="form.status==2" />
                                </el-form-item>
                                <el-form-item label="产品分类" prop="categoryId">
                                    <el-select v-model="form.categoryId" placeholder="请选择分类" @change="selectCategory" style="width:100%" :disabled="form.status==2">
                                        <el-option v-for="category in categoryShortList" :key="category.categoryId" :label="category.categoryName" :value="category.categoryId"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="设备类型" prop="deviceType">
                                    <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width:100%" :disabled="form.status==2">
                                        <el-option v-for="dict in dict.type.iot_device_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="联网方式" prop="networkMethod" >
                                    <el-select v-model="form.networkMethod" placeholder="请选择联网方式" style="width:100%;" :disabled="form.status==2">
                                        <el-option v-for="dict in dict.type.iot_network_method" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="备注信息" prop="remark">
                                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" rows="1" :readonly="form.status==2" :disabled="form.status==2"/>
                                </el-form-item>
                            </el-col>
                            <el-col v-show="form.deviceType==1 || form.deviceType==2" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                                <el-form-item label="启用授权" prop="networkMethod">
                                    <el-switch v-model="form.isAuthorize"  :active-value="1" :inactive-value="0"  :disabled="form.status==2"/>
                                    <span class="font-color-primary margin-left-10 cursor-pointer font-weight-bold" v-if="form.isAuthorize==1 && form.productId!=0" @click="activeName='productAuthorize'">获取授权模式密码</span>
                                </el-form-item>
                                <el-form-item label="认证方式" prop="vertificateMethod">
                                    <el-select v-model="form.vertificateMethod" placeholder="请选择认证方式" style="width:100%" :disabled="form.status==2">
                                        <el-option v-for="dict in dict.type.iot_vertificate_method" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Mqtt账号" prop="mqttAccount">
                                    <el-input v-model="form.mqttAccount" placeholder="不填自动生成" :disabled="form.status==2" >
                                    </el-input>
                                </el-form-item>
                                <el-form-item v-if="form.vertificateMethod!=2 && form.isAuthorize==0"  label="简单Mqtt密码" prop="mqttPassword">
                                    <el-input v-model="form.mqttPassword" placeholder="不填则自动生成" :disabled="form.status==2" >
                                    </el-input>
                                </el-form-item>
                                <!-- <el-form-item label="产品秘钥" prop="mqttSecret">
                                    <el-input v-model="form.mqttSecret" placeholder="自动生成" :disabled="true" readonly >
                                    </el-input>
                                </el-form-item > -->
                                <el-form-item label="加密Mqtt密码" v-if="form.vertificateMethod!=1 && form.isAuthorize==0">
                                    <el-input v-model="AESKey" placeholder="请生成mqtt加密密码" readonly size="medium" clearable  :disabled="form.productId==0">
                                        <template slot="append"><el-button type="primary" size="default" @click="generateAesKey">生成</el-button>
                                        </template>
                                    </el-input>

                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                                <el-form-item label="产品图片" prop="imgUrl">
                                    <template #label>
                                        <span>产品图片</span>
                                        <el-tooltip  effect="dark" placement="top" class="margin-left-3">
                                            <i class="el-icon-question"/>
                                            <div slot="content">
                                                第一张为产品图片，第二张为产品地图展示图片，第三张为产品APP菜单
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <imageUpload ref="image-upload" :file-type="['jpg','jpeg','png']" :disabled="form.status==2" v-model="form.imgUrl" :limit="form.status==2 ? 0 : 3" :fileSize="2"></imageUpload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item style="text-align: center;margin:40px 0px;">
                                    <el-button type="primary" @click="submitForm" v-hasPermi="['iot:product:edit']" v-show="form.productId!=0 && form.status!=2">修 改</el-button>
                                    <el-button type="primary" @click="submitForm" v-hasPermi="['iot:product:add']" v-show="form.productId==0 && form.status!=2">新 增</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="" name="things" :disabled="form.productId==0" v-if="form.deviceType==1 || form.deviceType==2">
                    <span slot="label"><span style="color:red;">* </span>产品模型</span>
                    <product-things-model ref="productThingsModel" :product="form" />
                </el-tab-pane>
                <el-tab-pane label="" name="productFirmware" :disabled="form.productId==0" v-if="form.deviceType==1 || form.deviceType==2">
                    <span slot="label">固件管理</span>
                    <product-firmware ref="productFirmware" :product="form" />
                </el-tab-pane>

                <el-tab-pane label="" name="productAuthorize" :disabled="form.productId==0" v-if="form.deviceType==1 || form.deviceType==2">
                    <span slot="label">设备授权</span>
                    <product-authorize ref="productAuthorize" :product="form" />
                </el-tab-pane>

                <el-tab-pane label="" name="alert" :disabled="form.productId==0" v-if="form.deviceType==1 || form.deviceType==2">
                    <span slot="label"> 告警配置</span>
                    <product-alert ref="productAlert" :product="form"></product-alert>
                </el-tab-pane>

                <!-- <el-tab-pane label="" name="productApp" :disabled="form.productId==0">
                    <span slot="label">控制界面</span>
                    <product-app ref="productApp" :product="form" />
                </el-tab-pane> -->

                <el-tab-pane label="" name="sipConfig" :disabled="form.productId==0" v-if="form.deviceType==3">
                    <span slot="label">SIP配置</span>
                    <config-sip ref="configSip" :product="form" />
                </el-tab-pane>

                <el-tab-pane label="" name="ysConfig" :disabled="form.productId==0" v-if="form.deviceType==4">
                    <span slot="label"><span style="color:red;">* </span>参数配置</span>
                    <ys-config :product="form"></ys-config>
                </el-tab-pane>
                <el-tab-pane label="" name="ysImport" :disabled="form.productId==0" v-if="form.deviceType==4">
                    <span slot="label"><span style="color:red;">* </span>设备同步</span>
                    <ys-import :product="form"></ys-import>
                </el-tab-pane>

                <el-tab-pane v-if="form.status==1" name="product04" disabled><!--加disabled防止跳到此tab-->
                    <span slot="label">
                        <el-button type="primary" size="mini" @click="changeProductStatus(2)" v-hasPermi="['iot:product:ispublish']">发布产品</el-button>
                    </span>
                </el-tab-pane>
                <el-tab-pane v-if="form.status==2" name="product05" disabled><!--加disabled防止跳到此tab-->
                    <span slot="label">
                        <el-button type="danger" size="mini" @click="changeProductStatus(1)" v-hasPermi="['iot:product:ispublish']">取消发布</el-button>
                    </span>
                </el-tab-pane>
                <el-tab-pane name="product06">
                    <span slot="label">
                        <el-button type="info" size="mini" @click="goBack()">返回列表</el-button>
                    </span>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import productThingsModel from "./product-things-model";
import productFirmware from "./product-firmware";
import productApp from "./product-app"
import productAlert from "./product-alert"
import productAuthorize from "./product-authorize"
import imageUpload from "../../../components/ImageUpload/index"
import configSip from "../sip/config-sip";
import ysConfig from "../ys/ys-config.vue"
import ysImport from "../ys/ys-import.vue"

import {
    listCategory,
} from "@/api/iot/category";
import {
    getProduct,
    addProduct,
    updateProduct,
    changeProductStatus,
    deviceCount,
    generateAesKey
} from "@/api/iot/product";

export default {
    name: "ProductEdit",
    dicts: ['iot_device_type', 'iot_network_method', 'iot_vertificate_method'],
    components: {
        productThingsModel,
        productApp,
        productAlert,
        productAuthorize,
        productFirmware,
        imageUpload,
        configSip,
        ysConfig,
        ysImport
    },
    data() {
        return {
            // 选中选项卡
            activeName: 'basic',
            // 分类短列表
            categoryShortList: [],
            // 表单参数
            form: {
                networkMethod: 1,
                deviceType: 1,
                vertificateMethod: 3,
            },
            // 表单校验
            rules: {
                productName: [{
                    required: true,
                    message: "产品名称不能为空",
                    trigger: "blur"
                }],
                categoryId: [{
                    required: true,
                    message: "产品分类ID不能为空",
                    trigger: "blur"
                }],
                imgUrl:[{
                    validator:(rule, value, callback)=>{
                        if(!value){
                            callback(new Error("产品图片不能为空"));
                            return;
                        }
                        let count = value.split(',').length;
                        if(count<3){
                            callback(new Error("产品图片为三张，第一张为产品图片，第二张为产品地图展示图片，第三张为产品APP菜单"))
                        }else{
                            callback();
                        }
                    }
                }]
            },
            // 查询参数
            queryParams: {
                tenantName: null,
            },
            //AESKey
            AESKey:''
        };
    },
    created() {
        // 获取产品信息
        const productId = this.$route.query && this.$route.query.productId;
        this.form.productId = productId;
        if (this.form.productId != 0 && this.form.productId != null) {
            this.getProduct();
        }
        // 切换选项卡
        const tabPanelName = this.$route.query && this.$route.query.tabPanelName;
        if (tabPanelName != null && tabPanelName != '') {
            this.activeName = tabPanelName;
        }
        // 获取分类信息
        this.getShortCategory();
    },
    activated() {
        const time = this.$route.query.t;
        if (time != null && time != this.uniqueId) {
            this.uniqueId = time;
            // 获取产品信息
            let productId = this.$route.query.productId
            if (productId != null && productId != 0) {
                this.form.productId = Number(productId);
                this.getProduct();
                this.getShortCategory();
            }
            // 切换选项卡
            const tabPanelName = this.$route.query && this.$route.query.tabPanelName;
            if (tabPanelName != null && tabPanelName != '') {
                this.activeName = tabPanelName;
            }
        }
    },
    methods: {
        // 获取简短分类列表
        getShortCategory() {
            listCategory().then(response => {
                this.categoryShortList = response.rows;
            })
        },
        /** 返回按钮 */
        goBack() {
            const obj = {
                path: "/iot/product",
                query: {
                    t: Date.now(),
                    pageNum: this.$route.query.pageNum
                }
            };
            this.$tab.closeOpenPage(obj);
            this.reset();
        },
        /** 获取产品信息 */
        getProduct() {
            getProduct(this.form.productId).then(response => {
                this.form = response.data;
            });
        },
        // 表单重置
        reset() {
            this.form = {
                productId: 0,
                productName: null,
                categoryId: null,
                categoryName: null,
                status: 0,
                tslJson: null,
                isAuthorize: 0,
                deviceType: 1,
                networkMethod: 1,
                vertificateMethod: 3,
                mqttAccount: null,
                mqttPassword: null,
                mqttSecret: null,
                remark: null
            };
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.productId != null && this.form.productId != 0) {
                        updateProduct(this.form).then(response => {
                            this.$modal.alertSuccess("修改成功");
                        });
                    } else {
                        addProduct(this.form).then(response => {
                            this.$modal.alertSuccess("添加成功,可以开始定义物模型或配置");
                            this.form = response.data;
                            // this.activeName = "things";
                        });
                    }
                }
            });
        },
        /**同步获取产品下的设备数量**/
        getDeviceCountByProductId(productId) {
            return new Promise((resolve, reject) => {
                deviceCount(productId).then(res => {
                    resolve(res);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        /** 更新产品状态 */
        async changeProductStatus(status) {
            let message = "确定取消发布？";
            if (status == 2) {
                message = "产品发布后，可以创建对应的设备";
            } else if (status == 1) {
                let result = await this.getDeviceCountByProductId(this.form.productId);
                if (result.data > 0) {
                    message = "重要提示：产品下已有 " + result.data + " 个设备，取消发布可以修改产品信息和模型，重新发布后对应设备状态将会被重置！"
                }
            }
            this.$confirm(message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {};
                data.productId = this.form.productId;
                data.status = status;
                data.deviceType = this.form.deviceType;
                changeProductStatus(data).then(response => {
                    this.$modal.alertSuccess(response.msg);
                    this.activeName = "basic";
                    this.getProduct();
                }).catch(() => {
                    if (status == 2) {
                        this.activeName = "basic";
                    } else {
                        this.goBack();
                    }
                });
            }).catch(() => {
                this.activeName = "basic";
            });
        },
        /** 选择分类 */
        selectCategory(val) {
            for (var i = 0; i < this.categoryShortList.length; i++) {
                if (this.categoryShortList[i].categoryId == val) {
                    this.form.categoryName = this.categoryShortList[i].categoryName;
                    return;
                }
            }
        },
        /**获取上传图片的路径 */
        getImagePath(data) {
            this.form.imgUrl = data;
        },
        //生成asc加密密钥
        async generateAesKey(){
            const {data} = await generateAesKey(this.form.productId,0);
            this.AESKey = data;
        }
    }
};
</script>
