把下面页面的溯源统计去掉
<template>
  <div class="container">
    <div class="index">
      <el-row :gutter="10" style="min-width:1600px">
        <el-col :span="8">
          <data-panel  title="基地概况">
            <div class="main flex fdc">
              <el-row :gutter="10" class="flex1">
                <el-col :span="8" class="h100 flex aic"
                  ><data-box
                    icon="el-icon-s-data"
                    backgroundColor="#5470c6"
                    text="基地面积(亩)"
                    :value="baseInfo.areaCount"
                    class="flex1"
                  ></data-box
                ></el-col>
                <el-col :span="8" class="h100 flex aic"
                  ><data-box
                    icon="el-icon-s-finance"
                    backgroundColor="#91cc75"
                    text="种养种类(种)"
                    :value="baseInfo.germplasmCount"
                    class="flex1"
                  ></data-box
                ></el-col>
                <el-col :span="8" class="h100 flex aic"
                  ><data-box
                    icon="el-icon-s-grid"
                    backgroundColor="#fac858"
                    text="地块数量(块)"
                    :value="baseInfo.diCount"
                    class="flex1"
                  ></data-box
                ></el-col>
              </el-row>
              <el-row :gutter="10" class="margin-top-10 flex1">
                <el-col :span="8" class="h100 flex aic"
                  ><data-box
                    icon="el-icon-s-custom"
                    backgroundColor="#ee6666"
                    text="人员总数(位)"
                    :value="baseInfo.employeeCount"
                    class="flex1"
                  ></data-box
                ></el-col>
                <el-col :span="8" class="h100 flex aic"
                  ><data-box
                    icon="el-icon-s-claim"
                    backgroundColor="#73c0de"
                    text="种植批次(批)"
                    :value="baseInfo.batchCount"
                    class="flex1"
                  ></data-box
                ></el-col>
                <el-col :span="8" class="h100 flex aic"
                  ><data-box
                    icon="el-icon-s-shop"
                    backgroundColor="#3ba272"
                    text="大棚数量(个)"
                    :value="baseInfo.pengCount"
                    class="flex1"
                  ></data-box
                ></el-col>
              </el-row>
            </div>
          </data-panel>
        </el-col>
        <el-col :span="8">
          <data-panel title="设备统计" more="更多设备" link="Device">
            <div class="main">
              <div ref="deviceChart" class="h100"></div>
            </div>
          </data-panel>
        </el-col>
        <el-col :span="8">
          <data-panel title="种植批次面积" more="更多种植批次" link="Batch">
            <div class="main">
              <div ref="plantChart" class="h100"></div>
            </div>
          </data-panel>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="margin-top-10" style="min-width:1600px">
        <el-col :span="8">
          <data-panel
            title="农事统计"
            more="更多农事"
            link="Task"
            class="margin-top-10"
          >
            <div class="main">
              <el-row class="h100" :gutter="10">
                <el-col :md="10" class="h100"
                  ><div ref="taskChart" class="h100"></div
                ></el-col>
                <el-col
                  :md="7"
                  v-for="item in taskInfo"
                  :key="item.name"
                  class="h50 flex fdc jcsa"
                >
                  <data-box
                    icon="el-icon-s-promotion"
                    backgroundColor="red"
                    :text="item.name + '(条)'"
                    :value="item.value"
                    :isBorder="false"
                    :isIcon="false"
                  ></data-box>
                </el-col>
              </el-row>
            </div>
          </data-panel>
          <data-panel title="溯源统计" more="更多溯源" link="TraceRF">
            <div class="main">
              <div ref="traceChart" class="h100"></div>
            </div>
          </data-panel>
        </el-col>
        <el-col :span="16">
          <data-panel title="基地地图" more="基地地图" link="Map">
            <div class="mapMain">
              <div id="indexMap" class="h100"></div>
            </div>
          </data-panel>
        </el-col>
      </el-row>
    </div>
    <!-- 浮动选择基地 -->
    <base-select v-model="baseId" :type="2"></base-select>
  </div>
</template>

<script>
import {
  selectBaseInfo,
  selectDeviceInfo,
  selectBatchInfo,
  selectTaskInfo,
} from "@/api/agriculture/dataStatistics";
import { selectRecordGroupByMonth } from "@/api/trace/dataStatistics";
import { listLand } from "@/api/agriculture/land";
import { listDevice } from "@/api/iot/device";

import DataPanel from "./components/DataPanel";
import DataBox from "./components/DataBox";

