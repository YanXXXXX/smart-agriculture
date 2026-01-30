<template>
    <div class="data-panel-wrap">
        <div class="content-wrap" v-if="data.items">
            <template v-for="(item, index) in data.items">
                <div class="data-item" :key="index" draggable="true" v-if="!item.isHide || item.isHide == false" @dragstart="handleDragstart($event, item)">
                    <!-- svg图片 -->
                    <template v-if="item.type === 'svg'">
                        <svg-icon class="data-item-icon" :icon-class="item.icon" />
                        <div class="data-item-text">{{ item.text }}</div>
                    </template>
                    <!-- 阿里巴巴矢量图标 -->
                    <template v-else-if="item.isFontIcon === 1">
                        <div class="item-icon">
                            <i class="icon iconfont" :class="item.icon"></i>
                        </div>
                        <div class="data-item-text">
                            {{ item.text }}
                        </div>
                    </template>
                    <!-- 本地图片 -->
                    <template v-else-if="item.type === 'static' && item.icon">
                        <img class="data-item-icon" :src="require('@/assets/topo-img/' + item.icon)" />
                        <span class="data-item-text">{{ item.text }}</span>
                    </template>
                    <!-- 网络图片 -->
                    <template v-else-if="(item.type === 'service' && item.info.type == 'image') || 'chart-wrapper'">
                        <img class="data-item-icon" :src="item.icon" @mouseover="handleImgMouseover($event, item)" @mouseleave="isShow = false" />
                        <span class="data-item-text">{{ item.text }}</span>
                    </template>
                    <template v-else>
                        <svg-icon class="data-item-icon" :icon-class="item" />
                    </template>
                </div>
            </template>
        </div>
        <el-empty v-else :image-size="50">
            <span slot="description" style="color: #82848a; font-size: 12px">暂无数据</span>
        </el-empty>
        <div :style="{ top: imageTop + 'px', left: `${sidebarStatus ? 480 : 333}` + 'px' }" class="img-hover" v-if="isShow">
            <img class="img-wrap" :src="imageHover.icon" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'DataPanel',
    props: {
        data: Object,
    },
    computed: {
        ...mapState({
            sidebarStatus: (state) => state.app.sidebar.opened,
        }),
    },
    data() {
        return {
            imageHover: {
                icon: '',
                text: '',
            },
            imageTop: 0,
            isShow: false,
        };
    },
    created() {},
    methods: {
        handleDragstart(event, info) {
            var infoJson = JSON.stringify(info.info);
            console.log('左边栏开始拖拽', info);
            event.dataTransfer.setData('my-info', infoJson);
        },
        // 图片预览
        handleImgMouseover(event, value) {
            this.imageHover = value;
            this.imageTop = event.pageY - 20;
            this.isShow = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.data-panel-wrap {
    background-color: #f1f3f4;

    .content-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;

        .data-item {
            width: 33.3%;
            height: 78px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .data-item-icon {
                width: 28px;
                height: 28px;
            }

            .data-item-text {
                font-size: 12px;
                line-height: normal;
                text-align: center;
                margin-top: 10px;
            }
        }

        .data-item:hover {
            border: #ccc solid 1px;
            background: #909399cc;
            color: #ffffff;
            border-radius: 5px;
            cursor: pointer;
        }
    }

    .img-hover {
        position: fixed;
        z-index: 9999;
        text-align: center;
        background-color: #ffff;
        padding: 10px;
        border-radius: 5px;

        .img-wrap {
            height: 150px;
            width: 150px;
        }
    }
}
</style>
