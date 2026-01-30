<template>
    <!-- 组态主界面 -->
    <div class="topo-main-wrap">
        <div class="content-wrap" ref="rulerToolBox">
            <vue-ruler-tool :parent="true" :is-scale-revise="true" ref="rulerTool" :is-hot-key="false">
                <div tabindex="0" id="surface-edit-layer" class="topo-layer"
                    :class="{ 'topo-layer-view-selected': selectedIsLayer }" :style="layerStyle"
                    @click="onLayerClick($event)" @mouseup="onLayerMouseup($event)"
                    @mousemove="onLayerMousemove($event)" @mousedown="onLayerMousedown($event)"
                    @keyup.delete="removeItem()" @dragover.prevent @drop="onDrop" @contextmenu.prevent="onContextmenu"
                    @keydown.ctrl.67.stop="copyItem" @keydown.ctrl.86.stop="pasteItem" @keydown.ctrl.90.stop="undo"
                    @keydown.ctrl.89.stop="redo">
                    <template v-for="(component, index) in configData.components">
                        <div :key="component.identifier" tabindex="0" class="topo-layer-view"
                            :class="{ 'topo-layer-view-selected': selectedComponentMap[component.identifier] == undefined ? false : true }"
                            v-show="component.style.visible == undefined ? true : component.style.visible"
                            @click.stop="clickComponent(index, component, $event)"
                            @mousedown.stop="controlMousedown(component, $event, index)" @keyup.delete="removeItem()"
                            @keydown.up.exact.prevent="moveItems('up')"
                            @keydown.right.exact.prevent="moveItems('right')"
                            @keydown.down.exact.prevent="moveItems('down')"
                            @keydown.left.exact.prevent="moveItems('left')" @keydown.ctrl.67.stop="copyItem"
                            @keydown.ctrl.86.stop="pasteItem" @keydown.ctrl.90.stop="undo" @keydown.ctrl.89.stop="redo"
                            :style="{
                left: component.style.position.x + 'px',
                top: component.style.position.y + 'px',
                width: component.style.position.w + 'px',
                height: component.style.position.h + 'px',
                backgroundColor: component.type == 'flow-bar' || component.type == 'flow-bar-dynamic' ? 'transparent' : component.style.backColor,
                zIndex: component.style.zIndex,
                transform: component.style.transformType,
                opacity: component.style.opacity,
                'border-radius': component.style.borderRadius + 'px',
                'box-shadow': '0 0 ' + component.style.boxShadowWidth + 'px 0 ' + component.style.boxShadowColor,
            }">
                            <component v-bind:is="parseView(component)" :detail="component" :editMode="true"
                                :selected="selectedComponentMap[component.identifier] ? true : false"
                                :ref="'comp' + index" />
                            <div class="resize-left-top"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-lt')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-left-center"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-lc')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-left-bottom"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-lb')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-right-top"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-rt')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-right-center"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-rc')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-right-bottom"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-rb')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-center-top"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-ct')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                            <div class="resize-center-bottom"
                                @mousedown.stop="resizeMousedown(component, $event, index, 'resize-cb')"
                                v-show="selectedComponentMap[component.identifier]"></div>
                        </div>
                    </template>
                    <!-- 点开空白选中多个组件 -->
                    <div class="topo-frame-selection"
                        :style="{ width: frameSelectionDiv.width + 'px', height: frameSelectionDiv.height + 'px', top: frameSelectionDiv.top + 'px', left: frameSelectionDiv.left + 'px' }">
                    </div>
                </div>
            </vue-ruler-tool>
        </div>
        <!-- <div class="footer-wrap">
            <div class="left-wrap">
                <el-tabs style="height: 42px" type="card" @tab-click="handleBottomTabClick">
                    <el-tab-pane v-for="(page, index) in ztList" :key="page.id" :label="page.pageName"
                        :name="page.guid">
                        <el-dropdown slot="label" @command="handleBottomTabCommand">
                            <span :class="guid == page.guid ? 'dropdown-item-active' : 'dropdown-item'">
                                <i class="el-icon-date"></i>
                                {{ page.pageName }}
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{ type: 'rename', index: index, page: page }"
                                    v-hasPermi="['scada:center:edit']">重命名</el-dropdown-item>
                                <el-dropdown-item :command="{ type: 'delete', index: index, page: page }"
                                    v-hasPermi="['scada:center:remove']">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="right-wrap">
                <i class="el-icon-plus" @click="handleBottomTabAdd"></i>
            </div>
        </div> -->
        <el-dialog :title="uploadImport.title" :visible.sync="uploadImport.open" width="400px" append-to-body
            v-loading="importLoading" element-loading-text="拼命导入中" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-upload ref="uploadImport" :limit="1" accept=".json" :headers="uploadImport.headers"
                :action="uploadImport.url" :disabled="uploadImport.isUploading" :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" style="color: red" slot="tip">提示：仅允许导入“Json”格式文件！</div>
                <div class="el-upload__tip" style="color: red" slot="tip">提示：导入界面后需重新绑定设备参数！</div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="uploadImport.open = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="重命名" :visible.sync="isRenameDialog" width="20%">
            <el-input v-model="renameValue" placeholder="请输入内容" clearable></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isRenameDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleTabRename">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import FileSaver from 'file-saver';
import Contextmenu from 'vue-contextmenujs';
import html2canvas from 'html2canvas';

import topoUtil from '@/utils/topo/topo-util';
import { deepCopy } from '@/utils/index';
import { checkByRectCollisionDetection } from '@/utils/topo/index';
import uid from '@/utils/uid';
import { getByGuid, saveDetailData } from '@/api/scada/topo';
import { listCenter, delCenter, addCenter, updateCenter } from '@/api/scada/center';

import VueRulerTool from './ruler';
import TopoBase from './topoBase';

