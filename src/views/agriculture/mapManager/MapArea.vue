<template>
  <div class="map_demo" ref="myMap">
    <!-- 地图 -->
    <div id="indexMap" class="indexMap" @mouseover="drawer3==true?followPointShow=true:''" @mouseleave="drawer3==true?followPointShow=false:''"></div>
    <!-- 左侧工具按钮 -->
    <div class="operate">
      <!-- 地址搜索按钮 -->
      <div class="search">
        <div class="switchTab">
          <i class="el-icon-sort" @click.stop="changeType"></i>
        </div>
        <el-autocomplete class="input" v-if="type" v-model="address" :fetch-suggestions="fetchLocationData" placeholder="请输入查询关键字" @select="handleSelect">
          <template slot="prepend">
            <i class="el-icon-search"></i>
          </template>
          <template slot="append">
            <el-button type="text" style="width: 72px;">搜索</el-button>
          </template>
        </el-autocomplete>
        <el-popover class="coordinate" v-else placement="bottom" trigger="manual" v-model="isShow">
          <div class="list" v-show="place.length>0">
            <div v-for="(item,index) in place" :key="index" @click="goTo">
              <i class="el-icon-location-information"></i>{{item}}
            </div>
          </div>
          <div class="flex" slot="reference">
            <el-input class="input" placeholder="输入经度" v-model="xValue"></el-input>
            <el-input class="input" placeholder="输入纬度" v-model="yValue"></el-input>
            <el-button type="text" @click="analysis" style="width: 72px;">搜索</el-button>
          </div>
        </el-popover>
      </div>
      <!-- 添加设备按钮 -->
      <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="设备添加" placement="bottom">
        <el-popover v-if="!isAdmin" placement="bottom" width="200" trigger="click" v-model="isShow2">
          <div v-for="item in product" :key="item.productId" class="product flex aic" @click="addDevice(item)"><img :src="baseUrl+item.imgUrl" alt="">{{item.productName}}</div>
            <i class="btn el-icon-location" slot="reference"></i>
        </el-popover>
      </el-tooltip>
      <!-- 尺子 -->
      <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="尺子" placement="bottom">
        <i class="btn el-icon-position" id="ruler"></i>
      </el-tooltip>
      <!-- 图层 -->
      <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="图层管理" placement="bottom">
        <el-popover placement="bottom" width="200" trigger="click" v-model="isShow3">
          <div class="layer">
            <ul class="controlList">
              <div class="label">地块图层</div>
              <li class="control_item" v-for="(item,index) in areaModule" :key="item.label+index">
                <div class="icon"><i class="el_icon" :class="item.label=='地块'?'el-icon-menu':'el-icon-postcard'"></i>{{item.label}}</div>
                <div>
                  <el-checkbox v-model="item.show" @change="show(item)"></el-checkbox>
                </div>
              </li>
              <div class="label">设备图层</div>
              <li class="control_item" v-for="(item,index) in deviceProduct" :key="index">
                <div class="icon"><img :src="baseUrl+item.imgUrl" alt="">{{item.productName.length>7?`${item.productName.substring(0,7)}...`:item.productName}}</div>
                <div>
                  <el-checkbox v-model="item.show" @change="show(item)"></el-checkbox>
                </div>
              </li>
            </ul>
          </div>
          <i class="btn el-icon-coin" slot="reference"></i>
        </el-popover>
      </el-tooltip>
    </div>
    <img class="followPoint" v-show="followPointShow" :src="baseUrl+deviceImgUrl" alt="">
    <!-- 地图工具按钮 -->
    <div class="tool">

      <!-- <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="中心点" placement="left">
        <i class="btn el-icon-aim" id="center"></i>
      </el-tooltip> -->

      <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="全屏" placement="left">
        <i class="btn el-icon-full-screen" @click="click"></i>
      </el-tooltip>

      <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="地图放大" placement="left">
        <i class="btn el-icon-plus" id="plus"></i>
      </el-tooltip>

      <el-tooltip transition="el-zoom-in-center" class="item" effect="dark" content="地图缩小" placement="left">
        <i class="btn el-icon-minus" id="minus"></i>
      </el-tooltip>
    </div>

    <!-- 地块编辑抽屉 -->
    <transition name="el-zoom-in-right">
      <div class="drawer drawer2" v-show="drawer2">
        <div class="title">
          <div>地块编辑</div>
          <i class="el-icon-close" @click="closeDrawer(2)"></i>
        </div>
        <land-form :id="areaId" :path="areaPath" @upDataStyle="setStyle" @Refresh="Refresh" :finishEdit="finishEdit" @cancel="closeDrawer(2)"></land-form>
      </div>
    </transition>
    <!-- 设备新增编辑 -->
    <transition name="el-zoom-in-right">
      <div class="drawer width-430 padding-right-10" v-show="drawer3">
        <div class="title">
          <div>{{title}}</div>
          <i class="el-icon-close" @click="closeDrawer(3)"></i>
        </div>
        <device-form @close="closeDrawer(3)" ref="deviceForm" :proportion="24" :deviceInfo="form" @success="success" :deviceId="deviceId"></device-form>
      </div>
    </transition>
  </div>
