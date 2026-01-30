<template>
<div class="container">
    <div class="banner">
        <!-- <img src="@/assets/images/trace/banner.png" alt=""> -->
    </div>
        <div class="components">
            <template v-for="(item, index) in view">
                <div v-if="index != 0" :data-index="index" :key="index" class="item">
                    <template>
                    <component
                    :is="getComponent(item.type)"
                    :data="item"
                    ></component>
                </template>

                </div>
            </template>
        </div>
</div>
</template>

<script>
import Brand from '@/views/trace/components/EditPage/View/Brand'
import Map from '@/views/trace/components/EditPage/View/Map'
import PlantEnv from '@/views/trace/components/EditPage/View/PlantEnv'
import PlantProgress from '@/views/trace/components/EditPage/View/PlantProgress'
import ProductInfo from '@/views/trace/components/EditPage/View/ProductInfo'
import Quality from '@/views/trace/components/EditPage/View/Quality'
import Shop from '@/views/trace/components/EditPage/View/Shop'
import Staff from '@/views/trace/components/EditPage/View/Staff'
import TraceTime from '@/views/trace/components/EditPage/View/TraceTime'

import {addRecord,getRecordList,getTraceTemplateByTemplateId,getTraceTemplateByTraceCode,getCodeByTraceCode,updateCodeStatus} from '@/api/trace/traceWebSite'
import VConsole from 'vconsole';
export default {
  name: '',
  mixins: [],
  components: { Brand, Map, PlantEnv,PlantProgress,ProductInfo,Quality,Shop,Staff,TraceTime },
  props: {},
  data() {
    return {
      comList:[
                {
                    type: 'brand',
                    com: Brand
                },
                {
                    type: 'map',
                    com: Map
                },
                {
                    type: 'plantEnv',
                    com: PlantEnv
                },
                {
                    type: 'plantProgress',
                    com: PlantProgress
                },
                {
                    type: 'productInfo',
                    com: ProductInfo
                },
                {
                    type: 'quality',
                    com: Quality
                },
                {
                    type: 'shop',
                    com: Shop
                },
                {
                    type: 'staff',
                    com: Staff
                },
                {
                    type: 'traceTime',
                    com: TraceTime
                }
    ],
    //页面json
    view: [],
    //路由参数
    params:null,
    //产品ID
    sellproId:null
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  async mounted() {
    //取地址里面的参数
    this.params = this.$route.query;
    //溯源
    if(this.params.traceCode){
        console.log('走溯源')
        await this.getTraceTemplateByTraceCode(this.params.traceCode);//'frog20240419205441000001'
        this.addTraceRecord(this.params.traceCode);
    //预览
    }else if(this.params.templateId){
        console.log('走的template ID')
        await this.getTracetemplateByTemplateId(this.params.templateId);
    }
    //设置页面title
    document.title = this.view[0].title;
    // 使用Vconsole在手机端调试页面
    new VConsole();

  },
  destroyed() {},
  methods: {
      //获取模版信息通过溯源码
      async getTraceTemplateByTraceCode(traceCode){
          const {data:{templateJson}} = await getTraceTemplateByTraceCode(traceCode);
          if(templateJson){
              try {
                  this.view = JSON.parse(templateJson);
              } catch (error) {
                  console.log('解析失败')
              }
          }
      },
      //获取模版通过模版ID
      async getTracetemplateByTemplateId(templateId){
          const {data:{templateJson}} = await getTraceTemplateByTemplateId(templateId);
          if(templateJson){
              try {
                  this.view = JSON.parse(templateJson);
              } catch (error) {
                  console.log('解析失败')
              }
          }
      },
      //获取组建
     getComponent(type) {
        const component = this.comList.find(item => item.type === type);
        return component ? component.com : null;
     },
     //行政区域查询接口
     //获取城市坐标，因为返回的是一个对角线坐标，我们只需要定位到城市，就任意取一个
     getCity(){
        var geolocation = new this.AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位
            timeout: 10000, // 超时时间
        });
        return new Promise((resolve,reject)=>{
            try{
                geolocation.getCurrentPosition(async (status, result)=>{
                    if (status === 'complete') {
                        resolve(result.position)
                    } else {
                        resolve(null);
                    }
                });
            }catch(error){
                reject(error);
            }
        })
     },
     //逆地址，通过国标查询地址,point是坐标数组[112.22,33.33]
     getAddress(point){
        // 创建地理编码对象
        const geocoder = new this.AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        });
        return new Promise((resolve,reject)=>{
            try{
                geocoder.getAddress(point, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        resolve(result.regeocode.addressComponent);
                    }
                })
            }catch(error){
                reject(error);
            }
        });
     },
     //添加溯源记录
     addTraceRecord(traceCode) {
        //获取城市坐标
        let formData = {
            sellproId:null,
            traceCode:traceCode,
            queryAddress:null,
            queryCoordinate:null,
            queryCity:null,
            cityCode:null
        }
        this.getCity().then(async point=>{
            if(point){
                const {province,city,citycode} = await this.getAddress(point);
                formData.queryAddress=province+city;
                formData.queryCoordinate=point.lng+','+point.lat;
                formData.queryCity=city;
                formData.cityCode = citycode;
            }
            //通过这个接口获取sellproId
            getCodeByTraceCode(traceCode).then(async res=>{
                formData.sellproId = res.data.sellproId;
                //添加溯源记录
                await addRecord(formData);
                //更新溯源码的状态为已使用，status为2
                res.data.status=2;
                await updateCodeStatus({...res.data});
                //设置溯源次数
                this.getRecordTimes(this.params.traceCode);
            })
        })
        
    },
    //查询溯源次数
    async getRecordTimes(traceCode){
      const {total} = await  getRecordList({traceCode});
      this.view.forEach(item=>{
          if(item.type=='traceTime'){
              item.data.times = total;
          }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
    $mobileUnit: 100vw / 750;
    .container{
        width:100%;
        overflow-x: hidden;
        background-color: #f0f2f5;
        .banner{
            width:100%;
            //和电脑端保持相同的比例，电脑端相当于设置200px，因为电脑端的宽度为400
            height:100vw / 400 * 200;
            background-image:url(~@/assets/images/trace/banner.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-bottom:-50 * $mobileUnit;
            border-bottom-left-radius: 20 * $mobileUnit;
            border-bottom-right-radius: 20 * $mobileUnit;
        }
        .components{
            padding:0 20*$mobileUnit;

        }
    }
</style>