Vue.use(Contextmenu);

export default {
    name: 'TopoMain',
    extends: TopoBase,
    components: {
        VueRulerTool,
    },
    props: [],
    computed: {
        ...mapState({
            selectedComponents: (state) => state.topoEditor.selectedComponents,
            selectedComponentMap: (state) => state.topoEditor.selectedComponentMap,
            configData: (state) => state.topoEditor.topoData,
            selectedIsLayer: (state) => state.topoEditor.selectedIsLayer,
            copySrcItems: (state) => state.topoEditor.copySrcItems,
            copyCount: (state) => state.topoEditor.copyCount,
            sidebarStatus: (state) => state.app.sidebar.opened,
        }),
        layerStyle: function () {
            const scale = this.zoom / 100;
            const styles = [`transform:scale(${scale})`];
            if (this.configData.layer.backColor) {
                styles.push(`background-color: ${this.configData.layer.backColor}`);
            }
            if (this.configData.layer.backgroundImage) {
                styles.push(`background-image: url("${this.configData.layer.backgroundImage}")`);
            }
            if (this.configData.layer.width > 0) {
                styles.push(`width: ${this.configData.layer.width}px`);
            }
            if (this.configData.layer.height > 0) {
                styles.push(`height: ${this.configData.layer.height}px`);
            }
            styles.push('overflow:hidden');
            const style = styles.join(';');
            return style;
        },
    },
    data() {
        return {
            baseApi: process.env.VUE_APP_BASE_API,
            // 移动组件 相关变量
            moveItem: {
                startX: 0,
                startY: 0,
            },
            // resize组件 相关变量
            resizeItem: {
                startPx: 0,
                startPy: 0,
                x: 0,
                y: 0,
                w: 0,
                h: 0,
            },
            frameSelectionDiv: {
                width: 0,
                height: 0,
                top: 10,
                left: 10,
                startX: 0,
                startY: 0,
                startPageX: 0,
                startPageY: 0,
            },
            flag: '', // 当前操作标志位
            curControl: null,
            curIndex: -1,
            zoom: 100, // 缩放大小
            isFullFlag: false,
            selectIndx: null,
            //恢复撤销的组件
            changeComponent: [],
            changeCount: null,
            uploadImport: {
                open: false, // 是否显示弹出层（用户导入）
                title: '', // 弹出层标题（用户导入）
                isUploading: false, // 是否禁用上传
                updateSupport: 0, // 是否更新已经存在的用户数据
                headers: { Authorization: 'Bearer ' + sessionStorage.getItem('Admin-Token-WebTopo') }, // 设置上传的请求头部
                url: '', // 上传的地址
            },
            importLoading: false,
            deviceZtRow: {},
            isMultiple: false,
            //撤销恢复标志位
            operateFlag: 0,

            newestConfigData: null,

            isLock: false,
            fileName: '',
            pageImage: '',

            id: this.$route.query.id, // 组态id
            guid: this.$route.query.guid, // 组态标识
            ztList: [], // 所有组态列表
            configDataHis: [], // 操作中的组态数据temp
            selectFlag: 0, // 选中组件标识
            isRenameDialog: false, // 重名对话框
            renameId: '',
            renameValue: '', // 重命名值
            selectComponent: null, // 选中组件
        };
    },
    watch: {
        selectedComponentMap(newVal) {
            console.log('新加/删除组件', newVal);
            this.configDataHis.push(deepCopy(this.configData));
            this.selectFlag = this.configDataHis.length;
            console.log('configDataHis', this.configDataHis);
        },
        selectFlag(newVal, oldVal) {
            if (newVal >= this.configDataHis.length) {
                this.$emit('recoveryFlagClick', true);
            } else {
                this.$emit('recoveryFlagClick', false);
            }
            if (newVal <= 0) {
                this.$emit('revokeFlagClick', true);
            } else {
                this.$emit('revokeFlagClick', false);
            }
        },
        // 检测系统菜单栏状态
        sidebarStatus() {
            setTimeout(() => {
                this.initRuler();
            }, 500);
        },
        'configData.components':{
            handler(n,o){
                if (n.length != !o.length) {
                    this.setIsLock()
                }
            }
        }
    },
    mounted() {
        document.addEventListener('keydown', this.handleCrtlS, false); // crtl+s保存数据
        this.initZtTab(); // 初始组态数据
        this.getZtCenter(); // 获取buttonTabs列表
    },
    methods: {
        //初始化卡尺
        initRuler() {
            this.$nextTick(() => {
                this.$refs.rulerTool.init();
            });
        },
        //调整视图大小
        handleZoom(value) {
            this.zoom = value;
        },
        //导入组态json
        handleImport() {
            this.uploadImport.title = '组态导入';
            this.uploadImport.open = true;
            this.uploadImport.url = this.baseApi + '/scada/center/importJson?guid=' + this.guid;
        },
        // 文件上传中处理
        handleFileUploadProgress() {
            this.uploadImport.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.uploadImport.open = false;
            this.uploadImport.isUploading = false;
            this.$refs.uploadImport.clearFiles();
            this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true });
            this.importLoading = false;
            this.getZtDetails();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.uploadImport.submit();
            this.importLoading = true;
        },
        //导出组态json
        handleDownLoad() {
            const data = JSON.stringify(this.deviceZtRow);
            const blob = new Blob([data], { type: '' });
            FileSaver.saveAs(blob, document.title + '.json');
        },
        //撤销
        revoke() {
            // let levelLineList=this.$refs.rulerTool.levelLineList;
            // let verticalLineList=this.$refs.rulerTool.verticalLineList;
            if (this.selectFlag == this.configDataHis.length) {
                this.newestConfigData = deepCopy(this.configData);
            }
            this.selectFlag = this.selectFlag - 1;
            this.configDataHis.forEach((element, index) => {
                if (this.selectFlag == index) {
                    this.loadDefaultTopoData(element);
                }
            });
        },
        //恢复
        recovery() {
            this.selectFlag = this.selectFlag + 1;
            if (this.selectFlag >= this.configDataHis.length) {
                this.loadDefaultTopoData(this.newestConfigData);
            } else {
                this.configDataHis.forEach((element, index) => {
                    if (this.selectFlag == index) {
                        this.loadDefaultTopoData(element);
                    }
                });
            }
            // console.log(this.selectFlag,this.configData);
        },
        onTabContextmenu(event) {
            this.$contextmenu({
                items: [
                    {
                        label: '全屏',
                        icon: 'el-icon-full-screen',
                        onClick: () => {
                            this.clickFullscreen();
                        },
                    },
                    {
                        label: '重新加载',
                        divided: true,
                        icon: 'el-icon-refresh',
                        onClick: () => {
                            this.$router.go(0);
                        },
                    },
                ],
                event, // 鼠标事件信息
                customClass: 'custom-class', // 自定义菜单 class
                zIndex: 9999, // 菜单样式 z-index
                minWidth: 230, // 主菜单最小宽度
            });

            return true;
        },
        onContextmenu(event) {
            if (this.selectedComponentMap && this.selectedComponentMap[this.selectedComponents].type == 'VR') {
                return;
            }
            let isDisabled = false;
            if (this.selectedComponents.length > 0) {
                isDisabled = false;
            } else {
                isDisabled = true;
            }

            // console.log(isDisabled);
            let that = this;
            this.$contextmenu({
                items: [
                    {
                        label: '取消',
                        icon: 'el-icon-circle-close',
                        onClick: () => { },
                    },
                    {
                        label: '复制',
                        icon: 'el-icon-document-copy',
                        disabled: isDisabled,
                        onClick: () => {
                            that.copyItem();
                            that.pasteItem();
                        },
                    },
                    {
                        label: '删除',
                        icon: 'el-icon-delete',
                        disabled: isDisabled,
                        onClick: () => {
                            that.removeItem();
                        },
                    },
                    {
                        label: '置顶',
                        icon: 'el-icon-top',
                        disabled: isDisabled,
                        onClick: () => {
                            that.$emit('menuClick', '置顶');
                        },
                    },
                    {
                        label: '置底',
                        icon: 'el-icon-bottom',
                        disabled: isDisabled,
                        onClick: () => {
                            that.$emit('menuClick', '置底');
                        },
                    },
                    {
                        label: '旋转',
                        minWidth: 0,
                        disabled: isDisabled,
                        children: [
                            {
                                label: '顺时针90°',
                                icon: 'el-icon-plus',
                                onClick: () => {
                                    // console.log("顺时针90°");
                                    that.$emit('menuClick', '顺时针90°');
                                },
                            },
                            {
                                label: '逆时针90°',
                                icon: 'el-icon-minus',
                                onClick: () => {
                                    // console.log("逆时针90°");
                                    that.$emit('menuClick', '逆时针90°');
                                },
                            },
                            {
                                label: '水平镜像',
                                icon: 'el-icon-d-arrow-left',
                                onClick: () => {
                                    // console.log("水平镜像");
                                    that.$emit('menuClick', '水平镜像');
                                },
                            },
                            {
                                label: '垂直镜像',
                                icon: 'el-icon-d-arrow-right',
                                onClick: () => {
                                    // console.log("垂直镜像");
                                    that.$emit('menuClick', '垂直镜像');
                                },
                            },
                            {
                                label: '自定义角度',
                                icon: 'el-icon-edit',
                                onClick: () => {
                                    // console.log("自定义角度");
                                    that.$emit('menuClick', '自定义角度');
                                },
                            },
                        ],
                    },
                    {
                        label: '对齐',
                        minWidth: 0,
                        disabled: isDisabled,
                        children: [
                            {
                                label: '左对齐',
                                icon: 'el-icon-arrow-left',
                                onClick: () => {
                                    that.alignClick('左对齐');
                                },
                            },
                            {
                                label: '右对齐',
                                icon: 'el-icon-arrow-right',
                                onClick: () => {
                                    that.alignClick('右对齐');
                                },
                            },
                            {
                                label: '上对齐',
                                icon: 'el-icon-arrow-up',
                                onClick: () => {
                                    that.alignClick('上对齐');
                                },
                            },
                            {
                                label: '下对齐',
                                icon: 'el-icon-arrow-down',
                                onClick: () => {
                                    that.alignClick('下对齐');
                                },
                            },
                            {
                                label: '水平等间距',
                                icon: 'el-icon-sort',
                                onClick: () => {
                                    that.alignClick('水平等间距');
                                },
                            },
                            {
                                label: '垂直等间距',
                                icon: 'el-icon-sort',
                                onClick: () => {
                                    that.alignClick('垂直等间距');
                                },
                            },
                        ],
                    },
                    {
                        label: '组合',
                        minWidth: 0,
                        disabled: isDisabled,
                        children: [
                            {
                                label: '组合',
                                icon: 'el-icon-connection',
                                onClick: () => {
                                    that.makeUpClick('组合');
                                },
                            },
                            {
                                label: '取消组合',
                                icon: 'el-icon-link',
                                onClick: () => {
                                    that.makeUpClick('取消组合');
                                },
                            },
                        ],
                    },
                    {
                        label: '锁定',
                        minWidth: 0,
                        disabled: isDisabled,
                        children: [
                            {
                                label: '锁定',
                                icon: 'el-icon-lock',
                                onClick: () => {
                                    that.handleLock('锁定');
                                },
                            },
                            {
                                label: '解锁',
                                icon: 'el-icon-unlock',
                                onClick: () => {
                                    that.handleLock('解锁');
                                },
                            },
                        ],
                    },
                    {
                        label: '图库',
                        divided: true,
                        icon: 'el-icon-picture-outline',
                        onClick: () => {
                            that.$emit('menuClick', '图库');
                        },
                    },
                    {
                        label: '预览',
                        divided: true,
                        icon: 'el-icon-view',
                        onClick: () => {
                            that.$emit('menuClick', '预览');
                        },
                    },
                    {
                        label: '保存',
                        divided: true,
                        icon: 'el-icon-star-off',
                        onClick: () => {
                            that.$emit('menuClick', '保存');
                        },
                    },
                    {
                        label: '重新加载',
                        divided: true,
                        icon: 'el-icon-refresh',
                        onClick: () => {
                            this.$router.go(0);
                        },
                    },
                ],
                event, // 鼠标事件信息
                customClass: 'custom-class', // 自定义菜单 class
                zIndex: 9999, // 菜单样式 z-index
                minWidth: 230, // 主菜单最小宽度
            });

            return true;
        },

        ...mapMutations('topoEditor', [
            'setSelectedComponent',
            'addSelectedComponent',
            'removeSelectedComponent',
            'clearSelectedComponent',
            'setLayerSelected',
            'setCopySrcItems',
            'increaseCopyCount',
            'execute',
            'undo',
            'redo',
            'setIsLock'
        ]),
        ...mapActions('topoEditor', ['loadDefaultTopoData']),
        controlMousedown(component, event, index) {
            if (event.ctrlKey) {
                return;
            }
            this.flag = 'move';
            this.curControl = component;
            this.clickItem(component, index);
            this.moveItem.startX = event.pageX;
            this.moveItem.startY = event.pageY;
            //记录初始信息--move
            for (var key in this.selectedComponentMap) {
                var component = this.selectedComponentMap[key];
                component.style.temp = {};
                component.style.temp.position = {};
                component.style.temp.position.x = component.style.position.x;
                component.style.temp.position.y = component.style.position.y;
            }
        },
        resizeMousedown(component, event, index, flag) {
            //resize-鼠标按下事件
            this.flag = flag;
            this.curControl = component;
            this.curIndex = index;
            this.clickItem(component, index);
            var dom = event.currentTarget;
            this.resizeItem.startPx = event.clientX;
            this.resizeItem.startPy = event.clientY;
            //记录初始信息-resize
            this.resizeItem.x = this.curControl.style.position.x;
            this.resizeItem.y = this.curControl.style.position.y;
            this.resizeItem.w = this.curControl.style.position.w;
            this.resizeItem.h = this.curControl.style.position.h;
        },
        onLayerMousemove(event) {
            if (event.which != 1) {
                this.flag = '';
                return;
            }
            if (this.flag == '') return;
            if (this.flag.startsWith('resize')) {
                var dx = event.clientX - this.resizeItem.startPx,
                    dy = event.clientY - this.resizeItem.startPy;
                switch (this.flag) {
                    case 'resize-lt':
                        this.curControl.style.position.x = this.resizeItem.x + dx;
                        this.curControl.style.position.y = this.resizeItem.y + dy;
                        dx = -dx;
                        dy = -dy;
                        break;
                    case 'resize-lc':
                        this.curControl.style.position.x = this.resizeItem.x + dx;
                        dy = 0;
                        dx = -dx;
                        break;
                    case 'resize-lb':
                        this.curControl.style.position.x = this.resizeItem.x + dx;
                        dx = -dx;
                        break;
                    case 'resize-rt':
                        this.curControl.style.position.y = this.resizeItem.y + dy;
                        dy = -dy;
                        break;
                    case 'resize-rc':
                        dy = 0;
                        break;
                    case 'resize-rb':
                        break;
                    case 'resize-ct':
                        this.curControl.style.position.y = this.resizeItem.y + dy;
                        dx = 0;
                        dy = -dy;
                        break;
                    case 'resize-cb':
                        dx = 0;
                        break;
                }
                if (this.resizeItem.w + dx > 20) {
                    this.curControl.style.position.w = this.resizeItem.w + dx;
                }
                if (this.resizeItem.h + dy > 20) {
                    this.curControl.style.position.h = this.resizeItem.h + dy;
                }
                //canvas组件需要重新渲染
                // DOM 还没有更新
                this.$nextTick(function () {
                    // DOM 更新了
                    var a = this.$refs['comp' + this.curIndex][0];
                    a.onResize();
                });
            } else if (this.flag == 'move') {
                //移动组件
                var dx = event.pageX - this.moveItem.startX,
                    dy = event.pageY - this.moveItem.startY;
                for (var key in this.selectedComponentMap) {
                    var component = this.selectedComponentMap[key];
                    if (!component.isLock) {
                        component.style.position.x = component.style.temp.position.x + dx;
                        component.style.position.y = component.style.temp.position.y + dy;
                    }
                }
            } else if (this.flag == 'frame_selection') {
                this.onFrameSelection(event);
            }
        },
        onLayerMouseup(event) {
            // console.log("组件回滚");
            if (this.flag.startsWith('resize')) {
                var a = this.$refs['comp' + this.curIndex][0];
                a.onResize();
            } else if (this.flag == 'frame_selection') {
                //由于和onLayerClick冲突，这里模拟下点击空白区域
                this.onFrameSelection(event);
                this.frameSelectionDiv.width = 0;
                this.frameSelectionDiv.height = 0;
                this.frameSelectionDiv.top = 0;
                this.frameSelectionDiv.left = 0;
            } else if (this.flag == 'move') {
                //鼠标move只是方便用户预览，真正执行应该用命令，所以要先恢复
                var dx = event.pageX - this.moveItem.startX;
                var dy = event.pageY - this.moveItem.startY;
                for (var key in this.selectedComponentMap) {
                    var component = this.selectedComponentMap[key];
                    component.style.position.x = component.style.position.x - dx;
                    component.style.position.y = component.style.position.y - dy;
                }
                this.execute({
                    op: 'move',
                    dx: dx,
                    dy: dy,
                    items: this.selectedComponentMap,
                });
            }
            this.flag = '';
        },
        onLayerMousedown($event) {
            this.flag = 'frame_selection';
            this.frameSelectionDiv.startX = event.offsetX;
            this.frameSelectionDiv.startY = event.offsetY;
            this.frameSelectionDiv.startPageX = event.pageX;
            this.frameSelectionDiv.startPageY = event.pageY;
            this.isMultiple = true;
        },
        onLayerClick() {
            if (this.isMultiple == false) {
                this.clearSelectedComponent();
                this.selectComponent = null;
                this.setLayerSelected(true);
            } else {
                this.isMultiple = false;
            }
        },
        onFrameSelection(event) {
            var dx = event.pageX - this.frameSelectionDiv.startPageX;
            var dy = event.pageY - this.frameSelectionDiv.startPageY;
            this.frameSelectionDiv.width = Math.abs(dx);
            this.frameSelectionDiv.height = Math.abs(dy);
            if (dx > 0 && dy > 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX;
            } else if (dx > 0 && dy < 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY + dy;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX;
            } else if (dx < 0 && dy > 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX + dx;
            } else if (dx < 0 && dy < 0) {
                this.frameSelectionDiv.top = this.frameSelectionDiv.startY + dy;
                this.frameSelectionDiv.left = this.frameSelectionDiv.startX + dx;
            }
            //判断各个组件是否在方框内
            var _this = this;
            var rect = {
                x: this.frameSelectionDiv.left,
                y: this.frameSelectionDiv.top,
                width: this.frameSelectionDiv.width,
                height: this.frameSelectionDiv.height,
            };
            var components = this.configData.components;
            components.forEach((component) => {
                var itemRect = {
                    x: component.style.position.x,
                    y: component.style.position.y,
                    width: component.style.position.w,
                    height: component.style.position.h,
                };
                if (checkByRectCollisionDetection(rect, itemRect)) {
                    _this.addSelectedComponent(component);
                } else {
                    _this.removeSelectedComponent(component);
                }
            });
            if (this.selectedComponents.length > 0) {
                this.setLayerSelected(false);
            } else {
                this.setLayerSelected(true);
            }
        },
        onDrop(event) {
            event.preventDefault();
            var infoJson = event.dataTransfer.getData('my-info');
            var component = JSON.parse(infoJson);
            if (component.type == 'weather') {
                var components = this.configData.components;
                let isExist = false;
                components.forEach((component) => {
                    if (component.type == 'weather') {
                        isExist = true;
                    }
                });
                if (isExist) {
                    this.$message({
                        message: '天气组件已存在，不能重复添加',
                        type: 'warning',
                    });
                    return;
                }
            }
            if (this.checkAddComponent(component) == false) {
                return;
            }
            //判断当前着陆点是不是layer
            if (event.target.id == 'surface-edit-layer') {
                component.style.position.x = event.offsetX;
                component.style.position.y = event.offsetY;
            } else {
                //解决着陆灯不是layer的情形
                var layer = event.currentTarget;
                var position = layer.getBoundingClientRect();
                var x = event.clientX - position.left;
                var y = event.clientY - position.top;
                component.style.position.x = x;
                component.style.position.y = y;
            }
            //处理默认值
            this.execute({
                op: 'add',
                component: component,
            });

            //默认选中，并点击
            this.clickItem(component, this.configData.components.length - 1);
        },
        moveItems(direction) {
            var dx = 0,
                dy = 0;
            if (direction == 'up') {
                dy = -5;
            } else if (direction == 'right') {
                dx = 5;
            } else if (direction == 'down') {
                dy = 5;
            } else if (direction == 'left') {
                dx = -5;
            }
            this.execute({
                op: 'move',
                dx: dx,
                dy: dy,
                items: this.selectedComponentMap,
            });
        },
        checkAddComponent(info) {
            if (info == null) {
                this.$q.notify({
                    type: 'negative',
                    position: 'bottom-right',
                    message: 'This component not surpport.',
                });
                return false;
            }
            return true;
        },
        parseView(component) {
            return topoUtil.parseViewName(component);
        },
        clickItem(component, index) {
            this.operateFlag = this.operateFlag + 1;
            this.selectFlag = this.operateFlag;
            console.log('单击组件:', deepCopy(component));
            sessionStorage.setItem('operateFlag' + this.operateFlag, JSON.stringify(deepCopy(component)));
            this.selectComponent = component;
            this.selectIndx = index;
            this.setLayerSelected(false);
            if (this.selectedComponentMap[component.identifier] == undefined) {
                this.setSelectedComponent(component);
            } else {
                //如果已经选中，则不做任何处理
                this.setSelectedComponent(component);
            }
            if (component.identifiers) {
                component.identifiers.forEach((element) => {
                    this.configData.components.forEach((ele) => {
                        if (ele.identifier == element) {
                            Vue.set(this.selectedComponentMap, element, ele);
                        }
                    });
                });
            }
            this.$emit('lockStatus', component.isLock);
            this.$emit('activeIndexStatus', index);
        },

        copyItem() {
            // 设定复制源
            var items = [];
            for (var key in this.selectedComponentMap) {
                var item = deepCopy(this.selectedComponentMap[key]);
                //item.identifiers=identifiers;
                items.push(item);
            }
            this.setCopySrcItems(items);
        },
        pasteItem() {
            // console.log("粘贴",this.copySrcItems);
            if (this.copySrcItems && this.copySrcItems.length > 0) {
                this.execute({
                    op: 'copy-add',
                    items: this.copySrcItems,
                });
            }
        },
        removeItem(index, component) {
            //移除组件
            this.execute({
                op: 'del',
                index: index,
            });
            this.setLayerSelected(true);
        },
        showMessage(type, msg) {
            this.$message({
                message: msg,
                type: type,
                duration: 1500,
            });
        },
        // 锁定/解锁
        handleLock(command) {
            // console.log(command);
            if (command == '锁定') {
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].isLock = true;
                }
                this.$emit('lockStatus', true);
            } else {
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].isLock = false;
                }
                this.$emit('lockStatus', false);
            }
            // console.log("组件总数据",this.configData);
            // this.printData();
        },
        //组件对齐  selectedComponents选中的组件的id数组  selectedComponentMap选中组件的全部内容
        alignClick(command) {
            if (command == '右对齐') {
                let alignX = 0;
                let alignComponent = null;
                this.selectedComponents.forEach((element) => {
                    var component = deepCopy(this.selectedComponentMap[element]);
                    if (component.style.position.x > alignX) {
                        alignX = component.style.position.x;
                        alignComponent = deepCopy(this.selectedComponentMap[element]);
                    }
                });
                for (var key in this.selectedComponentMap) {
                    if (this.selectedComponentMap[key].style.position.x != alignX) {
                        this.selectedComponentMap[key].style.position.x = alignX + alignComponent.style.position.w - this.selectedComponentMap[key].style.position.w;
                    }
                }
            } else if (command == '左对齐') {
                let alignX = 9999;
                this.selectedComponents.forEach((element) => {
                    var component = deepCopy(this.selectedComponentMap[element]);
                    if (component.style.position.x < alignX) {
                        alignX = component.style.position.x;
                    }
                });
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].style.position.x = alignX;
                }
            } else if (command == '上对齐') {
                let alignY = 9999;
                this.selectedComponents.forEach((element) => {
                    var component = deepCopy(this.selectedComponentMap[element]);
                    if (component.style.position.y < alignY) {
                        alignY = component.style.position.y;
                    }
                });
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].style.position.y = alignY;
                }
            } else if (command == '下对齐') {
                let alignY = 0;
                let alignYBottom = 0;
                this.selectedComponents.forEach((element) => {
                    var component = deepCopy(this.selectedComponentMap[element]);
                    if (component.style.position.y > alignY) {
                        alignY = component.style.position.y;
                        alignYBottom = alignY + component.style.position.h;
                    }
                });
                console.log('alignYBottom', alignYBottom);
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].style.position.y = alignYBottom - this.selectedComponentMap[key].style.position.h;
                }
            } else if (command == '水平等间距') {
                let distance = 0;
                let minWidth = 9999;
                let maxWidth = 0;
                this.selectedComponents.forEach((element) => {
                    var component = deepCopy(this.selectedComponentMap[element]);
                    if (minWidth > component.style.position.x) {
                        minWidth = component.style.position.x;
                    }
                    if (maxWidth < component.style.position.x) {
                        maxWidth = component.style.position.x;
                    }
                });
                distance = (maxWidth - minWidth) / (this.selectedComponents.length - 1) / 2;
                for (var key in this.selectedComponentMap) {
                    if (distance > 0) {
                        this.selectedComponentMap[key].style.position.x = minWidth;
                        minWidth = minWidth + distance + this.selectedComponentMap[key].style.position.w;
                    }
                }
                //this.printData();
            } else if (command == '垂直等间距') {
                let distance = 0;
                let minHeight = 9999;
                let maxHeight = 0;
                this.selectedComponents.forEach((element) => {
                    var component = deepCopy(this.selectedComponentMap[element]);
                    if (minHeight > component.style.position.y) {
                        minHeight = component.style.position.y;
                    }
                    if (maxHeight < component.style.position.y) {
                        maxHeight = component.style.position.y;
                    }
                });
                distance = (maxHeight - minHeight) / (this.selectedComponents.length - 1) / 2;
                for (var key in this.selectedComponentMap) {
                    if (distance > 0) {
                        this.selectedComponentMap[key].style.position.y = minHeight;
                        minHeight = minHeight + distance + this.selectedComponentMap[key].style.position.h;
                    }
                }
                // this.printData();
            }
        },
        //组件组合
        makeUpClick(command) {
            // console.log("id数组",this.selectedComponents)
            // console.log("idMap",this.selectedComponentMap)
            if (command == '组合') {
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].identifiers = this.selectedComponents;
                }
            } else {
                for (var key in this.selectedComponentMap) {
                    this.selectedComponentMap[key].identifiers = [];
                }
            }
            // console.log("组件总数据",this.configData);
            if (this.selectedComponents.length == 0) {
                this.showMessage('warning', '未选中组合组件');
            } else {
                this.clearSelectedComponent();
                this.clickItem(this.selectComponent, this.selectIndx);
                //this.printData('组合');
            }
        },
        getJsonItem(url) {
            let newJson = {
                type: 'image',
                componentShow: ['动画', '单击', '组件颜色', '滤镜渲染', '组件填充', '参数绑定'],
                action: [],
                hdClassName: '',
                identifier: uid(),
                dataBind: {
                    queryParam: {},
                    imei: '',
                    paramField: '',
                    paramName: '',
                    driveName: '',
                    action: '',
                    paramValue: '',
                    redirectUrl: '',
                    stateList: [],
                },
                dataAction: {
                    //动作判断字段
                    imei: '',
                    paramField: '',
                    paramName: '',
                    paramJudge: '',
                    paramJudgeData: '',
                    rotationSpeed: '中',
                    translateList: [],
                },
                style: {
                    position: {
                        x: 200 + this.randomNumBoth(0, 30),
                        y: 200 + this.randomNumBoth(0, 30),
                        w: 100,
                        h: 100,
                    },
                    backColor: 'transparent',
                    foreColor: '',
                    zIndex: 1,
                    transform: 0,
                    url: url,
                    transformType: 'rotate(0deg)',
                    isFilter: true,
                },
            };
            return newJson;
        },
        randomNumBoth(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range); //四舍五入
            return num;
        },
        // 从图库添加组态图片
        addImageData(url) {
            let data = this.getJsonItem(url);
            this.configData.components.push(data);
        },
        // 点击组件
        clickComponent(index, component, event) {
            //点击了ctrl
            if (event.ctrlKey == true) {
                this.setLayerSelected(false);
                if (this.selectedComponentMap[component.identifier] == undefined) {
                    this.addSelectedComponent(component);
                } else {
                    this.removeSelectedComponent(component);
                }
            } else {
                //这里不再处理点击事件，改为鼠标左键
                //this.clickItem(component,index);
            }
        },
        // 获取组态详情
        getZtDetails() {
            const guid = this.guid;
            getByGuid(guid).then((res) => {
                this.deviceZtRow = res.data;
                // document.title = this.deviceZtRow.pageName; // 修改title值
                if (this.deviceZtRow.scadaData) {
                    let configData = JSON.parse(this.deviceZtRow.scadaData);
                    console.log('组件JSON格式化', JSON.parse(this.deviceZtRow.scadaData));
                    this.loadDefaultTopoData(configData);
                } else {
                    let configData = { name: '--', layer: { backColor: '', backgroundImage: '', widthHeightRatio: '', width: 1920, height: 1080 }, components: [] };
                    this.loadDefaultTopoData(configData);
                }
            });
        },
        // 初始化组态
        initZtTab() {
            this.getZtDetails(); // 获取组态详情
            this.configDataHis = [];
            this.selectFlag = 0;
            this.clearSelectedComponent(); // 清掉选择的组件
            this.setLayerSelected(true); // 默认切换回背景设置
            this.$emit('recoveryFlagClick', true); // 复位恢复标志
            this.$emit('revokeFlagClick', true); // 复位撤销标志
        },
        // 获取所有组态数据
        getZtCenter() {
            return new Promise((resolve, reject) => {
                listCenter().then((res) => {
                    if (res.code === 200) {
                        this.ztList = res.rows;
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            });
        },
        // 底部tab切换
        async handleBottomTabClick(tab) {
            if (this.guid !== tab.name) {
                const hasPermission = await this.checkPermission();
                if (hasPermission) {
                    this.$confirm('要保存当前页面，并切换到其他页面吗？', '提示', {
                        confirmButtonText: '保存',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(async () => {
                        await this.saveZtDatas();
                        this.$modal.loading('正在切换，请稍候...');
                        this.$modal.closeLoading();
                        this.guid = tab.name;
                        const zt = this.ztList.find((item) => item.guid === tab.name);
                        this.id = zt.id;
                        this.initZtTab();
                    });
                }
            }
        },
        checkPermission() {
            // 返回一个Promise对象
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const hasPermission = ['scada:center:edit'];
                    resolve(hasPermission);
                }, 1000);
            });
        },
        // tab组态功能操作
        handleBottomTabCommand(command) {
            const { type, index, page } = command;
            const { id, guid, pageName } = page;
            if (type == 'rename') {
                this.isRenameDialog = true;
                this.renameId = id;
                this.renameValue = pageName;
            } else if (type == 'delete') {
                this.$confirm('您是否要删除此页面，删除后将无法恢复！', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$modal.loading('正在删除，请稍候...');
                    delCenter(id).then((res) => {
                        if (res.code === 200) {
                            this.getZtCenter().then((flag) => {
                                // 删的是当前页
                                if (flag && guid === this.guid) {
                                    this.guid = this.ztList[index - 1].guid;
                                    this.id = this.ztList[index - 1].id;
                                    this.$router.push({
                                        query: { ...this.$route.query, id: this.id, guid: this.guid },
                                    });
                                    this.initZtTab();
                                }
                            });
                            this.$busEvent.$emit('updateCenter');
                        } else {
                            this.$modal.msgError(res.msg);
                        }
                        this.$modal.closeLoading();
                    });
                });
            }
        },
        // 重命名组态
        handleTabRename() {
            let params = {
                id: this.renameId,
                pageName: this.renameValue,
            };
            updateCenter(params).then((res) => {
                if (res.code === 200) {
                    this.getZtCenter();
                } else {
                    this.$message.error(res.msg);
                }
                this.isRenameDialog = false;
            });
        },
        // 新增组态/tab栏
        handleBottomTabAdd() {
            const params = {
                pageName: '未知页面' + Date.now(),
            };
            this.$modal.loading('正在保存，请稍候...');
            addCenter(params).then((res) => {
                if (res.code === 200) {
                    this.$busEvent.$emit('updateCenter');
                    this.getZtCenter().then((flag) => {
                        if (flag) {
                            const { guid, id } = this.ztList[this.ztList.length - 1];
                            this.guid = guid;
                            this.id = id;
                            this.initZtTab();
                        }
                        this.$modal.closeLoading();
                    });
                }
            });
        },
        // 保存（外部调用）
        printData() {
            this.$modal.loading('请稍候...');
            this.saveZtDatas().then((flag) => {
                if (flag) {
                    this.$modal.closeLoading();
                    this.showMessage('success', '保存成功');
                }
            });
        },
        // 保存组态数据
        saveZtDatas() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 定时是为了让loading先转起来
                    let canvasBox = document.querySelector('#surface-edit-layer');
                    const options = {
                        backgroundColor: null,
                        useCORS: true,
                    };
                    html2canvas(canvasBox, options).then((canvas) => {
                        const base64 = canvas.toDataURL('image/png');
                        var json = JSON.stringify(this.configData);
                        const params = {
                            guid: this.guid,
                            // deviceMac: this.$route.query.deviceImei,
                            base64: base64,
                            scadaData: json,
                        };
                        saveDetailData(params).then((res) => {
                            if (res.code === 200) {
                                const resolution = this.configData.layer.width + 'x' + this.configData.layer.height;
                                const params2 = { id: this.id, pageResolution: resolution };
                                updateCenter(params2).then((res) => {
                                    if (res.code === 200) {
                                        this.$busEvent.$emit('updateCenter');
                                        resolve(true);
                                    } else {
                                        reject(false);
                                    }
                                });
                            } else {
                                reject(false);
                            }
                        });
                    });
                }, 500);
            });
        },
        // crtl + s
        handleCrtlS(e) {
            var key = window.event.keyCode ? window.event.keyCode : window.event.which;
            if (key === 83 && e.ctrlKey) {
                this.$modal.loading('请稍候...');
                this.saveZtDatas().then((flag) => {
                    if (flag) {
                        this.$modal.closeLoading();
                        this.showMessage('success', '保存成功');
                    }
                });
            }
        },
        // 页面预览
        screenPreview() {
            const routeUrl = this.$router.resolve({
                path: '/topo/fullscreen',
                query: {
                    id: this.$route.query.id,
                    guid: this.guid,
                },
            });
            window.open(routeUrl.href, '_blank');
        },
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleCrtlS, false);
    },
    beforeRouteLeave(to, from, next) {
        if (this.progressVisible) {
            this.$confirm('系统可能不会保存您所做的更改。', '离开此页面？', {
                confirmButtonText: '离开',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                next();
            });
        } else {
            next();
        }
    },
};
</script>