</template>

<script>
import screenfull from 'screenfull';
import { listDevice } from '@/api/iot/device';
import { listProduct } from '@/api/iot/product';
import { listLand } from '@/api/agriculture/land';
import LandForm from './LandForm';
import DeviceForm from '@/views/iot/device/device-form';
import { mapGetters } from 'vuex';

export default {
  components: {
    LandForm,
    DeviceForm,
  },
  name: 'MapArea',
  props: {
    moveTarget: [String, Number],
    baseId: Number,
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      drawer: false, //抽屉控制
      drawer2: false, //抽屉控制
      drawer3: false,
      title: null,
      areaId: null,
      areaPath: null,
      polyEditor: null, //多边形编辑器
      polygonDemo: null, //正在编辑的多边形
      isFullscreen: false, //全屏控制
      type: true, //搜索状态切换
      address: null, //搜索地址
      xValue: null,
      yValue: null,
      place: [],
      isShow: false,
      isShow2: false,
      isShow3: false,
      isWatch: false,
      area: [], //地块数据
      device: [], //设备数据
      product: [], //产品
      deviceProduct:[],//设备的产品
      // 地块覆盖物数组
      overlayGroup: [],
      // 地块和名称数组
      areaModule: [],
      form: {
        productId: null,
        productName: null,
        deviceType: null,
        tenantId: null,
        tenantName: null,
        locationWay: null,
      },
      deviceImgUrl: null,
      followPointShow: false,
      marker: [],
      // markerInfo:null,
      pointShow: false,
      deviceId: 0,
      pointDemo: null,
    };
  },
  computed:{
        ...mapGetters(['isAdmin'])
    },
  watch: {
    // 监听点击左侧列表跳转位置
    moveTarget: {
      handler(value) {
        let list = value.split('|');
        if (list[2] == 1) {
          //地块
          this.overlayGroup.forEach((item) => {
            if (item._opts.extData.landId == list[0]) {
              this.map.setFitView([item], true);
            }
          });
        } else {
          //设备
          this.deviceProduct.forEach((item) => {

            if (item.devicePointList.length > 0) {
              item.devicePointList.forEach((device) => {
                if (device._opts.extData.device.deviceId == list[0]) {
                  this.map.setFitView([device], true);
                }
              });
            }
          });
        }
      },
    },
    isShow: {
      handler(value) {
        if (value) {
          this.address = null;
        }
      },
    },
    type:{
      handler(val){
        if (val) {
          this.isShow = false;
        }
      }
    },
    baseId: {
      handler: async function (n) {
        if (n) {
          await this.$nextTick();
          this.initPage();
        }
      },
    },
  },
  methods: {
    /** 初始化页面 */
    async initPage() {
      //获去地块数据
      let res = await listLand({ baseId: this.baseId });
      this.area = res.rows;
      //获取设备数据
      let res1 = await listDevice({ baseId: this.baseId });

      this.device = res1.rows.map((item) => ({
        ...item,
        imgUrl:item.imgUrl.split(',').length > 1? item.imgUrl.split(',')[1]: item.imgUrl,
      }));
      //获取设备类别
      let res2 = await listProduct({ baseId: this.baseId });
      this.product = res2.rows.map((item) => ({
        ...item,
        imgUrl:item.imgUrl.split(',').length > 1? item.imgUrl.split(',')[1]: item.imgUrl,
      }));
      //地图初始化
      this.initMap();
      //全屏插件初始化
      this.init();
    },
    /** 初始化map */
    async initMap() {
      //获取配置坐标
      this.map = new this.AMap.Map('indexMap', {
        //设置地图容器id
        mapStyle: 'amap://styles/802500eb9c17892dd91047988cc1ece1',
        zoom: 16, //初始化地图级别
        //center: baseCoordinate, //初始化地图中心点位置
        layers: [new this.AMap.TileLayer.Satellite()],
        doubleClickZoom: false,
      });
      /* 搜索 */
      this.placeSearch = new this.AMap.PlaceSearch({ city: '全国' });
      /* 逆地址解析 */
      this.geocoder = new this.AMap.Geocoder({city: '全国'});

      /* 尺子 */
      var ruler = new this.AMap.RangingTool(this.map);
      document.getElementById('ruler').onclick = function () {
        ruler.turnOn();
      };
      ruler.on('end', () => {
        ruler.turnOff();
      });
      /* 过度到中心点 */
      // document.getElementById('center').onclick = () => {
      //   this.map.setCenter(baseCoordinate);
      // };

      /* 地图缩放 */
      document.getElementById('plus').onclick = () => {
        this.map.zoomIn();
      };
      document.getElementById('minus').onclick = () => {
        this.map.zoomOut();
      };

      //创建多边形编辑
      this.polyEditor = new this.AMap.PolygonEditor(this.map);
      //点击地图添加设备
      this.createAreaPolygon();
      this.createDevicePoint();
      this.map.setFitView();
    },
    /** 添加设备 */
    addDevice(item) {
      if (this.drawer3 == true) {
        this.$message({
          message: '当前正在添加设备选点!',
          type: 'warning',
        });
      } else {
        this.deviceId = 0;
        this.map.on('click', this.setPoint);
        this.overlayGroup.forEach((item) => {
          item.on('click', this.setPoint);
        });
        this.followPointShow = true;
        this.title = item.productName;
        this.isShow2 = false;
        this.pointShow = true;
        this.form.productId = item.productId;
        this.form.productName = item.productName;
        this.form.deviceType = item.deviceType;
        this.form.tenantId = item.tenantId;
        this.form.tenantName = item.tenantName;
        this.form.locationWay = 3;

        this.deviceImgUrl = item.imgUrl;

        this.container = this.$el.querySelector('.indexMap');
        // 监听鼠标移动事件，并更新 follower 的位置信息
        this.container.addEventListener('mousemove', (e) => {
          let rect = this.container.getBoundingClientRect();
          let mouseX = e.clientX - rect.left - 10;
          let mouseY = e.clientY - rect.top - 22;
          // 设置平移和旋转样式
          this.$el.querySelector('.followPoint').style.left = mouseX + 'px';
          this.$el.querySelector('.followPoint').style.top = mouseY + 'px';
        });
        this.$refs.deviceForm.reset();
      }
    },
    /** 编辑设备 */
    editDevice(data) {
      if (this.drawer3 == true) {
        this.$message({
          message: '当前正在添加设备选点!',
          type: 'warning',
        });
      } else {
        this.deviceId = data.extData.device.deviceId;
        this.map.on('click', this.editPoint);
        this.overlayGroup.forEach((item) => {
          item.on('click', this.editPoint);
        });
        this.followPointShow = true;
        this.title = data.title;
        this.isShow2 = false;
        this.pointShow = true;
        this.deviceImgUrl = data.imgUrl;
        this.container = this.$el.querySelector('.indexMap');
        // 监听鼠标移动事件，并更新 follower 的位置信息
        this.container.addEventListener('mousemove', (e) => {
          let rect = this.container.getBoundingClientRect();
          let mouseX = e.clientX - rect.left - 10;
          let mouseY = e.clientY - rect.top - 22;
          // 设置平移和旋转样式
          this.$el.querySelector('.followPoint').style.left = mouseX + 'px';
          this.$el.querySelector('.followPoint').style.top = mouseY + 'px';
        });
        this.drawer3 = true;
      }
    },
    setPoint({ lnglat }) {
      this.map.remove(this.marker);
      this.marker = [];
      var markerContent = document.createElement('div');
      var markerImg = document.createElement('img');
      markerImg.src = this.baseUrl + this.deviceImgUrl;
      markerImg.setAttribute('width', '20px');
      markerImg.setAttribute('height', '20px');
      markerContent.appendChild(markerImg);
      let point = new this.AMap.Marker({
        position: [lnglat.lng, lnglat.lat],
      });
      point.setContent(markerContent);
      this.marker.push(point);
      this.map.add(this.marker);
      this.$set(this.form, 'coordinate', lnglat.lng + ',' + lnglat.lat);
      this.drawer3 = true;
    },
    editPoint({ lnglat }) {
      this.pointDemo.setPosition([lnglat.lng, lnglat.lat]);
      this.$set(this.form, 'coordinate', lnglat.lng + ',' + lnglat.lat);
    },
    success() {
      this.drawer3 = false;
      this.followPointShow = false;
      //解除创建点的点击事件
      this.map.off('click', this.setPoint);
      this.overlayGroup.forEach((item) => {
        item.off('click', this.setPoint);
      });
      this.map.off('click', this.editPoint);
      this.overlayGroup.forEach((item) => {
        item.off('click', this.editPoint);
      });
      this.Refresh();
      this.$emit('refreshList');
    },
    /* 创建地块 */
    createAreaPolygon() {
      let label = [];
      this.overlayGroup = [];
      this.areaModule = [];
      this.area.forEach((item) => {
        if (item.landPath) {
          let path = [],pointList = [];
          item.landPath.split('|').forEach((point) => {
            path.push(
              new this.AMap.LngLat(point.split(',')[0], point.split(',')[1])
            );
            pointList.push([
              Number(point.split(',')[0]),
              Number(point.split(',')[1]),
            ]);
          });
          let polygon = new this.AMap.Polygon({
            path: path,
            fillColor: item.fillColor,
            fillOpacity: item.fillOpacity,
            strokeColor: item.strokeColor,
            strokeWeight: item.strokeWeight,
            strokeOpacity: item.strokeOpacity,
            extData: {
              landId: item.landId,
            },
          });
          // 地块添加双击事件
          polygon.on('dblclick', ({ target }) => {
            if (
              (this.drawer2 == true || this.drawer3 == true) &&
              this.areaId != target._opts.extData.landId
            ) {
              this.$message({
                message: '请先关闭编辑模式!',
                type: 'warning',
              });
            } else if (
              this.drawer2 == true &&
              this.areaId == target._opts.extData.landId
            ) {
              this.$message({
                message: '当前地块正在编辑!',
                type: 'warning',
              });
            } else {
              this.areaId = target._opts.extData.landId;
              this.drawer2 = true;
              this.polygonDemo = target;
              this.polyEditor.setTarget(target);
              //点击确定获取编辑之后的地块路径
              this.polyEditor.on('end', ({ target: PolygonDemo }) => {
                if (PolygonDemo._opts.path != null) {
                  //TODO: 【项目】调用open开启编辑时也能监听到，待解决
                  this.areaPath = PolygonDemo._opts.path
                    .map((item) => item.toString())
                    .join('|');
                }
              });
              this.polyEditor.open();
            }
          });
          this.overlayGroup.push(polygon);
          //添加地块名称
          label.push(
            new this.AMap.Text({
              text: `${item.landName}`,
              anchor: 'center',
              position: this.getAreaCenter(pointList),
              style: {
                background: 'transparent',
                color: '#fff',
                border: 'none',
              },
            })
          );
        }
      });
      //地块覆盖物群组
      this.AreaPolygonGroup = new this.AMap.OverlayGroup(this.overlayGroup);

      this.areaModule.push({
        label: '地块',
        show: true,
        layer: this.AreaPolygonGroup,
      });
      //地块名称图层
      this.AreaLabelGroup = new this.AMap.OverlayGroup(label);
      this.areaModule.push({
        label: '名称',
        show: true,
        layer: this.AreaLabelGroup,
      });

      this.map.add(this.AreaLabelGroup);
      this.map.add(this.AreaPolygonGroup);
      this.isWatch = true;
    },
    /* 创建设备marker点 */
    createDevicePoint() {
      //将设备中包含的产品整理出来
      let p = this.device.map(item=>({productId:item.productId,productName:item.productName,imgUrl:item.productImgUrl.split(',')[1]}));
      this.deviceProduct = this._.uniqBy(p,'productId');
      this.deviceProduct.forEach((item) => {
        this.$set(item, 'children', []);
        this.$set(item, 'layer', null);
        this.$set(item, 'devicePointList', []);
        this.$set(item, 'show', true);
        this.device.forEach((device) => {
          if (item.productId == device.productId) {
            if (device.latitude) {
              item.children.push(device);
            }
          }
        });
      });
      this.deviceProduct.forEach((item) => {
        if (item.children.length > 0) {
          let devicePointList = [];
          item.children.forEach((device) => {
            let marker = new this.AMap.Marker({
              icon: new this.AMap.Icon({
                image: this.baseUrl + device.imgUrl,
                imageSize: new this.AMap.Size(26, 26),
              }),
              position: [device.longitude, device.latitude],
              title: device.deviceName,
              anchor: 'bottom-center',
              extData: {
                device: device,
              },
            });
            // let clickTimer;
            // marker.on("click",({target})=>{
            //     clickTimer = setTimeout(handleClick, 300);
            //     const {deviceId,productId,isCamera} = target._opts.extData.device;
            //     this.$router.push({
            //             path: '/iot/device-view',
            //             query: {
            //                 t: Date.now(),
            //                 deviceId: deviceId,
            //                 productId:productId,
            //                 isCamera:isCamera,
            //             }
            //         });
            //     })
            marker.on('dblclick', ({ target }) => {
                console.log(target._opts.extData.device.deviceId)
              if (
                (this.drawer2 == true || this.drawer3 == true) &&
                this.deviceId != target._opts.extData.device.deviceId
              ) {
                this.$message({
                  message: '请先关闭编辑模式!',
                  type: 'warning',
                });
              } else if (
                this.drawer3 == true &&
                this.deviceId == target._opts.extData.device.deviceId
              ) {
                this.$message({
                  message: '当前设备正在编辑!',
                  type: 'warning',
                });
              } else {
                this.pointDemo = target;
                this.editDevice({ ...target._opts, imgUrl: device.imgUrl });
              }
            });
            devicePointList.push(marker);
          });
          item.devicePointList = devicePointList;
          item.layer = new this.AMap.OverlayGroup(devicePointList);
          this.map.add(item.layer);
        }
      });
    },
    //控制显示隐藏
    show(item) {
      if (item.layer != null) {
        if (item.show == true) {
          item.layer.show();
        } else if (item.show == false) {
          item.layer.hide();
        }
      }
    },
    //地块样式回显
    setStyle(data) {
      this.polygonDemo.setOptions({
        fillColor: data.fillColor,
        fillOpacity: data.fillOpacity,
        strokeColor: data.strokeColor,
        strokeWeight: data.strokeWeight,
        strokeOpacity: data.strokeOpacity,
        extData: {
          landId: data.landId,
        },
      });
    },
    // 关闭抽屉
    closeDrawer(index) {
      if (index == 1) {
        this.drawer = false;
      } else if (index == 2) {
        this.drawer2 = false;
        this.areaId = null;
        this.polyEditor.close();
        this.map.clearMap();
        //清除覆盖物重新渲染
        this.createAreaPolygon();
        this.createDevicePoint();
      } else {
        this.drawer3 = false;
        this.followPointShow = false;
        //解除创建点的点击事件
        this.map.off('click', this.setPoint);
        this.overlayGroup.forEach((item) => {
          item.off('click', this.setPoint);
        });
        this.map.off('click', this.editPoint);
        this.overlayGroup.forEach((item) => {
          item.off('click', this.editPoint);
        });
        //清除覆盖物重新渲染
        this.map.clearMap();
        this.createAreaPolygon();
        this.createDevicePoint();
      }
    },
    // 修改完成之后刷新
    async Refresh() {
      //获去地块数据
      let res = await listLand();
      this.area = res.rows;
      //获取设备数据
      let res1 = await listDevice();
      this.device = res1.rows.map((item) => {
        return {
          ...item,
          imgUrl:
            item.imgUrl.split(',').length > 1
              ? item.imgUrl.split(',')[1]
              : item.imgUrl,
        };
      });
      //获取设备类别
      let res2 = await listProduct();
      this.product = res2.rows.map((item) => {
        return {
          ...item,
          imgUrl:
            item.imgUrl.split(',').length > 1
              ? item.imgUrl.split(',')[1]
              : item.imgUrl,
        };
      });
      this.$emit('refreshList');
      this.map.clearMap();
      this.createAreaPolygon();
      this.createDevicePoint();
    },
    finishEdit() {
      this.polyEditor.close();
      this.drawer2 = false;
      this.areaId = null;
    },
    changeType() {
      this.type = !this.type;
      this.address = null;
      this.xValue = null;
      this.yValue = null;
      this.place = [];
    },
    analysis() {
      if (this.xValue&&this.yValue) {
        this.geocoder.getAddress(
          new this.AMap.LngLat(this.xValue, this.yValue),
          (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.place = [];
              this.place.push(result.regeocode.formattedAddress);
              this.isShow = true
            }
          }
        );
      }else{
        this.isShow = false
      }
    },
    goTo() {
      this.map.panTo([this.xValue, this.yValue]);
    },
    /** 位置查询处理 */
    fetchLocationData(queryString, cb) {
      if (queryString) {
        clearTimeout(this.timer);
        // 延迟 1.2 s
        this.timer = setTimeout(() => {
          this.placeSearch.search(queryString, (status, result) => {
            if (status === 'complete') {
              cb(
                result.poiList.pois.map((item) => ({
                  ...item,
                  value: item.address,
                }))
              );
            } else {
              cb([]);
            }
          });
        }, 1200);
      } else {
        cb([]);
      }
    },
    /** handle select */
    handleSelect(item) {
      const { map, searchOverlays } = this;
      const { location, address } = item;
      const { lng, lat } = location;
      map.panTo([lng, lat]);
    },
    //计算覆盖物中心点
    getAreaCenter(location) {
      var total = location.length;
      var X = 0,
        Y = 0,
        Z = 0;
      location.forEach((lnglat) => {
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
    click() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' });
        return false;
      }
      screenfull.toggle(this.$refs.myMap);
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change);
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change);
      }
    },
  },
  beforeDestroy() {
    this.destroy();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/element-variables.scss';
.map_demo {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .indexMap {
    height: 100%;
    width: 100%;
  }

  .operate {
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    .search{
      width: 330px;
      display: flex;
      align-items: center;
      background: #fff;
      margin-right: 20px;
      .switchTab{
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-right: 1px solid #DCDFE6;
        .el-icon-sort{
          transform: rotate(90deg);
          background: #4B4D50;
          color: #fff;
          border-radius: 50%;
          padding: 4px;
        }
      }
      .input::v-deep{
        flex: 1;
        .el-input-group__prepend{
          background: #fff;
          border-radius: 0;
          border: none;
          padding: 0 10px;
        }
        .el-input__inner{
          border: none;
        }
        .el-input-group__append{
          border: none;
          background: #fff;
          color: $--color-primary;
        }
      }
    }
    .el-icon-location {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    .el-icon-position {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      margin-right: 15px;
    }
    .el-icon-coin{
      border-radius: 5px;
    }
    .btn {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      &:hover {
        background: #eee;
        color: $--color-primary;
      }
    }
  }
  .followPoint {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 0;
    top: 0;
  }
  .tool {
    position: absolute;
    right: 10px;
    bottom: 30px;
    display: flex;
    flex-direction: column;

    .el-icon-aim{
      margin-bottom: 15px;
      border-radius: 5px;
    }
    .el-icon-full-screen {
      margin-bottom: 15px;
      border-radius: 5px;
    }
    .el-icon-plus {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    .el-icon-minus {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .btn {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      &:hover {
        background: #eee;
        color: $--color-primary;
      }
    }
  }

  .el-zoom-in-right-enter-active,
  .el-zoom-in-right-leave-active {
    opacity: 1;
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    -webkit-transform-origin: center right;
    transform-origin: center right;
  }
  .el-zoom-in-right-enter,
  .el-zoom-in-right-leave-active {
    opacity: 0;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
  }
  .drawer {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 250px;
    background: #fff;
    &.drawer2 {
      width: 350px;
      padding: 0 10px;
    }
    &.drawer3 {
      width: 400px;
      padding: 0 10px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      height: 55px;
      padding: 0 15px;
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 15px;
      .el-icon-close {
        cursor: pointer;
        font-size: 22px;
      }
    }
    .controlList {
      list-style: none;
      padding: 0 20px;
      color: rgb(153, 153, 153);
      font-size: 16px;
      .label {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        .el_icon {
          margin-right: 10px;
          font-size: 20px;
        }
      }
      .control_item {
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        margin-bottom: 15px;
        .icon {
          display: flex;
          align-items: center;
          font-size: 15px;
          img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }
          .el_icon {
            margin-right: 10px;
            font-size: 20px;
          }
        }
      }
    }
  }
}
.coordinate {
  flex: 1;
  position: relative;
  .list {
    width: 294px;
    background: #fff;
    div {
      color: #606266;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 10px;
      .el-icon-location-information{
        color: $--color-primary;
        margin-right: 10px;
      }
      &:last-of-type{
        margin-bottom: 0;
      }
    }
  }
}
.layer {
  .controlList {
    list-style: none;
    padding: 0;
    margin: 0;
    color: #555;
    font-size: 16px;
    .label {
      color: #999;;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .control_item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      .icon {
        display: flex;
        align-items: center;
        font-size: 15px;
        img {
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
        .el_icon {
          color: $--color-primary;
          margin-right: 15px;
          font-size: 20px;
        }
      }
    }
  }
}
.product {
  user-select: none;
  height: 30px;
  cursor: pointer;
  margin-bottom: 10px;
  &:last-of-type{
    margin-bottom: 0;
  }
  img {
    width: 25px;
    height: 25px;
    margin-right: 15px;
  }
  &:hover {
    background: #eee;
  }
}
</style>
