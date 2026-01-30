<template>
    <div ref="setupAngle" class="setupAngle" @mousedown="mousedown = true" @mouseup="mousedown = false" @mousemove="on_mousemove" @mouseleave="mousedown = false">
        <div
            class="container"
            :style="{
                transform: 'rotate(' + angleData + 'deg)',
            }"
        >
            <div class="point"></div>
        </div>
        <div class="content">
            {{ angleData + '°' }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'setupAngle',
    data() {
        return {
            angleData: 0,
            mousedown: false, // 鼠标是否按下
        };
    },
    methods: {
        calculate_degree(x, y, centerX, centerY) {
            // 根据当前坐标和中心坐标计算角度
            const radians = Math.atan2(x - centerX, y - centerY);
            return radians * (180 / Math.PI) * -1 + 180;
        },
        on_mousemove(event) {
            // 鼠标移动事件(按下移动就算拖拽，在元素里移动才算，元素外移动监听)
            if (this.mousedown) {
                // 表示是按下移动的
                const setupAngle = this.$refs.setupAngle;
                let centerX = -~(setupAngle.offsetHeight || setupAngle.height) / 2;
                let centerY = -~(setupAngle.offsetWidth || setupAngle.width) / 2;
                let angle = this.calculate_degree(event.offsetX, event.offsetY, centerX, centerY);
                this.angleData = -~angle;
                this.$emit('angle', angle); // 发送事件
            }
        },
    },
};
</script>

<style scoped lang="scss">
.setupAngle {
    width: 100%;
    height: 100%;
    border: 5px solid #00ced1;
    box-sizing: border-box;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    background-color: #00ced1;
    box-shadow: #00ced1 0px 0px 10px;
    > .container {
        pointer-events: none;
        height: 100%;
        width: fit-content;
        padding: 5px 0;
        box-sizing: border-box;
        > .point {
            width: 15px;
            height: 15px;
            background-color: #e84545;
            border-radius: 50px;
            margin-top: -15px;
        }
    }
    > .content {
        position: absolute;
        font-size: 16px;
        color: #5b748e;
        font-weight: bold;
        pointer-events: none;
    }
}
</style>
