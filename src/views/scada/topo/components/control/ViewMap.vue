<template>
    <div>
        <baidu-map
            id="mapContainer"
            :center="center"
            @ready="ready"
            :zoom="zoom"
            :scroll-wheel-zoom="true"
            :style="{
                width: detail.style.position.w + 'px',
                height: detail.style.position.h + 'px',
            }"
        >
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" v-if="false"></bm-city-list>
            <!-- 城市列表 -->
            <bm-marker
                v-for="item of points"
                v-bind:key="item.deviceId"
                :position="{ lng: item.longitude, lat: item.latitude }"
                :dragging="false"
                @click="clickHandler(item.deviceId)"
                :icon="{ url: judge(item.status), size: { width: 40, height: 40 } }"
            >
                <bm-info-window :show="item.deviceId == currIndex" @close="infoWindowClose" :height="180" :width="230">
                    <el-row>
                        <el-col :span="24">
                            <div class="grid-content bg-purple-dark proSize">
                                <span>设备编号：</span>
                                <span>{{ item.serialNumber }}</span>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <div class="grid-content bg-purple-dark proSize">
                                <span>设备名称：</span>
                                <span>{{ item.deviceName }}</span>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <div class="grid-content bg-purple-dark proSize">
                                <span>所在地址：</span>
                                <span>{{ item.networkAddress }}</span>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <div class="grid-content bg-purple-dark proSize">
                                <span>设备状态：</span>
                                <el-tag type="warning" v-if="item.status == 1">未激活</el-tag>
                                <el-tag type="danger" v-if="item.status == 2">禁用</el-tag>
                                <el-tag type="success" v-if="item.status == 3">在线</el-tag>
                                <el-tag type="info" v-if="item.status == 4">离线</el-tag>
                            </div>
                        </el-col>
                    </el-row>
                </bm-info-window>
            </bm-marker>
        </baidu-map>
        <div v-show="false">{{ mapModel }}</div>
    </div>
</template>

<script>
import BaseView from './View';
import onlineImg from '@/assets/images/marker-online.png';
import offlineImg from '@/assets/images/marker-offline.png';
import inactiveImg from '@/assets/images/marker-inactive.png';
import forbiddenImg from '@/assets/images/marker-forbidden.png';
import { listAllDeviceShort } from '@/api/iot/device';

export default {
    name: 'view-map',
    extends: BaseView,
    props: {},
    data() {
        return {
            center: { lng: 116.40605, lat: 39.915879 },
            zoom: 10,
            points: [], // 地图点 集合
            currIndex: -1,
            timer: null,
            map: null,
            changeModel: '',
            deviceMac: '',
            deviceData: [],
            onlineImg: onlineImg,
            offlineImg: offlineImg,
            inactiveImg: inactiveImg,
            forbiddenImg: forbiddenImg,
        };
    },
    computed: {
        mapModel() {
            this.changeModel = this.detail.style.mapModel;
        },
    },
    watch: {
        changeModel(newVal, oldVal) {
            if (this.map) {
                this.map.setMapStyle({ style: this.detail.style.mapModel });
            }
        },
    },
    mounted() {
        this.getList('init');
        this.timer = setInterval(this.getlist, 60000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
    methods: {
        ready({ BMap, map }) {
            this.map = map;
            if (this.detail.style.mapModel != 'normal') {
                this.map.setMapStyle({ style: this.detail.style.mapModel });
            }
        },
        getList() {
            listAllDeviceShort().then((res) => {
                if (res.code == 200) {
                    this.setZoom(res.rows);
                    this.points = res.rows;
                }
            });
        },
        //设备图标
        judge(status) {
            if (status == 3) {
                return this.onlineImg;
            } else if (status == 4) {
                return this.offlineImg;
            } else if (status == 1) {
                return this.inactiveImg;
            } else {
                return this.forbiddenImg;
            }
        },
        // 设置中心点和zoom的值
        setZoom(sdata) {
            if (sdata.length > 0) {
                let maxLng = sdata[0].longitude;
                let minLng = sdata[0].longitude;
                let maxLat = sdata[0].latitude;
                let minLat = sdata[0].latitude;

                for (let i = 0; i < sdata.length; i++) {
                    if (sdata[i].longitude > maxLng) {
                        maxLng = sdata[i].longitude;
                    }
                    if (sdata[i].longitude < minLng) {
                        minLng = sdata[i].longitude;
                    }
                    if (sdata[i].latitude > maxLat) {
                        maxLat = sdata[i].latitude;
                    }
                    if (sdata[i].latitude < minLat) {
                        minLat = sdata[i].latitude;
                    }
                }
                let cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
                let cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
                this.center.lng = cenLng;
                this.center.lat = cenLat;
                let zoom = ['50', '100', '200', '500', '1000', '2000', '5000', '10000', '20000', '25000', '50000', '100000', '200000', '500000', '1000000', '2000000'];
                let averLng = this.rad(maxLng) - this.rad(minLng);
                let averLat = this.rad(maxLat) - this.rad(minLat);
                let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(averLat / 2), 2) + Math.cos(this.rad(maxLat)) * Math.cos(this.rad(minLat)) * Math.pow(Math.sin(averLng / 2), 2)));
                s = s * 6378.137;
                s = Math.round(s * 10000) / 10000;
                s = s.toFixed(2);

                for (let i = 0; i < zoom.length; i++) {
                    if (zoom[i] - s > 0) {
                        this.zoom = 8 - i + 3;
                        break;
                    }
                }
            } else {
                // 没有坐标，显示全中国
                this.center.lng = 103.388611;
                this.center.lat = 35.563611;
                this.zoom = 5;
            }
        },
        rad(d) {
            return (d * Math.PI) / 180.0;
        },
        // 控制info弹窗显示/隐藏
        clickHandler(key) {
            this.currIndex = key;
        },
        infoWindowClose() {
            this.currIndex = -1;
        },
    },
};
</script>

<style lang="scss">
.proSize {
    font-size: 13px;
    margin: 10px 0;
}
</style>
