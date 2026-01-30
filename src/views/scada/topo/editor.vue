<template>
    <div class="topo-editor-wrap">
        <el-container class="container-wrap">
            <el-header class="header-wrap">
                <div class="left-wrap">
                    <el-button class="btn-wrap" icon="el-icon-copy-document" type="text" @click="handelClick(3)">
                        <span class="name">复制</span>
                    </el-button>
                    <el-button class="btn-wrap" icon="el-icon-delete" type="text" @click="handelClick(4)">
                        <span class="name">删除</span>
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button class="btn-wrap" icon="el-icon-top" type="text" @click="handelClick(13)">
                        <span class="name">置顶</span>
                    </el-button>
                    <el-button class="btn-wrap" icon="el-icon-bottom" type="text" @click="handelClick(14)">
                        <span class="name">置底</span>
                    </el-button>
                    <el-dropdown class="ml10" @command="handleCommand">
                        <el-button icon="el-icon-refresh" type="text" class="btn-wrap">
                            <span class="name">旋转</span>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-plus" command="顺时针90°">顺时针90°</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-minus" command="逆时针90°">逆时针90°</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-d-arrow-left" command="水平镜像">水平镜像</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-d-arrow-right" command="垂直镜像">垂直镜像</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-edit" command="自定义角度">自定义角度</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown class="ml10" @command="handleCommandAlign">
                        <el-button icon="el-icon-s-operation" type="text" class="btn-wrap">
                            <span class="name">对齐</span>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-arrow-left" command="左对齐">左对齐</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-arrow-right" command="右对齐">右对齐</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-arrow-up" command="上对齐">上对齐</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-arrow-down" command="下对齐">下对齐</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-arrow-down" command="水平等间距">水平等间距</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-arrow-down" command="垂直等间距">垂直等间距</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown class="ml10" @command="handleCommandMakeUP">
                        <el-button icon="el-icon-money" type="text" class="btn-wrap">
                            <span class="name">组合</span>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-connection" command="组合">组合</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-link" command="右对齐">取消组合</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-divider direction="vertical"></el-divider>
                    <el-button v-if="isLock" class="btn-wrap" icon="el-icon-unlock" type="text"
                        @click="handleLock('解锁')">
                        <span class="name">解锁</span>
                    </el-button>
                    <el-button v-else class="btn-wrap" icon="el-icon-lock" type="text" @click="handleLock('锁定')">
                        <span class="name">锁定</span>
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button class="btn-wrap" icon="el-icon-picture-outline" type="text" @click="handelClick(6)">
                        <span class="name">图库</span>
                    </el-button>
                    <el-button v-if="scadaType!=1" class="btn-wrap" icon="el-icon-paperclip" type="text" @click="handelClick(8)">
                        <span class="name">设备绑定</span>
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button class="btn-wrap" icon="el-icon-upload2" type="text" @click="handelClick(18)">
                        <span class="name">导入</span>
                    </el-button>
                    <el-button class="btn-wrap" icon="el-icon-download" type="text" @click="handelClick(19)">
                        <span class="name">导出</span>
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button class="btn-wrap" icon="el-icon-refresh-left" type="text" @click="handelClick(16)"
                        :disabled="isRevoke">
                        <span class="name">撤销</span>
                    </el-button>
                    <el-button class="btn-wrap" icon="el-icon-refresh-right" type="text" @click="handelClick(17)"
                        :disabled="isRecovery">
                        <span class="name">恢复</span>
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown @command="handleCommandZoom">
                        <el-button class="btn-wrap" type="text">
                            <span style="display: flex; flex-direction: column">
                                <i>{{ zoom }}%</i>
                                <span class="name">缩放</span>
                            </span>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="25">25%</el-dropdown-item>
                            <el-dropdown-item command="50">50%</el-dropdown-item>
                            <el-dropdown-item command="75">75%</el-dropdown-item>
                            <el-dropdown-item command="100">100%</el-dropdown-item>
                            <el-dropdown-item command="125">125%</el-dropdown-item>
                            <el-dropdown-item command="150">150%</el-dropdown-item>
                            <el-dropdown-item command="175">175%</el-dropdown-item>
                            <el-dropdown-item command="200">200%</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="right-wrap">
                    <el-button class="btn-wrap" icon="el-icon-document-checked" type="text" @click="handelClick(1)"
                        v-hasPermi="['scada:center:edit']">
                        <span class="name">保存</span>
                    </el-button>
                    <el-button v-if="scadaType!=1" class="btn-wrap" icon="el-icon-view" type="text" @click="handelClick(2)"
                        v-hasPermi="['scada:center:preview']">
                        <span class="name">预览</span>
                    </el-button>
                    <el-button class="btn-wrap" icon="el-icon-warning-outline" type="text" @click="handelHelpClick">
                        <span class="name">帮助</span>
                    </el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside class="aside-wrap left-aside-open" :class="{ 'aside-close': !leftAsideStatus }"
                    :style="{ height: asideHeight + 'px' }">
                    <topo-toolbox ref="topoToolbox" class="topoToolbox-item" />
                </el-aside>
                <el-container>
                    <el-main class="main-wrap">
                        <!-- 侧边框按钮 -->
                        <div class="left-aside-close-btn" @click="leftAsideChange">
                            <i class="el-icon-arrow-left" v-if="leftAsideClose"></i>
                            <i class="el-icon-arrow-right" v-else></i>
                        </div>
                        <div class="right-aside-close-btn" @click="rightAsideChange">
                            <i class="el-icon-arrow-right" v-if="rightAsideClose"></i>
                            <i class="el-icon-arrow-left" v-else></i>
                        </div>
                        <topo-main ref="topoMain" @menuClick="menuClick" @lockStatus="lockStatus" @activeIndexStatus="activeIndexStatus"
                            @recoveryFlagClick="recoveryFlagClick" @revokeFlagClick="revokeFlagClick" />
                    </el-main>
                </el-container>
                <el-aside class="aside-wrap right-aside-open" :class="{ 'aside-close': !rightAsideStatus }"
                    :style="{ height: asideHeight + 'px' }">
                    <topo-properties ref="topoProperties" class="topoProperties" :topoMainRef="$refs.topoMain" :activeIndex="activeIndex"/>
                </el-aside>
            </el-container>
        </el-container>
        <el-dialog title="图库" :visible.sync="isImgDialog" width="1100px" :close-on-click-modal="false" v-dialogDrag>
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <topo-select-image ref="topoSelectImage" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="isImgDialog = false">取 消</el-button>
                <el-button type="primary" @click="selectImageClick">选 择</el-button>
            </span>
        </el-dialog>
        <el-dialog title="设备绑定" :visible.sync="isDeviceBindDialog" width="700px" :close-on-click-modal="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <device-bind ref="deviceBind" />
        </el-dialog>
    </div>
