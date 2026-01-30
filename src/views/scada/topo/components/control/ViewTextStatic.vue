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
        }"
    >
        {{ detail.style.text }}
        <div v-show="false">{{ dataInit }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseView from './View';
import topoUtil from '@/utils/topo/topo-util';

export default {
    name: 'view-text-static',
    extends: BaseView,
    data() {
        return {
            dialogVisible: false,
            timer: null,
        };
    },
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        dataInit() {
            this.$nextTick(function () {
                this.getDeviceStatistic();
            });
            return this.detail.dataBind.staticType + '-' + this.detail.dataBind.staticMethod + '-' + this.detail.dataBind.staticDate;
        },
    },
    methods: {
        getDeviceStatistic() {
            if (this.detail.dataBind.paramName && this.detail.dataBind.staticMethod) {
                let url = 'prod-api/ghxx/bDeviceManager/getDeviceStatistic';
                let params = {
                    queryType: this.detail.dataBind.staticMethod,
                    ztGuid: this.$route.query.guid,
                    paramNames: this.detail.dataBind.paramName,
                    queryDate: this.detail.dataBind.staticDate,
                };
                this.$axios({
                    url: url,
                    method: 'get',
                    params: params,
                }).then((res) => {
                    if (res.data.data.returnCount) {
                        this.detail.style.text = res.data.data.returnCount;
                    } else {
                        this.detail.style.text = 0;
                    }

                    // console.log("数统计",res.data);
                });
            } else if (this.detail.dataBind.staticType) {
                let url = 'prod-api/ghxx/bDeviceManager/getDeviceStatistic';
                let params = {
                    queryType: this.detail.dataBind.staticType,
                };
                this.$axios({
                    url: url,
                    method: 'get',
                    params: params,
                }).then((res) => {
                    if (res.data.data.returnCount) {
                        this.detail.style.text = res.data.data.returnCount;
                    } else {
                        this.detail.style.text = 0;
                    }
                    // console.log("数统计",res.data);
                });
            }
        },
    },
    mounted() {
        this.getDeviceStatistic();
        this.timer = setInterval(() => {
            this.getDeviceStatistic();
        }, 60000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="scss" scoped></style>
