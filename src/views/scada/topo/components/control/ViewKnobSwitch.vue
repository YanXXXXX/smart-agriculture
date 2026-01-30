<template>
    <div>
        <knob-control :min="-2" :max="2" :stroke-width="8" :value-display-function="toWord" :size="150" primary-color="#E844C3" secondary-color="#E7B6DC" text-color="#E844C3" v-model="semitone"></knob-control>
        <div v-show="false">{{ dataInit }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseView from './View';
import topoUtil from '@/utils/topo/topo-util';

export default {
    name: 'view-knob-switch',
    extends: BaseView,
    data() {
        return {
            toWord: function (val) {
                const map = {
                    '-1': '倒一档',
                    '-2': '倒二档',
                    0: '空挡',
                    1: '一挡',
                    2: '二档',
                };
                return map[val];
            },
            semitone: 0,
        };
    },
    computed: {
        ...mapState({
            mqttData: (state) => state.topoEditor.mqttData,
        }),
        dataInit() {
            console.log('数显框', this.mqttData);
        },
    },
    watch: {
        semitone(newVal, oldVal) {
            console.log(newVal, oldVal);
        },
    },
    methods: {},
};
</script>

<style lang="scss" scoped></style>
