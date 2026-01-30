<template>
    <div class="monitor">
        <LayOut :bg="bg" :title="title">
            <!-- 左边 大树 -->
            <template v-slot:seven>
                <tree :baseId="baseId"></tree>
            </template>
            <!-- 右上 视频播放 -->
            <template v-slot:two>
                <camera :baseId="baseId"></camera>
            </template>
            <!-- 右中 害虫监测 -->
            <template v-slot:three>
                <bug-chart :baseId="baseId"></bug-chart>
            </template>
            <!-- 下右 设备统计 -->
            <template v-slot:six>
                <device-chart :baseId="baseId"></device-chart>
            </template>
        </LayOut>
    </div>
</template>

<script>
import LayOut from "../layOut.vue";
import Camera from "./Camera.vue";
import BugChart from "./BugChart.vue";
import DeviceChart from "./DeviceChart.vue";
import Tree from './Tree.vue';
import SinglePlayer from "@/views/components/player/SinglePlayer";

export default {
    props: {
        baseId:Number
    },
    components: {LayOut,Camera, BugChart,DeviceChart,Tree,SinglePlayer},
    data() {
        return {
            bg: require("../img/bg.png"),
            title: [
                "视频监控",
                "害虫监测数据",
                "气象站环境检测",
                "气象站图表统计",
                "设备统计",
            ],

        };
    }
};
</script>

<style lang="scss" scoped>

</style>
