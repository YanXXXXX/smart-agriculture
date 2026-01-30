<template>
    <div
        :style="{
            fontSize: detail.style.fontSize + 'px',
            fontFamily: detail.style.fontFamily,
            color: detail.style.foreColor,
            textAlign: detail.style.textAlign,
            border: detail.style.waterBorderWidth + 'px solid !important',
            borderRadius: detail.style.borderRadius + 'px !important',
            borderColor: detail.style.waterBorderColor,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }"
    >
        <iframe :style="{ width: detail.style.position.w - 20 + 'px', height: detail.style.position.h - 20 + 'px', border: 'transparent' }" :src="childUrl"></iframe>
        <div v-show="false">{{ dataInit }}</div>
    </div>
</template>

<script>
import BaseView from './View';

export default {
    name: 'view-text',
    extends: BaseView,
    data() {
        return {
            childUrl: '',
        };
    },
    computed: {
        dataInit() {
            if (this.detail.dataBind.ztPageData) {
                let split = this.detail.dataBind.ztPageData.split('&');
                this.childUrl = window.location.origin + '/topo/fullscreen?&id=' + split[0] + '&guid=' + split[1] + '&t=' + new Date().getTime();
            }
            return this.detail.dataBind.ztPageData;
        },
    },
    methods: {},
};
</script>

<style lang="scss" scoped></style>
