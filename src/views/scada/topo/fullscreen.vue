<template>
    <div class="full-screen-wrap" :style="{ height: contentHeight + 'px' }">
        <topo-render :params="params" :defaultValue="selectedValue" :isShare="isShare" />
    </div>
</template>

<script>
import TopoRender from './components/topoRender';

export default {
    name: 'TopoFullscreen',
    components: {
        TopoRender,
    },
    props:{
        params:Object
    },
    data() {
        return {
            contentHeight: 500,
            selectedValue: 100,
            isShare: false,
        };
    },
    mounted() {
        if (this.$route.query.isShare) {
            this.isShare = true;
        }
        this.calculateContentHeight();
        window.addEventListener('resize', this.calculateContentHeight, true);
    },
    methods: {
        // 获取窗体高度
        calculateContentHeight() {
            let originalHeight = document.getElementById('app').offsetHeight;
            this.contentHeight = parseFloat(originalHeight);
        },
    },
};
</script>

<style lang="scss" scoped>
.full-screen-wrap {
    position: relative;
    width: 100%;
    height: 500px;
}
</style>
