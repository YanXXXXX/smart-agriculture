<template>
    <div>
        <el-image
            v-if="editMode"
            :style="{
                width: this.detail.style.position.w + 'px',
                height: this.detail.style.position.h + 'px',
            }"
            :src="imageUrl"
            @dragstart.prevent
            @dragover.prevent
            @drop.prevent
        ></el-image>
        <div id="playWind" v-else></div>
    </div>
</template>

<script>
import EZUIKit from 'ezuikit-js';

import BaseView from './View';
import videoImage from '@/assets/images/video.jpg';

export default {
    name: 'view-video',
    extends: BaseView,
    props: {},
    data() {
        return {
            imageUrl: videoImage,
        };
    },
    computed: {},
    mounted() {
        var url = 'ezopen://open.ys7.com/' + this.detail.dataBind.serialNumber + '/' + this.detail.dataBind.channelNumber + '.live';
        if (!this.editMode) {
            //this.initToken();
            this.initVideo(url, this.detail.style.position.w - 15, this.detail.style.position.h - 15, this.detail.dataBind.accessToken);
        }
    },
    methods: {
        initToken() {
            let param = {
                appKey: 'fc3ae70b344445db992f0cb9c8fb41d8',
                appSecret: 'a34cd9d8cb2ae65642349b77c2b391e2',
            };
            this.$axios({
                url: 'https://open.ys7.com/api/lapp/token/get?appKey=fc3ae70b344445db992f0cb9c8fb41d8&appSecret=a34cd9d8cb2ae65642349b77c2b391e2',
                method: 'post',
                Header: { 'Access-Control-Allow-Origin': 'https://open.ys7.com' },
            })
                .then((res) => {
                    console.log('获取token成功!', res);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        initVideo(url, width, height, accessToken) {
            var EZOPENDemo;
            window.EZOPENDemo = EZOPENDemo;
            var width = width;
            var height = height;
            const ezopenInit = () => {
                EZOPENDemo = new EZUIKit.EZUIKitPlayer({
                    id: 'playWind',
                    width: width,
                    height: height,
                    template: 'pcLive',
                    url: url,
                    accessToken: accessToken,
                });
            };
            ezopenInit();
        },
    },
};
</script>

<style lang="scss">
.view-video {
    height: 100%;
    width: 100%;
}
</style>
