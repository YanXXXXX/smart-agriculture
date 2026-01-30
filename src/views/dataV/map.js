import { listDevice } from "@/api/iot/device";
import { listLand } from "@/api/agriculture/land";
import { getDicts } from "@/api/system/dict/data";
const mapMixin = {
    data() {
        return {
            area:[],
            device:[],
            baseUrl:process.env.VUE_APP_BASE_API,
            loading:false,
            landType:[],
            deviceType:[]
        }
    },
    watch: {
        baseId: {
          handler: async function (n) {
            if (n) {
             await this.$nextTick();
             if (this.type == 'pageThree') {
                this.loading=true
                //获去地块数据
                let res = await listLand({baseId:this.baseId});
                this.area = res.rows;
                //获取设备数据
                let res1 = await listDevice({baseId:this.baseId});
                this.device = res1.rows.map((item) => ({
                    ...item,
                    imgUrl:item.imgUrl.split(",").length > 1 ? item.imgUrl.split(",")[1] : item.imgUrl
                }));
                this.initMap()
                getDicts("agriculture_land_type").then(response => {
                    this.landType = response.data;
                });
                getDicts("iot_device_status").then(response => {
                    this.deviceType = response.data;
                });
            }
            }
          },
          immediate: true,
        },
      },
    async mounted(){

    },
    methods: {
        /** 初始化map */
        async initMap() {
            this.map = new this.AMap.Map("indexMap", {
                //设置地图容器id
                mapStyle: "amap://styles/grey",
                zoom: 16, //初始化地图级别
                // center: baseCoordinate, //初始化地图中心点位置
                doubleClickZoom: false,
            });
            await this.createAreaPolygon();
            await this.createDevicePoint();
            this.map.setFitView();
        },
        /** 绘制地块 */
        createAreaPolygon() {
            let label = [], overlayGroup = [];
            this.area.forEach((item) => {
                if (item.landPath) {
                    let path = [], pointList = [];
                    item.landPath.split("|").forEach((point) => {
                        path.push(
                            new this.AMap.LngLat(
                                point.split(",")[0],
                                point.split(",")[1]
                            )
                        );
                        pointList.push([
                            Number(point.split(",")[0]),
                            Number(point.split(",")[1]),
                        ]);
                    });
                    let polygon = new this.AMap.Polygon({
                        path: path,
                        fillColor: item.fillColor,
                        fillOpacity: item.fillOpacity,
                        strokeColor: item.strokeColor,
                        strokeWeight: item.strokeWeight,
                        strokeOpacity: item.strokeOpacity,
                        extData:{
                            ...item
                        }
                    });
                    polygon.on('click',(e)=>{
                        this.createInfoWindow(e)
                    })
                    overlayGroup.push(polygon);
                    //添加地块名称
                    label.push(
                        new this.AMap.Text({
                            text: item.landName,
                            anchor: "center",
                            position: this.getAreaCenter(pointList),
                            style: {
                                background: "transparent",
                                color: "#fff",
                                border: "none",
                                fontSize: "16px",
                            },
                        })
                    );
                }
            });
            this.map.add(new this.AMap.OverlayGroup(label));
            this.map.add(new this.AMap.OverlayGroup(overlayGroup));
        },
        /**  创建设备marker点 */
        createDevicePoint() {
            let devicePointList = [];
            this.device.forEach((device) => {
                if(device.longitude,device.latitude){
                    let marker = new this.AMap.Marker({
                        icon: new this.AMap.Icon({
                            image: this.baseUrl+device.imgUrl,
                            imageSize: new this.AMap.Size(32, 32),
                        }),
                        position: [device.longitude, device.latitude],
                        title: device.deviceName,
                        anchor: "bottom-center",
                        extData:{
                            ...device
                        }
                    });
                    marker.on('click',(e)=>{
                        this.createInfoWindow2(e)
                    })
                    devicePointList.push(marker);
            }
            });
            this.map.add(new this.AMap.OverlayGroup(devicePointList));
            this.loading=false

        },
        /** 获取地块中心点 */
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
        /** 信息窗体 */
        createInfoWindow(e) {
            var info = document.createElement("div");
            info.className = "InfoBox";
            var title = document.createElement("div");
            title.className="title"
            title.innerHTML=`${e.target._opts.extData.landName}`
            var type = document.createElement("div");
            var typeName = ""
            this.landType.forEach((item)=>{
                if (item.dictValue == e.target._opts.extData.landType) {
                    typeName = item.dictLabel
                }
            })
            type.className='type'
            type.innerHTML=`<div class="item">类型：<div class="tag">${typeName}</div></div>
                            <div class="item">面积：${e.target._opts.extData.landArea}亩</div>`
            info.appendChild(title)
            info.appendChild(type)
            let infoWindow = new this.AMap.InfoWindow({
                anchor: 'bottom-center',
                content: info  //使用默认信息窗体框样式，显示信息内容
            });
            infoWindow.open(this.map, new this.AMap.LngLat(e.lnglat.getLng(),e.lnglat.getLat()));
        },
        createInfoWindow2(e) {
            var info = document.createElement("div");
            info.className = "InfoBox";
            var title = document.createElement("div");
            title.className="title"
            title.innerHTML=`${e.target._opts.extData.deviceName}`
            var num = document.createElement("div");
            num.className='num'
            num.innerHTML=`<div>编号：${e.target._opts.extData.serialNumber}</div>`
            var tips = document.createElement("div");
            tips.className="tips"
            var statusName = ""
            this.deviceType.forEach((item)=>{
                if (item.dictValue == e.target._opts.extData.status) {
                    statusName = item.dictLabel
                }
            })
            tips.innerHTML=`${statusName}`
            info.appendChild(title)
            info.appendChild(num)
            info.appendChild(tips)
            let infoWindow = new this.AMap.InfoWindow({
                anchor: 'bottom-center',
                content: info  //使用默认信息窗体框样式，显示信息内容
            });
            infoWindow.open(this.map, new this.AMap.LngLat(e.lnglat.getLng(),e.lnglat.getLat()));
        }
    }
}
export default mapMixin
