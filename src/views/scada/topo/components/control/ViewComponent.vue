<template>
    <div class="view-component" :id="detail.identifier" ref="xcomp">
        <div v-show="false">{{ animateChange }}</div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import BaseView from './View.vue';
import topoUtil from '@/utils/topo/topo-util';
import { getAnimate } from '@/utils/topo/anime';
import { getComponent } from '@/api/scada/component';

export default {
    name: 'view-component',
    extends: BaseView,
    data() {
        return {
            data: {
                componentTemplate: '',
                componentStyle: '',
                componentScript: '',
            },
        };
    },
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        animateChange() {
            if (this.mqttData) {
                // 动画初始化
                if (
                    this.detail.dataAction.serialNumber &&
                    this.detail.dataAction.identifier &&
                    this.detail.dataAction.paramJudge &&
                    this.detail.dataAction.paramJudgeData != undefined &&
                    this.mqttData.serialNumber == this.detail.dataAction.serialNumber
                ) {
                    const message = this.mqttData.message.find((item) => item.id === this.detail.dataAction.identifier);
                    if (message) {
                        let val = message.value;
                        let isGd = topoUtil.judgeSize(this.detail.dataAction.paramJudge, val, this.detail.dataAction.paramJudgeData);
                        if (isGd) {
                            if (this.detail.dataBind.xyAction) {
                                // 显隐判断
                                getAnimate().set(document.getElementById(this.detail.identifier), {
                                    display: 'block',
                                });
                            }
                            if (this.animateView) {
                                this.animateView.play();
                            }
                        } else {
                            if (this.detail.dataBind.xyAction) {
                                // 显隐判断
                                getAnimate().set(document.getElementById(this.detail.identifier), {
                                    display: 'none',
                                });
                            }
                            if (this.animateView) {
                                this.animateView.pause();
                            }
                        }
                    }
                }
            }
        },
    },
    mounted() {
        this.initEchart();
    },
    methods: {
        initEchart() {
            let id = this.detail.dataBind.componentId;
            this.getComponentDataById(id);
        },
        // 获取自定义Component详情
        getComponentDataById(id) {
            getComponent(id).then((res) => {
                if (res.code === 200) {
                    this.data = res.data;
                    this.loadData();
                }
            });
        },
        loadData() {
            let template = this.data.componentTemplate;
            if (!template) return;
            let styleCss = this.data.componentStyle;
            let style = document.createElement('style');
            style.innerHTML = styleCss;
            document.head.appendChild(style);
            let script = this.data.componentScript;
            if (script) {
                script = script.replace(/export default/, 'return');
            }
            let obj = new Function(script)();
            obj.template = template;
            let Profile = Vue.extend(obj);
            if (this.$refs.xcomp.innerHTML) {
                this.$refs.xcomp.innerHTML = '';
            }
            let newDiv = document.createElement('div');
            newDiv.setAttribute('id', `xcomp-${this.data.id}`);
            this.$refs.xcomp.appendChild(newDiv);
            new Profile().$mount(`#xcomp-${this.data.id}`);
        },
    },
};
</script>

<style lang="scss">
.view-component {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow-y: auto;
}
</style>