export default {
  name: "",
  components: {
    DataPanel,
    DataBox,
  },
  data() {
    return {
      baseId: null,
      landList: [],
      deviceList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      baseInfo: {
        areaCount: 0,
        germplasmCount: 0,
        diCount: 0,
        employeeCount: 0,
        batchCount: 0,
        pengCount: 0,
      },
      taskInfo: [],
    };
  },
  watch: {
    baseId: {
      handler: function (n) {
        this.baseId = n;
        this.$nextTick(() => {
          this.initPage();
        });
      },
    },
  },
  async mounted() {
    //this.initPage();
  },
  methods: {
    /** 初始化页面 */
    async initPage() {
      this.initMap();
      await this.getBaseInfo();
      this.initDeviceChart();
      this.initBatchChart();
      this.initTraceChart();
      this.initTaskChart();
      await this.getDeviceList();
      await this.getLandList();
      this.addFeatures();
    },
    /** 初始化map */
    async initMap() {
      this.map = new this.AMap.Map("indexMap", {
        //设置地图容器id
        //pitch: 40,
        viewMode: "3D", //是否为3D地图模式
        mapStyle: "amap://styles/802500eb9c17892dd91047988cc1ece1",
        zoom: 16, //初始化地图级别
        //center: this.$zb, //初始化地图中心点位置
        layers: [new this.AMap.TileLayer.Satellite()],
      });
      /** 添加空间 控件 */
      this.map.addControl(new this.AMap.Scale());
      //this.map.addControl(new AMap.ToolBar());
      this.map.addControl(new this.AMap.MapType());
    },
    /** 获取地块列表 */
    async getLandList() {
      const { rows } = await listLand({ baseId: this.baseId });
      this.landList = rows;
    },
    /** 获取设备列表 */
    async getDeviceList() {
      const { rows } = await listDevice({ baseId: this.baseId });
      this.deviceList = rows;
    },
    /** 地图添加覆盖 */
    addFeatures() {
      this.landList.forEach((item) => {
        let {
          landPath,
          fillColor,
          fillOpacity,
          strokeColor,
          strokeOpacity,
          strokeWeight,
          landName,
        } = item;
        let path =
          landPath && landPath.split("|").map((item) => item.split(","));
        let centerPoint = this.getAreaCenter(path);
        if (path) {
          this.map.add(
            new this.AMap.Polygon({
              path,
              fillColor,
              fillOpacity,
              strokeColor,
              strokeOpacity,
              strokeWeight,
            })
          );
          this.map.add(
            new this.AMap.Text({
              position: centerPoint,
              anchor: "center",
              text: landName,
              style: { background: "none", border: "none", color: "#fff" },
            })
          );
        }
      });
      this.deviceList.forEach((device) => {
        // console.log(this.baseUrl+device.imgUrl[1])
        if (device.longitude && device.latitude) {
          let marker = new this.AMap.Marker({
            icon: new this.AMap.Icon({
              image: this.baseUrl + device.imgUrl.split(",")[1],
              imageSize: new this.AMap.Size(26, 26),
            }),
            position: [device.longitude, device.latitude],
            title: device.deviceName,
            anchor: "bottom-center",
            extData: {
              device: device,
            },
          });
          marker.on("click", ({ target }) => {
            const { deviceId, productId, isCamera } =
              target._opts.extData.device;
            this.$router.push({
              path: "/iot/device-view",
              query: {
                t: Date.now(),
                deviceId: deviceId,
                productId: productId,
                isCamera: isCamera,
              },
            });
          });
          this.map.add(marker);
        }
      });
      this.map.setFitView();
    },
    /** 计算地块中心点 */
    getAreaCenter(points) {
      var total = points.length;
      var X = 0,
        Y = 0,
        Z = 0;
      points.forEach((lnglat) => {
        var lng = (lnglat[0] * Math.PI) / 180;
        var lat = (lnglat[1] * Math.PI) / 180;
        var x, y, z;
        x = Math.cos(lat) * Math.cos(lng);
        y = Math.cos(lat) * Math.sin(lng);
        z = Math.sin(lat);
        X += x;
        Y += y;
        Z += z;
      });
      X = X / total;
      Y = Y / total;
      Z = Z / total;

      var Lng = Math.atan2(Y, X);
      var Hyp = Math.sqrt(X * X + Y * Y);
      var Lat = Math.atan2(Z, Hyp);
      return [
        parseFloat((Lng * 180) / Math.PI),
        parseFloat((Lat * 180) / Math.PI),
      ];
    },
    /** 设备统计图表 */
    async initDeviceChart() {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}:{c}台(占比{d}%)",
        },
        legend: {
          type:'scroll',
          orient: "vertical",
          left: "left",
          top: "middle",
          scrollable: true, // 开启图例滚动
          data: [],
        },
        series: [
          {
            name: "设备统计",
            type: "pie",
            // radius: ["60%", "70%"],
            center: ["60%", "50%"],
            color: ["#f2ca6b", "#9eca7f", "#de6e6a", "#85bedb"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      //设备信息
      const { rows } = await selectDeviceInfo(this.baseId);
      option.legend.data = [];
      rows.forEach((item) => {
        option.legend.data.push(item.name);
      });
      option.series[0].data = rows;
      let myChart = this.$echarts.init(this.$refs.deviceChart);
      myChart.setOption(option);
      window.addEventListener('resize',function () {
        myChart.resize();
      })
    },
    /** 种植情况统计 */
    async initBatchChart() {
      let option = {
        tooltip: {
          trigger: "axis", // 触发类型，'axis'表示坐标轴触发
          formatter: "{c}亩",
        },
        label: {
          show: true, //开启显示
          position: "top", //在上方显示
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true, // 确保标签也被包含在计算布局中
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}亩", // 为纵坐标的每个值添加"m"作为单位
          },
        },
        series: [
          {
            data: [],
            color: ["#f2ca6b", "#9eca7f", "#de6e6a", "#85bedb"],
            type: "bar",
            barWidth: 20,
          },
        ],
      };
      const { rows } = await selectBatchInfo(this.baseId);
      option.xAxis.data = [];
      option.series[0].data = [];
      rows.forEach((item) => {
        option.xAxis.data.push(item.name);
        option.series[0].data.push(item.value);
      });
      let myChart = this.$echarts.init(this.$refs.plantChart);
      myChart.setOption(option);
      window.addEventListener('resize',function () {
        myChart.resize();
      })
    },
    /** 溯源情况统计 */
    async initTraceChart() {
      let option = {
        tooltip: {
          trigger: "axis", // 触发类型，'axis'表示坐标轴触发
          formatter: "{c}次",
        },
        label: {
          show: true, //开启显示
          position: "top", //在上方显示
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true, // 确保标签也被包含在计算布局中
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}次", // 为纵坐标的每个值添加"m"作为单位
          },
        },
        series: [
          {
            data: [],
            color: ["#f2ca6b", "#9eca7f", "#de6e6a", "#85bedb"],
            type: "bar",
          },
        ],
      };
      const { rows } = await selectRecordGroupByMonth(this.baseId);
      option.xAxis.data = [];
      option.series[0].data = [];
      rows.forEach((item) => {
        option.xAxis.data.push(item.name);
        option.series[0].data.push(item.value);
      });
      let myChart = this.$echarts.init(this.$refs.traceChart);
      myChart.setOption(option);
      window.addEventListener('resize',function () {
        myChart.resize();
      })
    },
    /** 农事任务统计 */
    async initTaskChart() {
      let option = {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "完成情况",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["60%", "70%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              formatter: [],
              rich: {
                a: {
                  fontSize: "30px",
                  fontWeight: "bold",
                },
                b: {
                  color: "#666",
                  lineHeight: 40,
                },
              },
            },
            data: [],
          },
        ],
      };
      const { rows } = await selectTaskInfo(this.baseId);
      //填充数据
      option.series[0].data = rows;
      let myChart = this.$echarts.init(this.$refs.taskChart);
      //图表中间的合计
      let total = rows.reduce((sum, item) => sum + item.value, 0);
      option.series[0].label.formatter = [`{a|${total}}`, `{b|${"合计"}}`].join(
        "\n"
      );
      myChart.setOption(option);
      window.addEventListener('resize',function () {
        myChart.resize();
      })
      this.taskInfo = rows;
    },
    /** 获取基地情况统计 */
    async getBaseInfo() {
      if (this.baseId) {
        //基地信息
        const res = await selectBaseInfo(this.baseId);
        this.baseInfo = res.rows[0];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$margin: 10px;
.container {
  background: #edeef0;
  overflow: hidden;
}
.index {
  height: calc(100vh - 84px - #{$margin} * 2);
  margin: $margin;
  overflow:auto;
}
.main {
  box-sizing: border-box;
  height: calc((100vh - 84px - #{$margin} * 4 - 51px * 3) / 3);
  padding: 10px;
  min-height: 180px;
}
.mapMain {
  box-sizing: border-box;
  height: calc(
    ((100vh - 84px - #{$margin} * 4 - 51px * 3) / 3) * 2 + #{$margin} + 51px
  );
  padding: 5px;
  min-height: calc(180px * 2 + #{$margin} + 51px);
}
</style>