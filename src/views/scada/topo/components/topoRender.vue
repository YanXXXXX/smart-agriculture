<template>
    <!-- 预览界面 -->
    <div id="render-app" @mousewheel="mouseWheel">
        <div
            v-if="configData.layer"
            id="render-box"
            class="topo-render"
            ref="imageTofile"
            :style="layerStyle"
            v-loading="loadingContro"
            :element-loading-text="loadingText"
            @contextmenu.prevent="onContextmenu"
            @mousemove="mouseMove"
            @mousedown="mouseDown"
            @mouseup="mouseUp"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
        >
            <template v-for="(component, index) in configData.components">
                <div
                    :key="index"
                    class="topo-render-wrapper"
                    @click="throttle(component)"
                    @dblclick="doDbClickComponent(component)"
                    :class="{ 'topo-render-wrapper-clickable': component.action.length > 0 }"
                    v-show="component.style.visible == undefined ? true : component.style.visible"
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
                    }"
                >
                    <component v-bind:is="parseView(component)" :detail="component" ref="spirit" />
                </div>
            </template>
        </div>
        <!-- 组态预览小窗口 -->
        <el-dialog :title="windowPage" :visible.sync="childPage" :close-on-click-modal="false" :width="windowWidth + 'px'">
            <iframe :style="{ width: windowWidth - 40 + 'px', height: windowHeight + 'px', border: '#91939a 1px solid' }" :src="childUrl"></iframe>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations } from 'vuex';
import html2canvas from 'html2canvas';
import Contextmenu from 'vue-contextmenujs';

import TopoBase from './topoBase';
import topoUtil from '@/utils/topo/topo-util';
import { getByGuid, getDeviceStatus } from '@/api/scada/topo';
import mqttService from "@/utils/mqttService"
import sysTopics from "@/utils/sysTopics"

// import { clearTimeout } from 'timers';

Vue.use(Contextmenu);

