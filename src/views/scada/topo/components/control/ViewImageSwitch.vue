<template>
    <div class="view-image-switch">
        <template>
            <img :style="[filterClass]" :src="imageURL" @dragstart.prevent @dragover.prevent @drop.prevent />
        </template>
        <svg id="svg">
            <defs>
                <filter :id="detail.identifier + '_svg'">
                    <feColorMatrix color-interpolation-filters="sRGB" type="matrix" :values="this.hexTofeColorMatrix(detail.style.foreColor)" />
                </filter>
            </defs>
        </svg>
        <div v-show="false">{{ dataInit }}{{ colorChange }}{{ imageUrlChnage }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseView from './View';
import switchImage from '@/assets/topo-img/images/switch_128.png';
import topoUtil from '@/utils/topo/topo-util';
import { listDeviceBind } from '@/api/scada/topo';

export default {
    name: 'view-image-switch',
    extends: BaseView,
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        colorChange() {
            if (this.detail.style.foreColor && this.detail.style.isFilter) {
                this.filterClass.marginLeft = '';
                this.filterClass.filter = 'url(#' + this.detail.identifier + '_svg)';
                this.animationClass = {};
            } else if (this.detail.style.foreColor && this.detail.style.isFilter == false) {
                this.filterClass.marginLeft = '-10000px';
                this.filterClass.filter = 'drop-shadow(5000px 0px ' + this.detail.style.foreColor + ')';
                this.animationClass = {
                    overflow: 'hidden',
                    position: 'relative',
                };
            } else {
                this.animationClass = {};
                this.filterClass.marginLeft = '';
                this.filterClass.filter = '';
            }
            return this.detail.style.foreColor;
        },
        imageUrlChnage() {
            if (this.detail.style.url) {
                this.imageURL = this.detail.style.url;
            } else {
                this.imageURL = switchImage;
            }
            return this.detail.style.url;
        },
        dataInit: function () {
            if (this.detail.dataBind.identifier && this.mqttData && this.mqttData.serialNumber == this.detail.dataBind.serialNumber && this.detail.dataBind.activeName == '变量状态') {
                let val = '';
                const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                if (message) {
                    val = message.value;
                    if (val == null) {
                        val = 0;
                    }
                    this.detail.dataBind.stateList.forEach((element) => {
                        let isSure = topoUtil.judgeSize(element.paramCondition, val, element.paramData);
                        if (this.detail.dataBind.controValue == '0开1关') {
                            if (val == 1) {
                                this.detail.dataAction.actualValue = '关';
                            } else {
                                this.detail.dataAction.actualValue = '开';
                            }
                        } else if (this.detail.dataBind.controValue == '0关1开') {
                            if (val == 0) {
                                this.detail.dataAction.actualValue = '关';
                            } else {
                                this.detail.dataAction.actualValue = '开';
                            }
                        }
                        if (isSure) {
                            this.detail.style.foreColor = element.foreColor;
                            this.imageURL = element.imageUrl;
                        }
                    });
                }
            }
        },
    },
    data() {
        return {
            filterClass: {
                width: '100%',
                height: '100%',
                filter: '',
                position: 'absolute',
                animation: this.detail.hdClassName + ' 5s infinite',
            },
            imageURL: '',
            deviceTimer: null,
        };
    },
    mounted() {
        if (this.detail.dataBind.activeName == '设备状态') {
            this.getDeviceRealStatus(this.detail.dataBind.serialNumber);
            this.deviceTimer = setInterval(() => {
                this.getDeviceRealStatus(this.detail.dataBind.serialNumber);
            }, 60000);
        }
        if (this.detail.style.url) {
            this.imageURL = this.detail.style.url;
        } else {
            this.imageURL = switchImage;
        }
    },
    beforeDestroy() {
        clearInterval(this.deviceTimer);
        this.deviceTimer = null;
    },
    methods: {
        getDeviceRealStatus(serialNumber) {
            const params = {
                pageNum: 1,
                pageSize: 9999,
                serialNumber: serialNumber,
                scadaGuid: this.$route.query.guid,
            };
            listDeviceBind(params)
                .then((res) => {
                    if (res.code == 200) {
                        if (res.rows.length > 0) {
                            let status = res.rows[0].status;
                            if (this.detail.dataBind.openImageUrl && this.detail.dataBind.shutImageUrl) {
                                if (status == 3) {
                                    this.imageURL = this.detail.dataBind.openImageUrl;
                                } else if (status == 4) {
                                    this.imageURL = this.detail.dataBind.shutImageUrl;
                                } else if (status == 2) {
                                    this.imageURL = this.detail.dataBind.warnImageUrl;
                                } else {
                                    this.imageURL = this.imageURL;
                                }
                            } else {
                                this.imageURL = this.imageURL;
                            }
                        } else {
                            this.imageURL = this.imageURL;
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        hexTofeColorMatrix(hex) {
            // console.log('hex',hex);
            if (!hex) {
                hex = '0000';
            }
            hex = hex.replace('#', '');
            let RGB = [];
            let numberList = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
            for (let i = 0; i < hex.length; i += 2) {
                const firstDigit = parseInt(hex[i], 16);

                const firstDigitPartial = firstDigit * 16;

                let RGBValue = parseInt(hex[i + 1], 16) + firstDigitPartial;

                RGBValue = RGBValue / 255;

                RGBValue = RGBValue.toFixed(2);

                RGB.push(RGBValue);
            }

            const red = RGB[0];
            const green = RGB[1];
            const blue = RGB[2];

            numberList[0] = red;
            numberList[6] = green;
            numberList[12] = blue;
            return numberList.join(' ');
        },
    },
};
</script>

<style lang="scss">
.view-image-switch {
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
