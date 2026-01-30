<template>
    <div :key="key">
        <dv-scroll-board
            :config="{
                rowNum: this.detail.style.rowNum,
                data: this.detail.style.data,
                header: this.detail.style.header,
                headerBGC: this.detail.style.headerBGC,
                oddRowBGC: this.detail.style.oddRowBGC,
                evenRowBGC: this.detail.style.evenRowBGC,
                waitTime: this.detail.style.waitTime,
                headerHeight: this.detail.style.headerHeight,
                columnWidth: this.detail.style.columnWidth.split(','),
                align: this.detail.style.align,
                index: this.detail.style.index,
                indexHeader: this.detail.style.indexHeader,
                carousel: this.detail.style.carousel,
            }"
            :style="{
                width: detail.style.position.w + 'px',
                height: detail.style.position.h + 'px',
                color: detail.style.foreColor,
            }"
        />
    </div>
</template>

<script>
import BaseView from './View';
import { listAlertLog } from '@/api/iot/alertLog';

export default {
    name: 'view-order',
    dicts: ['iot_alert_level'],
    extends: BaseView,
    computed: {},
    data() {
        return {
            timer: null,
            key: 0,
        };
    },
    mounted() {
        this.getList();
        this.timer = setInterval(() => {
            this.getList();
        }, 60000 * 5);
    },
    methods: {
        getList() {
            let params = {
                status: 3,
                pageNum: 1,
                pageSize: 9999,
            };
            listAlertLog(params).then((res) => {
                if (res.code === 200) {
                    let data = [];
                    res.rows.forEach((item) => {
                        let mdata = [item.createTime, item.alertName, item.deviceName, this.getSpecifiedElement(this.dict.type.iot_alert_level, item.alertLevel), item.remark];
                        data.push(mdata);
                    });
                    this.detail.style.data = data;
                    this.key = new Date().getTime();
                }
            });
        },
        getSpecifiedElement(dict, val) {
            let obj = dict.find((item) => item.value == val);
            if (obj && (obj.raw.listClass == 'default' || !obj.raw.listClass)) {
                return obj.label;
            } else {
                return `<span style="color:${this.getColor(obj.raw.listClass)};">${obj.label}</span>`;
            }
        },
        getColor(type) {
            switch (type) {
                case 'primary':
                    return '#1890ff';
                case 'success':
                    return '#13ce66';
                case 'warning':
                    return '#ffba00';
                case 'danger':
                    return '#ff4949';
            }
        },
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="scss" scoped></style>
