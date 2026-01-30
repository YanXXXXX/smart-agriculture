<template>
    <div>
        <div v-show="false">{{ dataInit }}</div>
        <!-- 完整模式 -->
        <div
            :style="{
                fontFamily: detail.style.fontFamily,
                color: detail.style.foreColor,
                width: detail.style.position.w + 'px',
                height: detail.style.position.h + 'px',
                fontWeight: '600',
                border: detail.style.waterBorderWidth + 'px solid',
                borderRadius: detail.style.borderRadius + 'px',
                borderColor: detail.style.waterBorderColor,
                padding: '10px 20px',
            }"
            v-if="detail.style.weatherModel == '完整模式'"
        >
            <div :style="{ fontSize: detail.style.position.h / 13 + 'px', padding: '10px' }">
                <i class="el-icon-place"></i>
                <span>{{ detail.weatherDetail.city }}</span>
            </div>
            <el-row :gutter="20">
                <el-col style="width: auto">
                    <div class="">
                        <img :src="getWeaImage(detail.weatherDetail.wea_img)" :style="{ width: detail.style.position.h / 2 + 'px', height: detail.style.position.h / 2 + 'px' }" />
                    </div>
                </el-col>
                <el-col style="width: auto">
                    <div :style="{ fontSize: detail.style.position.h / 5 + 'px' }">{{ detail.weatherDetail.tem }}°C</div>
                    <div :style="{ fontSize: detail.style.position.h / 13 + 'px' }">{{ detail.weatherDetail.wea }} {{ detail.weatherDetail.win }} {{ detail.weatherDetail.win_speed }}</div>
                </el-col>
            </el-row>
            <div :style="{ fontSize: detail.style.position.h / 13 + 'px' }">
                <span>湿度：{{ detail.weatherDetail.humidity }}</span>
                <span style="margin-left: 10px; margin-right: 10px">|</span>
                <span>气压：{{ detail.weatherDetail.pressure }}</span>
                <span style="margin-left: 10px; margin-right: 10px">|</span>
                <span>
                    空气质量：
                    <span style="color: #ffb527">{{ detail.weatherDetail.air_level }}</span>
                </span>
            </div>
        </div>
        <!-- 简约模式 -->
        <div
            :style="{
                fontFamily: detail.style.fontFamily,
                color: detail.style.foreColor,
                width: detail.style.position.w + 'px',
                height: detail.style.position.h + 'px',
                fontWeight: '600',
                border: detail.style.waterBorderWidth + 'px solid',
                borderRadius: detail.style.borderRadius + 'px',
                borderColor: detail.style.waterBorderColor,
            }"
            v-else
        >
            <div :style="{ fontSize: detail.style.position.h / 13 + 'px', padding: '10px' }">
                <i class="el-icon-place"></i>
                <span>{{ detail.weatherDetail.city }}</span>
            </div>
            <el-row :gutter="20">
                <el-col style="width: auto">
                    <div class="">
                        <img :src="getWeaImage(detail.weatherDetail.wea_img)" :style="{ width: detail.style.position.h / 2 + 'px', height: detail.style.position.h / 2 + 'px' }" />
                    </div>
                </el-col>
                <el-col style="width: auto">
                    <div :style="{ fontSize: detail.style.position.h / 5 + 'px' }">{{ detail.weatherDetail.tem }}°C</div>
                    <div :style="{ fontSize: detail.style.position.h / 10 + 'px' }">
                        {{ detail.weatherDetail.wea }}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import BaseView from './View';
import qing from '@/assets/topo-img/weather/qing.png';
import xue from '@/assets/topo-img/weather/xue.png';
import shachen from '@/assets/topo-img/weather/shachen.png';
import wu from '@/assets/topo-img/weather/wu.png';
import bingbao from '@/assets/topo-img/weather/bingbao.png';
import yun from '@/assets/topo-img/weather/yun.png';
import yu from '@/assets/topo-img/weather/yu.png';
import yin from '@/assets/topo-img/weather/yin.png';
import lei from '@/assets/topo-img/weather/lei.png';

export default {
    name: 'view-weather',
    extends: BaseView,
    props: {},
    data() {
        return {
            qing: qing,
            xue: xue,
            shachen: shachen,
            wu: wu,
            bingbao: bingbao,
            yun: yun,
            yu: yu,
            yin: yin,
            lei: lei,
        };
    },
    computed: {
        dataInit() {
            if (this.detail.componentShow.indexOf('天气') > -1) {
                if (this.detail.dataBind.districtCode) {
                    this.getWeatherTest();
                }
            }
        },
    },
    mounted() {
        this.getWeatherTest();
        if (this.detail.dataBind.districtCode) {
            setInterval(() => {
                this.getWeatherTest();
            }, 60000 * 60);
        }
    },
    methods: {
        getWeatherTest() {
            let query = {
                appid: '53464153',
                appsecret: '6VAV5iHz',
                version: 'v61',
                unescape: 1,
                cityid: this.detail.dataBind.districtCode,
            };
            let url = 'http://v1.yiketianqi.com/api'; // 易客云
            this.$axios({
                url: url,
                method: 'get',
                params: query,
            }).then((res) => {
                console.log('更新天气组件', res.data);
                this.detail.weatherDetail = res.data;
            });
        },
        parseDate(str) {
            return new Date(Date.parse(str.replace(/-/g, '/')));
        },
        getWeaImage(val) {
            if (val == 'qing') {
                return this.qing;
            } else if (val == 'xue') {
                return this.xue;
            } else if (val == 'lei') {
                return this.lei;
            } else if (val == 'shachen') {
                return this.shachen;
            } else if (val == 'wu') {
                return this.wu;
            } else if (val == 'bingbao') {
                return this.bingbao;
            } else if (val == 'yun') {
                return this.yun;
            } else if (val == 'yu') {
                return this.yu;
            } else if (val == 'yin') {
                return this.yin;
            } else {
                return this.qing;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.weatherClass {
    border: 1px solid;
    border-radius: 10px;
    border-color: #000;
}
</style>