</template>

<script>
import TopoToolbox from './components/topoToolbox';
import TopoMain from './components/topoMain';
import TopoProperties from './components/topoProperties';
import TopoSelectImage from './components/topoSelectImage';
import DeviceBind from './components/deviceBind/index';

export default {
    name: 'TopoEditor',
    components: {
        TopoToolbox,
        TopoMain,
        TopoProperties,
        TopoSelectImage,
        DeviceBind,
    },
    data() {
        return {
            baseApi: process.env.VUE_APP_BASE_API,
            leftAsideStatus: true,
            leftAsideClose: true,
            rightAsideStatus: true,
            rightAsideClose: true,
            asideHeight: 500,
            isLock: false, // 锁定/解锁
            activeIndex:0,
            isImgDialog: false, // 图库对话框
            isDeviceBindDialog: false, // 设备对话框
            isRevoke: true, // 撤销
            isRecovery: true, // 恢复
            zoom: 100, // 缩放大小
            scadaType:this.$route.query.scadaType
        };
    },
    mounted() {
        this.calculateAsideHeight();
        window.addEventListener('resize', this.calculateAsideHeight, true);
    },
    methods: {
        // 侧边栏收缩与展开
        leftAsideChange() {
            this.leftAsideStatus = !this.leftAsideStatus;
            if (this.leftAsideStatus) {
                setTimeout(() => {
                    this.leftAsideClose = true;
                    this.$refs.topoMain.initRuler();
                }, 500);
            } else {
                setTimeout(() => {
                    this.leftAsideClose = false;
                    this.$refs.topoMain.initRuler();
                }, 500);
            }
        },
        rightAsideChange() {
            this.rightAsideStatus = !this.rightAsideStatus;
            if (this.rightAsideStatus) {
                setTimeout(() => {
                    this.rightAsideClose = true;
                    this.$refs.topoMain.initRuler();
                }, 500);
            } else {
                setTimeout(() => {
                    this.rightAsideClose = false;
                    this.$refs.topoMain.initRuler();
                }, 500);
            }
        },
        // 获取侧边高度
        calculateAsideHeight() {
            let originalHeight = document.getElementsByClassName('app-main')[0].offsetHeight;
            this.asideHeight = parseFloat(originalHeight - 60);
        },
        // 工具点击事件
        handelClick(index) {
            if (index == 1) {
                //保存
                this.$refs.topoMain.printData();
            } else if (index == 2) {
                //预览
                this.$refs.topoMain.screenPreview();
            } else if (index == 3) {
                //复制
                this.$refs.topoMain.copyItem();
                this.$refs.topoMain.pasteItem();
            } else if (index == 4) {
                //删除
                this.$refs.topoMain.removeItem();
            } else if (index == 5) {
                //测试
                this.$refs.topoMain.alignClick();
            } else if (index == 6) {
                //图库
                this.isImgDialog = true;
            } else if (index == 7) {
                //全屏
                this.clickFullscreen();
            } else if (index == 8) {
                //设备绑定
                this.isDeviceBindDialog = true;
            } else if (index == 9) {
                //顺时针旋转
                this.$refs.topoProperties.transform('顺时针旋转');
            } else if (index == 10) {
                //逆时针旋转
                this.$refs.topoProperties.transform('逆时针旋转');
            } else if (index == 11) {
                //水平镜像
                this.$refs.topoProperties.transform('水平镜像');
            } else if (index == 12) {
                //垂直镜像
                this.$refs.topoProperties.transform('垂直镜像');
            } else if (index == 13) {
                //置顶
                this.$refs.topoProperties.stack('置顶');
            } else if (index == 14) {
                //置底
                this.$refs.topoProperties.stack('置底');
            } else if (index == 15) {
                //自定义角度
                this.$prompt('', '自定义旋转角度', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    inputValue: '0',
                    inputErrorMessage: '旋转角度不能为空',
                    inputValidator: (value) => {
                        // 点击按钮时，对文本框里面的值进行验证
                        if (!value) {
                            return '角度不能为空';
                        }
                        if (isNaN(value)) {
                            return '旋转角度必须是数字';
                        }
                    },
                }).then(({ value }) => {
                    this.$refs.topoProperties.transform('自定义角度', value);
                });
            } else if (index == 16) {
                //撤销
                this.$refs.topoMain.revoke();
            } else if (index == 17) {
                //恢复
                this.$refs.topoMain.recovery();
            } else if (index == 18) {
                //导入
                this.$refs.topoMain.handleImport();
            } else if (index == 19) {
                //导出
                this.$refs.topoMain.handleDownLoad();
            }
        },
        // 旋转
        handleCommand(command) {
            if (command == '顺时针90°') {
                this.handelClick(9);
            } else if (command == '逆时针90°') {
                this.handelClick(10);
            } else if (command == '水平镜像') {
                this.handelClick(11);
            } else if (command == '垂直镜像') {
                this.handelClick(12);
            } else if (command == '自定义角度') {
                this.handelClick(15);
            }
        },
        // 对齐
        handleCommandAlign(command) {
            this.$refs.topoMain.alignClick(command);
        },
        // 组合
        handleCommandMakeUP(command) {
            this.$refs.topoMain.makeUpClick(command);
        },
        // 锁定/解锁
        handleLock(command) {
            this.$refs.topoMain.handleLock(command);
        },
        // 锁定/解锁状态
        lockStatus(val) {
            this.isLock = val;
        },
        activeIndexStatus(val){
            this.activeIndex = val
        },
        // 图库选择
        selectImageClick() {
            let selectImage = this.$refs.topoSelectImage.handleChoice();
            if (selectImage.length === 0) {
                this.$message({
                    message: '请选择图片',
                    type: 'warning',
                });
                return;
            } else {
                selectImage.forEach((element) => {
                    this.$refs.topoMain.addImageData(this.baseApi + element.resourceUrl);
                });
                this.$message({
                    message: '添加成功',
                    type: 'success',
                });
                this.isImgDialog = false;
                this.$refs.topoSelectImage.clearChoice();
            }
        },
        // 撤销标志位
        revokeFlagClick(flag) {
            this.isRevoke = flag;
        },
        // 恢复标志位
        recoveryFlagClick(flag) {
            this.isRecovery = flag;
        },
        // 缩放
        handleCommandZoom(command) {
            this.zoom = command;
            this.$refs.topoMain.handleZoom(parseInt(command));
        },
        // 帮助
        handelHelpClick() {
            window.open('https://zosoftware.yuque.com/org-wiki-zosoftware-ms7q4x/frog/bmx607tut7wqm9is');
        },
        // 右键菜单点击了
        menuClick(val) {
            if (val == '顺时针90°') {
                this.handelClick(9);
            } else if (val == '逆时针90°') {
                this.handelClick(10);
            } else if (val == '水平镜像') {
                this.handelClick(11);
            } else if (val == '垂直镜像') {
                this.handelClick(12);
            } else if (val == '自定义角度') {
                this.handelClick(15);
            } else if (val == '自定义角度') {
                this.handelClick(15);
            } else if (val == '置顶') {
                this.handelClick(13);
            } else if (val == '置底') {
                this.handelClick(14);
            } else if (val == '预览') {
                this.handelClick(2);
            } else if (val == '保存') {
                this.handelClick(1);
            } else if (val == '图库') {
                this.handelClick(6);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.topo-editor-wrap {
    margin: 0;
    padding: 0;
    height: calc(100vh - 84px);
    width: 100%;

    .container-wrap {
        height: 100%;
        background: #f1f3f4;

        .header-wrap {
            height: 60px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #d8dce5;
            box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

            .left-wrap,
            .right-wrap {
                display: flex;
                flex-direction: row;
                align-items: center;

                .btn-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #495060;

                    ::v-deep span {
                        margin: 0;
                    }

                    .name {
                        display: inline-block;
                        margin-top: 5px;
                        font-size: 12px;
                    }
                }
            }
        }

        .aside-wrap {
            margin-bottom: 0;
            padding: 0;
            background: #f1f3f4;
        }

        .left-aside-open {
            width: 233px !important;
            transition: width 0.5s;
        }

        .right-aside-open {
            width: 260px !important;
            transition: width 0.5s;
        }

        .aside-close {
            width: 0px !important;
        }

        .main-wrap {
            position: relative;
            margin: 0;
            padding: 0;

            .left-aside-close-btn {
                position: absolute;
                left: 0;
                top: 50%;
                width: 14px;
                height: 50px;
                line-height: 50px;
                background-color: #c0c4cc8f;
                color: #fff;
                border-radius: 0 6px 6px 0;
                z-index: 1000;
                cursor: pointer;
                font-size: 14px;
            }

            .left-aside-close-btn:hover {
                color: #ccc;
                background-color: #f1f3f4;
            }

            .right-aside-close-btn {
                position: absolute;
                right: 0;
                top: 50%;
                width: 14px;
                height: 50px;
                line-height: 50px;
                background-color: #c0c4cc8f;
                color: #fff;
                border-radius: 6px 0 0 6px;
                z-index: 1000;
                cursor: pointer;
                font-size: 14px;
            }

            .right-aside-close-btn:hover {
                color: #ccc;
                background-color: #f1f3f4;
            }
        }
    }
}
</style>
