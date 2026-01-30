<template>
    <div class="view-image-common" :style="animationClass" :id="detail.identifier">
        <img :style="[filterClass]" :src="imageURL" @dragstart.prevent @dragover.prevent @drop.prevent />
        <svg id="svg">
            <defs>
                <filter :id="detail.identifier + '_svg'">
                    <feColorMatrix color-interpolation-filters="sRGB" type="matrix" :values="hexTofeColorMatrix(detail.style.foreColor)" />
                </filter>
            </defs>
        </svg>
        <div v-show="false">{{ dataInit }}{{ preview }}{{ colorChange }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseView from './View';
import topoUtil from '@/utils/topo/topo-util';
import { getAnimate } from '@/utils/topo/anime';

export default {
    name: 'view-image-common',
    extends: BaseView,
    props: {},
    data() {
        return {
            filterClass: {
                width: '100%',
                height: '100%',
                filter: '',
                position: 'absolute',
                animation: this.detail.hdClassName + ' 5s infinite',
            },
            animationClass: {},
        };
    },
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
        imageURL: function () {
            if (this.detail.style.url) {
                return this.detail.style.url;
            }
        },
        preview() {
            if (this.editMode && this.detail.dataAction.translateList && this.detail.dataBind.hdAction) {
                let translates = [];
                this.detail.dataAction.translateList.forEach((element) => {
                    if (element.direction == '竖直') {
                        translates.push({ translateY: -element.position });
                    } else {
                        translates.push({ translateX: element.position });
                    }
                });
                let domId = document.getElementById(this.detail.identifier);
                this.removeAnimate(domId);
                this.translateAnimate(domId, translates, this.detail.dataAction.duration * 1000, true, false);
            }
        },
        dataInit() {
            if (this.mqttData) {
                // 动作初始化
                if (
                    this.detail.dataAction.serialNumber &&
                    this.detail.dataAction.identifier &&
                    this.detail.dataAction.paramJudge &&
                    this.detail.dataAction.paramJudgeData != undefined &&
                    this.mqttData.serialNumber == this.detail.dataAction.serialNumber
                ) {
                    const message = this.mqttData.message.find((item) => item.id === this.detail.dataAction.identifier);
                    if (message) {
                        let val = message.value;
                        let isGd = topoUtil.judgeSize(this.detail.dataAction.paramJudge, val, this.detail.dataAction.paramJudgeData);
                        if (isGd) {
                            if (this.detail.dataBind.xyAction) {
                                //显隐判断
                                getAnimate().set(document.getElementById(this.detail.identifier), {
                                    display: 'block',
                                });
                            }
                            if (this.animateView) {
                                this.animateView.play();
                            }
                        } else {
                            if (this.detail.dataBind.xyAction) {
                                //显隐判断
                                getAnimate().set(document.getElementById(this.detail.identifier), {
                                    display: 'none',
                                });
                            }
                            if (this.animateView) {
                                this.animateView.pause();
                            }
                        }
                    }
                }
                // 颜色初始化
                if (this.detail.dataBind.identifier && this.mqttData && this.mqttData.serialNumber == this.detail.dataBind.serialNumber) {
                    const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                    if (message) {
                        let val = message.value;
                        this.detail.dataBind.stateList.forEach((element) => {
                            let isSure = topoUtil.judgeSize(element.paramCondition, val, element.paramData);
                            if (isSure) {
                                let foreColor = element.foreColor;
                                this.detail.style.foreColor = foreColor;
                            }
                        });
                    }
                }
            }
        },
    },
    methods: {
        //滤镜颜色
        hexTofeColorMatrix(rgba) {
            if (!rgba) {
                return '';
            }
            let hex =
                '#' +
                rgba
                    .match(/\d+/g)
                    .map((d) => (+d).toString(16))
                    .join('');
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

<style lang="scss" scoped>
.view-image-common {
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

// //显示隐藏
// .auto-show {
//     display: block
// }

// .auto-hide {
//     display: none
// }

// // 自动旋转-快
// .auto-rotate-fast {
//     width: 100px;
//     height: 100px;
//     animation: zc 0.5s linear infinite;
//     transform-origin: center center;
// }

// //自动旋转-中
// .auto-rotate-not-fast {
//     width: 100px;
//     height: 100px;
//     animation: zc 1s linear infinite;
//     transform-origin: center center;
// }

// //自动旋转-慢
// .auto-rotate-slow {
//     width: 100px;
//     height: 100px;
//     animation: zc 2s linear infinite;
//     transform-origin: center center;
// }

// @keyframes zc {
//     0% {
//         transform: rotate(0deg);
//     }

//     100% {
//         transform: rotate(360deg);
//     }
// }

// //闪烁
// .twinkle {
//     animation: twinkle-item 1s 2s both infinite;
//     width: 100px;
//     height: 100px;
// }

// @keyframes twinkle-item {
//     0% {
//         transform: scale(1);
//     }

//     10%,
//     20% {
//         transform: scale(0.5) rotate(-3deg);
//     }

//     30%,
//     50%,
//     70%,
//     90% {
//         transform: scale(1) rotate(3deg);
//     }

//     40%,
//     60%,
//     80% {
//         transform: scale(1) rotate(-3deg);
//     }

//     100% {
//         transform: scale(0.9) rotate(0);
//     }
// }
</style>