<style lang="scss" scoped>
.topo-main-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow-x: hidden;
    overflow-y: hidden;

    .content-wrap {
        // height: calc(100% - 41px);
        height: 100%;
        width: 100%;

        .topo-layer {
            width: 100%;
            height: 100%;
            position: absolute;
            transform-origin: left top;
            overflow: auto;
            background-color: #ffffff;
            background-clip: padding-box;
            background-origin: padding-box;
            background-repeat: no-repeat;
            background-size: 100% 100%;

            .topo-frame-selection {
                background-color: #8787e7;
                opacity: 0.3;
                border: #0000ff solid 1px;
                position: absolute;
                z-index: 999;
            }

            .topo-layer-view-selected-line {
                outline: 1px solid #0cf;
            }

            .topo-layer-view {
                position: absolute;
                height: 100px;
                width: 100px;
                background-color: #999;
                cursor: move;
                // border: #ccc solid 1px;

                .resize-left-top {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    left: -5px;
                    top: -5px;
                    cursor: nwse-resize;
                }

                .resize-left-center {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    left: -5px;
                    top: 50%;
                    margin-top: -5px;
                    cursor: ew-resize;
                }

                .resize-left-bottom {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    left: -5px;
                    bottom: -5px;
                    cursor: nesw-resize;
                }

                .resize-right-top {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    right: -5px;
                    top: -5px;
                    cursor: nesw-resize;
                }

                .resize-right-center {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    right: -5px;
                    top: 50%;
                    margin-top: -5px;
                    cursor: ew-resize;
                }

                .resize-right-bottom {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    right: -5px;
                    bottom: -5px;
                    cursor: nwse-resize;
                }

                .resize-center-top {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    top: -5px;
                    left: 50%;
                    margin-left: -5px;
                    cursor: ns-resize;
                }

                .resize-center-bottom {
                    position: absolute;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0cf;
                    border: 1px solid #0cf;
                    bottom: -5px;
                    left: 50%;
                    margin-left: -5px;
                    cursor: ns-resize;
                }
            }

            .topo-layer-view-selected {
                border: 1.5px solid #21cc96;
            }

            .topo-layer-view-selected:hover {
                border: 1.5px dashed #21cc96;
            }
        }

        .topo-layer::before,
        .topo-layer::after {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            background-repeat: repeat;
            pointer-events: none;
        }

        .topo-layer::before {
            background-image: linear-gradient(to right, black 1px, transparent 1px, transparent 10px), linear-gradient(to bottom, black 1px, transparent 1px, transparent 10px);
            background-size: 10px 10px;
            opacity: 0.05;
        }

        .topo-layer::after {
            background-image: linear-gradient(to right, black 1px, transparent 1px, transparent 50px), linear-gradient(to bottom, black 1px, transparent 1px, transparent 50px);
            background-size: 50px 50px;
            opacity: 0.1;
        }
    }

    .footer-wrap {
        position: relative;
        height: 42px;
        border-top: 1px solid #d8dce5;
        background-color: #f1f3f4;
        display: flex;
        flex-direction: row;
        align-items: center;

        .left-wrap {
            flex: 1;

            ::v-deep .el-tabs__nav {
                border: unset;
                border-right: 1px solid #dfe4ed;
                border-radius: unset;
            }

            ::v-deep .is-focus {
                box-shadow: unset;
                border-radius: unset;
            }

            .dropdown-item {
                font-size: 12px;
            }

            .dropdown-item-active {
                font-size: 12px;
                color: #409eff;
            }
        }

        .right-wrap {
            height: 42px;
            width: 42px;
            line-height: 42px;
            text-align: center;
            cursor: pointer;
            font-size: 18px;
            color: #78797a;
            font-weight: 700;
            margin-right: 5px;
        }
    }
}
</style>
<style scoped>
.custom-class .menu_item__available:hover,
.custom-class .menu_item_expand {
    background: #ffecf2 !important;
    color: #ff4050 !important;
}
</style>
<style>
::-webkit-scrollbar-thumb {
    background-color: #e1e1e1;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #a5a2a2;
}

::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    position: absolute;
}

::-webkit-scrollbar-track {
    background-color: #fff;
}
</style>