export default {
    name: 'TopoRender',
    extends: TopoBase,
    props: {
        defaultValue: Number,
        isShare: Boolean,
        params:Object//设备运行状态中的组态预览
    },
    computed: {
        layerStyle: function () {
            var styles = [];
            styles = [`transform:scale(${this.selectedValue / 100})`];
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
            var style = styles.join(';');
            return style;
        },
    },
    data() {
        return {
            scadaGuid: '', // guid
            configData: {}, // 组件数据
            bindDeviceList: [], // 被绑定设备
            selectedValue: this.defaultValue,
            width: 0,
            height: 0,
            ztTimer: null,
            ishow: true,
            key: 0,
            keyVertical: 0,
            loadingContro: false,
            loadingText: '指令下发中...',
            bindList: [],
            time: null,
            childPage: false,
            childUrl: '',
            windowWidth: '960',
            windowHeight: '600',
            windowPage: '子界面',
            key: 0,
            newZoom: 0.2,
            displacement: {
                scale: 1,
            },
            throttleTimer: null,
            deviceTimer: null,
            notifyShow: false,
            isFullscreen: false,
            mouseOperate: '', // 鼠标操作
            x: 0, // 当前鼠标x
            y: 0, // 当前鼠标y
            l: 0, // 当前鼠标l
            t: 0, // 当前鼠标t
        };
    },
    mounted() {
        // this.$notify({
        //     title: '温馨提示',
        //     message: '键盘按下F11键或右键开启全屏，按下Esc退出全屏。',
        //     position: 'top-left',
        //     duration: 4500,
        // });
        this.scadaGuid = this.$route.query.guid || this.params.guid;
        this.getZtData();
        this.connectMqtt();
    },
    destroyed() {
        this.mqttUnSubscribe(this.bindDeviceList); // 取消mqtt订阅
    },
    methods: {
        // 连接mqtt消息服务器
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect();
            }
            this.mqttCallback();
        },
        // mqtt回调处理
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                let topics = topic.split('/');
                let productId = topics[1];
                let deviceNum = topics[2];
                message = JSON.parse(message.toString());
                if (!message) {
                    return;
                }
                if ("/"+topics[3]+"/"+topics[4] == sysTopics.statusFetch) {
                    console.log('组态接收到【设备状态】主题：', topic);
                    console.log('组态接收到【设备状态】内容：', message);
                }
                if ("/"+topics[3]+"/"+topics[4] == sysTopics.propertyFetch||"/"+topics[3]+"/"+topics[4] == sysTopics.functionFetch||"/"+topics[3]+"/"+topics[4] == sysTopics.monitorFetch) {
                    console.log('组态接收到【物模型】主题：', topic);
                    console.log('组态接收到【物模型】内容：', message);
                    const data = {
                        productId: productId,
                        serialNumber: deviceNum,
                        message: message,
                    };
                    this.setMqttData(data);
                }
            });
        },
        // mqtt订阅主题
        mqttSubscribe(list) {
            const topics = this.getSubscribeTopic(list);
            this.$mqttTool.subscribe(topics);
        },
        // mqtt取消订阅主题
        mqttUnSubscribe(list) {
            const topics = this.getSubscribeTopic(list);
            this.$mqttTool.unsubscribe(topics);
        },
        // 获取订阅主题
        getSubscribeTopic(list) {
            let topics = [];
            if (list && list.length !== 0) {
                list.forEach((item) => {
                    const topicStatus = '/' + item.productId + '/' + item.serialNumber + sysTopics.statusFetch;
                    const topicProperty = '/' + item.productId + '/' + item.serialNumber + sysTopics.propertyFetch;
                    const topicFunction = '/' + item.productId + '/' + item.serialNumber + sysTopics.functionFetch;
                    const topicMonitor= '/' + item.productId + '/' + item.serialNumber + sysTopics.monitorFetch;
                    topics.push(topicStatus);
                    topics.push(topicProperty);
                    topics.push(topicMonitor);
                    topics.push(topicFunction);
                });
            }
            return topics;
        },
        // 获取组态数据
        getZtData() {
            getByGuid(this.scadaGuid).then((res) => {
                const { data } = res;
                if(this.params && this.params.scadaType=="1"){
                    //修改数据
                    data.scadaData = data.scadaData.replace(/ReplaceSerialNumber/g,this.params.serialNumber).replace(/ReplaceDeviceName/g,this.params.deviceName);
                    this.bindDeviceList=[this.params];
                }
                this.configData = JSON.parse(data.scadaData);
                this.bindDeviceList = data.bindDeviceList;
                document.title = data.pageName; // 修改title值
                this.mqttSubscribe(this.bindDeviceList); // 订阅mqtt主题

                // 双指缩放
                let that = this;
                if (window.screen.width < 1366) {
                    that.selectedValue = 100;
                    let rate = window.screen.width / 1920;
                    if (that.is_andriod_ios().ios) {
                        document.body.style.transform = 'scale(' + rate + ')';
                    } else {
                        document.body.style.zoom = rate;
                    }
                    that.newZoom = rate;
                    // 获取放大或缩小的区域DOM
                    document.body.addEventListener('touchstart', function (event) {
                        var touches = event.touches;
                        var events = touches[0];
                        var events2 = touches[1];
                        // 第一个触摸点的坐标
                        that.displacement.pageX = events.pageX;
                        that.displacement.pageY = events.pageY;
                        that.displacement.moveable = true;
                        if (events2) {
                            that.displacement.pageX2 = events2.pageX;
                            that.displacement.pageY2 = events2.pageY;
                        }
                        that.displacement.originScale = that.displacement.scale || 1;
                    });
                    document.addEventListener('touchmove', function (event) {
                        if (!that.displacement.moveable) {
                            return;
                        }
                        event.preventDefault();
                        var touches = event.touches;
                        var events = touches[0];
                        var events2 = touches[1];
                        // 双指移动
                        if (events2) {
                            // 第2个指头坐标在touchmove时候获取
                            if (!that.displacement.pageX2) {
                                that.displacement.pageX2 = events2.pageX;
                            }
                            if (!that.displacement.pageY2) {
                                that.displacement.pageY2 = events2.pageY;
                            }
                            // 双指缩放比例计算
                            var zoom =
                                that.getDistance(
                                    {
                                        x: events.pageX,
                                        y: events.pageY,
                                    },
                                    {
                                        x: events2.pageX,
                                        y: events2.pageY,
                                    }
                                ) /
                                that.getDistance(
                                    {
                                        x: that.displacement.pageX,
                                        y: that.displacement.pageY,
                                    },
                                    {
                                        x: that.displacement.pageX2,
                                        y: that.displacement.pageY2,
                                    }
                                );
                            // 图像应用缩放效果,使用定时器实现限流防抖
                            if (that.ztTimer) {
                                clearTimeout(that.ztTimer);
                            }
                            that.ztTimer = setTimeout(() => {
                                // console.log("zoom",zoom);
                                if (zoom > 1) {
                                    that.newZoom = that.newZoom + 0.1;
                                    if (that.newZoom > 0.8) {
                                        that.newZoom = 0.8;
                                    }
                                } else {
                                    that.newZoom = that.newZoom - 0.1;
                                    if (that.newZoom < 0.2) {
                                        that.newZoom = 0.2;
                                    }
                                }
                                if (that.is_andriod_ios().ios) {
                                    document.body.style.transform = 'scale(' + that.newZoom + ')';
                                } else {
                                    document.body.style.zoom = that.newZoom;
                                }
                            }, 100);
                        }
                    });
                } else {
                    //缩放
                    if (sessionStorage.getItem('selectedValue-' + this.scadaGuid) != 'undefined') {
                        this.selectedValue = Number(sessionStorage.getItem('selectedValue-' + this.scadaGuid));
                        if (this.selectedValue < 30) {
                            this.selectedValue = 100;
                        }
                    } else if (this.defaultValue) {
                        this.selectedValue = this.defaultValue;
                    }
                    setTimeout(() => {
                        this.initLeftTop();
                    }, 200);
                }
            });
        },
        // 鼠标离开
        mouseLeave(e) {
            this.mouseOperate = 'default';
        },
        // 鼠标进来
        mouseEnter(e) {
            this.mouseOperate = 'default';
        },
        // 鼠标被按下
        mouseDown(e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.id === 'render-box') {
                let idDown = document.getElementById('render-box');
                idDown.style.cursor = 'pointer';
                this.x = e.clientX;
                this.y = e.clientY;
                this.l = idDown.offsetLeft;
                this.t = idDown.offsetTop;
                this.mouseOperate = 'render-box';
            }
        },
        // 可以拖拽状态下鼠标移动
        mouseMove(e) {
            e.preventDefault();
            if (!this.configData.layer.dragZoom) {
                return;
            }
            let point = document.getElementById('render-box');
            if (this.mouseOperate == 'render-box') {
                let nx = e.clientX; // 随着 缩放，这个值是变的
                let ny = e.clientY; // 随着 缩放，这个值是变的

                let nl = nx - (this.x - this.l);
                let nt = ny - (this.y - this.t);

                point.style.left = nl + 'px';
                point.style.top = nt + 'px';
                sessionStorage.setItem('boxLeft-' + this.scadaGuid, point.style.left);
                sessionStorage.setItem('boxTop-' + this.scadaGuid, point.style.top);
                e.stopImmediatePropagation();
            }
        },
        // 鼠标被抬起
        mouseUp(e) {
            this.mouseOperate = 'default';
            if (e.target.id === 'render-box') {
                let idDoc = document.getElementById(e.target.id);
                idDoc.style.cursor = 'default';
            }
        },
        mouseWheel(e) {
            // 滚动事件
            if (!this.configData.layer.dragZoom) {
                return;
            }
            if (e.wheelDelta >= 120) {
                this.selectedValue = this.selectedValue + 10;
            } else if (e.wheelDelta <= -120) {
                if (this.selectedValue > 30) {
                    this.selectedValue = this.selectedValue - 10;
                }
            }
            // console.log('缩放',this.selectedValue);
            this.saveSf();
        },
        // 初始化左上角样式
        initLeftTop() {
            let renderApp = document.getElementById('render-app');
            if (!this.configData.layer.dragZoom) {
                renderApp.style.overflow = 'auto';
                return;
            }
            renderApp.style.overflow = 'hidden';
            if (sessionStorage.getItem('boxLeft-' + this.scadaGuid) != 'undefined') {
                let point = document.getElementById('render-box');
                point.style.left = sessionStorage.getItem('boxLeft-' + this.scadaGuid);
                point.style.top = sessionStorage.getItem('boxTop-' + this.scadaGuid);
            }
        },
        // 鼠标右键菜单响应
        onContextmenu(event) {
            this.$contextmenu({
                items: [
                    {
                        label: '图片生成',
                        divided: true,
                        icon: 'el-icon-download',
                        onClick: () => {
                            this.generateImage();
                        },
                    },
                    {
                        label: '全屏展示',
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
        // 生成图片
        generateImage() {
            this.$modal.loading('正在生成，请稍候...');
            // 手动创建一个 canvas 标签
            const canvas = document.createElement('canvas');
            // 获取父标签，意思是这个标签内的 DOM 元素生成图片
            let canvasBox = this.$refs.imageTofile;
            // 获取父级的宽高
            const width = parseInt(window.getComputedStyle(canvasBox).width);
            const height = parseInt(window.getComputedStyle(canvasBox).height);
            // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
            canvas.width = width * 2;
            canvas.height = height * 2;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            const options = {
                backgroundColor: null,
                canvas: canvas,
                useCORS: true,
            };
            html2canvas(canvasBox, options).then((canvas) => {
                const dataURL = canvas.toDataURL('image/png');
                this.downloadImage(dataURL);
                this.$modal.closeLoading();
            });
        },
        //下载图片
        downloadImage(url) {
            let a = document.createElement('a');
            a.href = url;
            a.download = document.title;
            a.click();
        },
        // 全屏展示
        clickFullscreen() {
            let element = document.getElementById('app'); // 指定全屏区域元素
            console.log(element);
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen(); // IE11
            }
        },
        ...mapMutations('topoEditor', ['setMqttData']),
        //保存缩放
        saveSf() {
            sessionStorage.setItem('selectedValue-' + this.$route.query.guid, this.selectedValue);
        },
        parseView(component) {
            return topoUtil.parseViewName(component);
        },
        // 点击节流
        throttle(component) {
            if (this.throttleTimer) {
                clearTimeout(this.throttleTimer);
            }
            let that = this;
            this.throttleTimer = setTimeout(() => {
                that.doClickComponent(component);
            }, 300);
        },
        // 点击事件
        doClickComponent(component) {
            if (component.componentShow && component.componentShow.indexOf('单击') > -1 && component.dataBind.djAction) {
                if (component.dataBind.action == '外部链接') {
                    window.open(component.dataBind.redirectUrl);
                } else if (component.dataBind.action == '组态界面') {
                    //当前页面打开
                    if (component.dataBind.openModel === 1) {
                        if (component.dataBind.ztPage) {
                            this.scadaGuid = component.dataBind.ztPage;
                            const routeUrl = this.$router.resolve({
                                path: '/topo/fullscreen',
                                query: {
                                    id: component.dataBind.ztId,
                                    guid: this.scadaGuid,
                                },
                            });
                            window.open(routeUrl.href, '_self');
                        } else {
                            this.$message('无绑定组态界面');
                        }
                    } else if (component.dataBind.openModel === 2) {
                        if (component.dataBind.ztPage) {
                            this.scadaGuid = component.dataBind.ztPage;
                            const routeUrl = this.$router.resolve({
                                path: '/topo/fullscreen',
                                query: {
                                    id: component.dataBind.ztId,
                                    guid: this.scadaGuid,
                                },
                            });
                            window.open(routeUrl.href, '_blank');
                        } else {
                            this.$message('无绑定组态界面');
                        }
                    } else {
                        if (component.dataBind.ztPage) {
                            this.scadaGuid = component.dataBind.ztPage;
                            this.childPage = true;
                            if (component.dataBind.windowHeight) {
                                this.windowHeight = component.dataBind.windowHeight;
                            }
                            if (component.dataBind.windowWidth) {
                                this.windowWidth = component.dataBind.windowWidth;
                            }
                            this.windowPage = component.dataBind.ztPageName;
                            this.childUrl = window.location.origin + '/topo/fullscreen?id=' + component.dataBind.id + '&guid=' + this.scadaGuid + '&t=' + new Date().getTime();
                        } else {
                            this.$message('无绑定组态界面');
                        }
                    }
                } else if (component.dataBind.action == '操作变量') {
                    if (component.dataBind.modelValue) {
                        this.controChange(component.dataBind);
                    } else {
                        let tipMsg = '提示：请输入变量值';
                        if (component.dataBind.tipMsg) {
                            tipMsg = '提示：' + component.dataBind.tipMsg;
                        }
                        this.$prompt(tipMsg, component.dataBind.modelName, {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            closeOnClickModal: false,
                            closeOnPressEscape: false,
                            inputValue: component.dataBind.modelValue == '' ? '0' : component.dataBind.modelValue,
                            inputErrorMessage: '变量值不能为空',
                            inputValidator: (value) => {
                                if (!value) {
                                    return '变量值不能为空';
                                }
                                if (isNaN(value)) {
                                    return '变量值必须是数字';
                                }
                            },
                        }).then(({ value }) => {
                            component.dataBind.modelValue = value;
                            this.controChange(component.dataBind);
                            component.dataBind.modelValue = '';
                        });
                    }
                } else if (component.type == 'imageSwitch' && component.dataBind.identifier) {
                    if (component.dataBind.controValue == '0关1开' && component.dataAction.actualValue == '关') {
                        component.dataBind.modelValue = '1';
                        this.controChange(component.dataBind);
                    } else if (component.dataBind.controValue == '0开1关' && component.dataAction.actualValue == '关') {
                        component.dataBind.modelValue = '0';
                        this.controChange(component.dataBind);
                    } else if (component.dataBind.controValue == '0关1开' && component.dataAction.actualValue == '开') {
                        component.dataBind.modelValue = '0';
                        this.controChange(component.dataBind);
                    } else if (component.dataBind.controValue == '0开1关' && component.dataAction.actualValue == '开') {
                        component.dataBind.modelValue = '1';
                        this.controChange(component.dataBind);
                    } else {
                        component.dataBind.modelValue = '0';
                        this.controChange(component.dataBind);
                    }
                }
            }
        },
        doDbClickComponent(component) {
            for (var i = 0; i < component.action.length; i++) {
                var action = component.action[i];
                if (action.type == 'dblclick') {
                    //this.handleComponentActuib(action);
                    //  console.log('组件双击了',component)
                    //this.$message('组件双击了');
                }
            }
        },
        handleComponentActuib(action) {
            var _this = this;
            if (action.action == 'visible') {
                if (action.showItems.length > 0) {
                    action.showItems.forEach((identifier) => {
                        _this.showComponent(identifier, true);
                    });
                }
                if (action.hideItems.length > 0) {
                    action.hideItems.forEach((identifier) => {
                        _this.showComponent(identifier, false);
                    });
                }
            } else if (action.action == 'service') {
                _this.sendFun(action);
            }
        },
        showComponent(identifier, visible) {
            // console.log('show:' + identifier + ',visible:' + visible);
            var spirits = this.$refs['spirit'];
            for (var i = 0; i < spirits.length; i++) {
                var spirit = spirits[i];
                if (spirit.detail.identifier == identifier) {
                    spirit.detail.style.visible = visible;
                    break;
                }
            }
        },
        // 判断是在手机还是电脑
        isMobile_pc() {
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
            return flag;
        },
        // 判断是在安卓还是ios打开
        is_andriod_ios() {
            var u = navigator.userAgent;
            return {
                //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            };
        },
        // 控制变化/下发指令
        async controChange(item) {
            let isOnline = await this.getDeviceStatus(item.serialNumber);
            if (!isOnline) {
                this.$message({
                    type: 'warning',
                    message: '设备不在线,无法设置！',
                });
                return;
            }
            let model = {
                type:item.type,
                id:item.identifier,
                value:item.modelValue,
                name:item.modelName
            }
            let device = {
                productId:item.productId,
                serialNumber:item.serialNumber,
                status:3
            }
            console.log(model,device)
            mqttService.mqttPublish(model,device)
        },

        // Math.hypot() 计算参数的平方根
        getDistance(start, stop) {
            return Math.hypot(stop.x - start.x, stop.y - start.y);
        },
        // 获取设备状态
        getDeviceStatus(serialNumber) {
            return new Promise((resolve, reject) => {
                const query = {
                    serialNumber: serialNumber,
                };
                getDeviceStatus(query)
                    .then((res) => {
                        resolve(res.data === 3 ? true : false);
                    })
                    .catch((err) => {
                        reject(false);
                    });
            });
        },
    },
    beforeDestroy() {
        clearInterval(this.ztTimer);
        this.ztTimer = null;
        clearInterval(this.deviceTimer);
        this.deviceTimer = null;
    },
};
</script>

<style lang="scss" scoped>
#render-app {
    position: absolute;
    width: 100vw;
    height: 100vh;
    transform-origin: center top;
}

.topo-render {
    overflow: auto;
    background-color: #ffffff;
    background-clip: padding-box;
    background-origin: padding-box;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 100%;
    position: absolute;

    .topo-render-wrapper {
        position: absolute;
    }

    .topo-render-wrapper-clickable {
        cursor: pointer;
    }
}
</style>
<style>
h2 {
    line-height: 1.1;
}

.el-message-box__message {
    color: #e6a23c !important;
}

body {
    -webkit-text-size-adjust: 100% !important;
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
