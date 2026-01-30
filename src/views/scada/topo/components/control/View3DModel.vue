<template>
    <div
        :class="editMode ? 'modelClass' : 'lala'"
        :style="{
            height: detail.style.position.h + 'px',
            backgroundColor: detail.style.backColor,
        }"
    >
        <iframe v-if="editMode" style="width: 100%" :src="detail.modelUrl" frameborder="0" :width="detail.style.position.w" :height="detail.style.position.h - 10"></iframe>
        <iframe v-else style="width: 100%" :src="detail.modelUrl" frameborder="0" :width="detail.style.position.w" :height="detail.style.position.h"></iframe>

    </div>
</template>

<script>
import { ModelObj, ModelCollada, ModelFbx } from 'vue-3d-model';
import BaseView from './View';

export default {
    name: 'view-3D',
    components: { ModelObj, ModelCollada, ModelFbx },
    extends: BaseView,
    props: {},
    data() {
        return {
            baseApi: process.env.VUE_APP_BASE_API,
        };
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
.view-image {
    height: 100%;
    width: 100%;
}
.modelClass {
    padding: 5px;
    overflow: hidden;
}
</style>
