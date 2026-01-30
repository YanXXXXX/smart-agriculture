<template>
    <div
        :style="{
            fontSize: detail.style.fontSize + 'px',
            fontFamily: detail.style.fontFamily,
            color: detail.style.foreColor,
            textAlign: detail.style.textAlign,
            lineHeight: detail.style.position.h + 'px',
            border: detail.style.waterBorderWidth + 'px solid !important',
            borderRadius: detail.style.borderRadius + 'px !important',
            borderColor: detail.style.waterBorderColor,
        }"
        :class="classStyle"
        :id="detail.identifier"
    >
        {{ detail.style.text }}
        <div v-show="false">{{ dataInit }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseView from './View';
import topoUtil from '@/utils/topo/topo-util';
import { getAnimate } from '@/utils/topo/anime';

export default {
    name: 'view-text',
    extends: BaseView,
    data() {
        return {
            classStyle: null,
        };
    },
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        dataInit() {
            if (this.mqttData) {
                // 数显款数值初始化
                if (this.detail.dataBind.identifier && this.mqttData.serialNumber == this.detail.dataBind.serialNumber) {
                    const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                    if (message) {
                        let value = !message.value ? 0 : message.value;
                        if (this.detail.componentShow.indexOf('参数绑定') > -1) {
                            let unit = this.detail.dataBind.unit == null ? '' : this.detail.dataBind.unit;
                            this.detail.style.text = value + unit;
                        }
                    }
                }
                // 动画初始化
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
                                // 显隐判断
                                getAnimate().set(document.getElementById(this.detail.identifier), {
                                    display: 'block',
                                });
                            }
                            if (this.animateView) {
                                this.animateView.play();
                            }
                        } else {
                            if (this.detail.dataBind.xyAction) {
                                // 显隐判断
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
            }
        },
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.view-text {
    height: 100%;
    width: 100%;
}
</style>
