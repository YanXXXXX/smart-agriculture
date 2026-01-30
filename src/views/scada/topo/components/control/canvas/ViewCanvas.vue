<script>
import { mapState } from 'vuex';

import BaseVeiw from '../View';
import topoUtil from '@/utils/topo/topo-util';

export default {
    name: 'ViewCanvas',
    extends: BaseVeiw,
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        dataInit: function () {
            // console.log("组件填充",this.mqttData);
            if (this.detail.dataBind.identifier && this.mqttData && this.mqttData.serialNumber == this.detail.dataBind.serialNumber) {
                let val = '';
                let foreColor = '';
                const message = this.mqttData.message.find((item) => item.id === this.detail.dataBind.identifier);
                if (message) {
                    val = message.value;
                    this.detail.dataBind.stateList.forEach((element) => {
                        let isSure = topoUtil.judgeSize(element.paramCondition, val, element.paramData);
                        if (isSure) {
                            foreColor = element.foreColor;
                        }
                    });
                }

                if (foreColor) {
                    this.detail.style.foreColor = foreColor;
                }
            }
        },
    },
    watch: {
        detail: {
            handler(newVal, oldVal) {
                this.onResize();
            },
            deep: true,
        },
        dataInit: {},
    },
    methods: {
        getForeColor() {
            var foreColor = this.detail.style.foreColor;
            if (foreColor == undefined || foreColor === '') {
                return 'grey';
            } else if (foreColor.startsWith('#')) {
                return this.hex2rgba(foreColor);
            } else {
                return foreColor;
            }
        },
        hex2rgba(hex) {
            //颜色转换
            // hex格式如#ffffff
            let colorArr = [];
            for (let i = 1; i < 7; i += 2) {
                colorArr.push(parseInt('0x' + hex.slice(i, i + 2))); // 16进制值转10进制
            }
            var alpha = parseInt('0x' + hex.slice(7, 9)) / 255; // 16进制值转10进制
            return `rgba(${colorArr.join(',')},${alpha})`;
        },
        inRange(x, y, points) {
            //边界检测-只能检测凸边形（检测点在不在多边形里面）
            // points表示多边形的顶点集合
            let inside = false;
            for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                let xi = points[i][0],
                    yi = points[i][1];
                let xj = points[j][0],
                    yj = points[j][1];
                let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
                if (intersect) inside = !inside;
            }
            return inside;
        },
    },
    mounted() {},
};
</script>
