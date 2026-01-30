<!-- 全景看图 -->
<template>
    <div class="vrClass" @contextmenu.prevent="onContextmenu">
        <div class="PSViewer" ref="psvdbg"></div>
    </div>
</template>

<script>
import { Viewer } from 'photo-sphere-viewer';
import { MarkersPlugin } from 'photo-sphere-viewer/dist/plugins/markers';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import 'photo-sphere-viewer/dist/plugins/markers.css';

import BaseView from './View';
import VRImg from '@/assets/images/VR.png';
import uid from '@/utils/uid.js';

export default {
    name: 'view-vr',
    extends: BaseView,
    data() {
        return {
            viewer: null,
            markersPlugin: null,
            VRImg: VRImg,
            location: {},
            selectMarkerId: null,
        };
    },
    computed: {
        VRChange() {
            return this.detail.style.url;
        },
    },
    watch: {
        VRChange() {
            console.log('VR底图改变');
            if (this.viewer) {
                this.destoryVR();
                this.init(this.detail.style.url, this.detail.style.markers);
            }
        },
    },
    mounted() {
        this.init(this.detail.style.url, this.detail.style.markers);
        document.addEventListener('contextmenu', this.hideContextMenu);
    },
    beforeDestroy() {
        this.destoryVR();
    },
    methods: {
        addMarker() {
            if (this.markersPlugin) {
                let marker = this.getMarkDeatil(this.location);
                this.markersPlugin.addMarker(marker);
                this.detail.style.markers.push(marker);
            }
        },
        deleteMarker() {
            if (this.selectMarkerId && this.markersPlugin) {
                this.markersPlugin.removeMarker(this.selectMarkerId);
                this.detail.style.markers = this.detail.style.markers.filter((item) => item.id !== this.selectMarkerId);
            }
        },
        onContextmenu(event) {
            this.$contextmenu({
                items: [
                    {
                        label: '增加锚点',
                        icon: 'el-icon-location-outline',
                        onClick: () => {
                            this.addMarker();
                        },
                    },
                    {
                        label: '删除锚点',
                        divided: true,
                        icon: 'el-icon-delete',
                        onClick: () => {
                            this.deleteMarker();
                        },
                    },
                    {
                        label: '取消',
                        icon: 'el-icon-circle-close',
                        onClick: () => {},
                    },
                ],
                event, // 鼠标事件信息
                customClass: 'custom-class', // 自定义菜单 class
                zIndex: 9999, // 菜单样式 z-index
                minWidth: 230, // 主菜单最小宽度
            });

            return true;
        },
        destoryVR() {
            if (this.viewer)
                try {
                    this.viewer.destroy();
                    console.log('VR视图已销毁');
                } catch (e) {
                    console.log(e);
                    const viewer = this_.$refs.psvdbg;
                    viewer.removeChild(viewer.childNodes[0]);
                    console.log('VR视图已销毁');
                }
        },
        hideContextMenu(event) {
            console.log('event', event);
        },
        init(url, markers) {
            console.log('markers', markers);
            let this_ = this;
            let initMarks = [];
            markers.forEach((item) => {
                initMarks.push(this.getMarkDeatil({ latitude: item.latitude, longitude: item.longitude }));
            });
            console.log('initMarks', initMarks);
            this.viewer = new Viewer({
                panorama: url, // 图片路径
                container: this_.$refs.psvdbg, // 容器
                caption: 'FastBee', //说明文字
                navbar: true, //是否展示工具栏
                size: {
                    width: '100%',
                    height: '100%',
                },
                plugins: [
                    [
                        MarkersPlugin,
                        {
                            markers: initMarks,
                        },
                    ],
                ],
                navbar: {
                    maxFov: 100,
                },
            });
            this.markersPlugin = this.viewer.getPlugin(MarkersPlugin);
            if (this.editMode) {
                this.markersPlugin.on('over-marker', (e, marker) => {
                    console.log(`Cursor is over marker ${marker.id}`);
                });
                this.markersPlugin.on('select-marker', (e, marker) => {
                    console.log(`Cursor is select marker ${marker.id}`);
                    this.selectMarkerId = marker.id;
                });
                this.viewer.on('click', (e, data) => {
                    console.log(`${data.rightclick ? 'right ' : ''}clicked at longitude: ${data.longitude} latitude: ${data.latitude}`);
                    this.location = {
                        longitude: data.longitude,
                        latitude: data.latitude,
                    };
                });
            } else {
                this.markersPlugin.on('select-marker', (e, marker) => {
                    console.log(`Cursor is select marker ${marker.id}`);
                });
            }
            this.viewer.once('ready', () => {
                console.log(`viewer is ready`);
            });
        },
        getMarkDeatil(data) {
            const num = 1 + Math.round(Math.random() * 2);
            let marker = {
                id: uid(),
                status: 1,
                anchor: 'center center',
                image: VRImg,
                width: 50,
                height: 50,
                latitude: data.latitude,
                longitude: data.longitude,
                tooltip: {
                    content: `<span>标记${num}</span>`,
                    position: 'center top',
                    trigger: 'hover',
                },
                type: 'marker',
            };
            return marker;
        },
    },
};
</script>

<style>
.vrClass {
    height: 100%;
    width: 100%;
}
</style>
