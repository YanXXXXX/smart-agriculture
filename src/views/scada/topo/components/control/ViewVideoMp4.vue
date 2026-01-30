<template>
    <div>
        <single-player :video-param="videoParam" :style="{
            height:detail.style.position.h+'px!important',
            width:detail.style.position.w+'px'
            }"></single-player>
        <div v-show="false">{{ videoParam }}</div>
    </div>
</template>

<script>
import SinglePlayer from "@/views/components/player/SinglePlayer";
import BaseView from './View';

export default {
    name: 'view-text',
    components:{
        SinglePlayer
    },
    extends: BaseView,
    props: {},
    data() {
        return {

        };
    },
    computed: {
        videoParam() {
            return {
                deviceId:this.detail.dataBind.deviceSipId,
                channelId:this.detail.dataBind.channelSipId
            }
        }
    }
};
</script>

<style lang="scss">
.view-text {
    height: 100%;
    width: 100%;
}
.demo {
    padding: 5px;
    background-color: rgba(0, 206, 209, 0);
}
</style>
