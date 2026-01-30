<template>
    <div
        :style="{
            fontSize: detail.style.fontSize + 'px',
            fontFamily: detail.style.fontFamily,
            color: detail.style.foreColor,
            textAlign: textAlign,
            lineHeight: lineHeight + 'px',
        }"
        @click="handleClick('滑动')"
        :id="detail.identifier"
    >
        {{ dateYear }} {{ dateWeek }} {{ dateDay }}
        <div></div>
    </div>
</template>

<script>
import anime from 'animejs'; //动作特效

import BaseView from './View';
import { formatTime1 } from '@/utils/index';

export default {
    name: 'view-text',
    extends: BaseView,
    data() {
        return {
            timing: null,
            dateDay: null,
            dateYear: null,
            dateWeek: null,
            weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            animation: null,
        };
    },
    mounted() {
        this.getTimer();
        this.timeFn();
        //this.listAnimate();
    },
    methods: {
        handleClick(lable) {
            let domId = document.getElementById(this.detail.identifier);
            if (lable == '旋转') {
                this.rotateAnimate(domId, 1000, true, false);
            } else if (lable == '闪烁') {
                this.scaleAnimate(domId, 1500, true, true);
            } else if (lable == '滑动') {
                let translates = [
                    { translateX: 40 },
                    { translateX: 80 },
                    { translateX: 120 },
                    { translateX: 80 },
                    { translateX: 40 },
                    { translateX: 0 },
                    { translateX: -40 },
                    { translateX: -80 },
                    { translateX: -120 },
                    { translateX: -80 },
                    { translateX: -40 },
                    { translateX: 0 },
                ];
                this.translateAnimate(domId, translates, 3000, true, true);
            } else {
                this.getAnimate().set(domId, {
                    translateX: function () {
                        return anime.random(50, 250);
                    },
                    rotate: function () {
                        return anime.random(0, 360);
                    },
                });
            }
        },
        getTimer() {
            this.dateDay = formatTime1(new Date(), 'HH:mm:ss');
            this.dateYear = formatTime1(new Date(), 'yyyy-MM-dd');
            this.dateWeek = this.weekday[new Date().getDay()];
        },
        timeFn() {
            this.timing = setInterval(() => {
                this.dateDay = formatTime1(new Date(), 'HH:mm:ss');
                this.dateYear = formatTime1(new Date(), 'yyyy-MM-dd');
                this.dateWeek = this.weekday[new Date().getDay()];
            }, 1000);
        },
    },
};
</script>
