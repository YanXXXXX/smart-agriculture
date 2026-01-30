<template>
  <div class="h100" ref="box">
    <el-button
      v-if="!draggable"
      type="primary"
      size="mini"
      @click="draggable = true"
      class="margin-top-10 position-absolute right-30"
      :loading="loading"
      :disabled="!checkPermi(['agriculture:layout:add'])"
      >更改节点排版</el-button
    >
    <el-button-group v-if="draggable" class="margin-top-10 position-absolute right-30" >
      <el-button type="warning" size="mini" @click="handleReset" :disabled="!resetBtn" >复位</el-button >
      <el-button type="info" size="mini" @click="draggable = false" >取消</el-button>
      <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
    </el-button-group>
    <!-- <el-button @click="handleOta">ota升级</el-button> -->
     <!-- <el-button
      v-if="!isMonitor"
      type="warning"
      size="mini"
      @click="beginMonitor"
      class="margin-top-10 position-absolute right-30"
      :loading="loading"
      :disabled="!checkPermi(['device:view:monitor'])"
      >实时数据</el-button
    > -->
    <el-button
      v-if="isMonitor"
      type="danger"
      size="mini"
      @click="stopMonitor"
      class="margin-top-10 position-absolute right-30 "
      :loading="loading"
      >关闭实时</el-button
    >
    <vue-draggable-resizable v-if="layout.img"
        :resizable="draggable"
        :draggable="draggable"
        class-name="original"
        @dragstop="handleDragstop(arguments,'img')"
        @resizestop="handleResizestop(arguments,'img')"
        :x="Number(layout.img.x)"
        :y="Number(layout.img.y)"
        :w="Number(layout.img.w)"
        :h="Number(layout.img.h)"
    >
        <el-image class="w100 h100" :src="device.imgUrl?$baseUrl+device.imgUrl.split(',')[0]:''" fit="fill" :lazy="true"></el-image>
    </vue-draggable-resizable>

     <vue-draggable-resizable
        v-for="item in layout.thingsModels"
        :key="item.identifier"
        class-name="original"
        class-name-draggable="draggable"
        class-name-dragging="dragging"
        class="border-radius-10"
        h="auto"
        w="auto"
        :x="Number(item.x)"
        :y="Number(item.y)"
        :resizable="false"
        :draggable="draggable"
        :parent="true"
        @dragstop="handleDragstop(arguments,item.identifier)"
    >
        <txt v-if="controlType(item)=='txt'" :item="item" @dbClick="handleChartClick"></txt>
        <ctl v-if="controlType(item)=='ctl'" :item="item" :device="device" @mqttPublish="mqttPublish" @dbClick="handleChartClick"></ctl>
        <octl v-if="controlType(item)=='octl'" :item="item" :device="device" @mqttPublish="mqttPublish" @dbClick="handleChartClick"></octl>
        <aoctl v-if="controlType(item)=='aoctl'" :item="item" :device="device" @mqttPublish="mqttPublish" @dbClick="handleChartClick"></aoctl>
        <actl v-if="controlType(item)=='actl'" :item="item" :device="device" @mqttPublish="mqttPublish" @dbClick="handleChartClick"></actl>
    </vue-draggable-resizable>
    <el-dialog
      title="历史记录"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :modal="false"
      v-if="dialogVisible"
    >
      <div class="flex jcsb">
        <el-date-picker
          v-model="daterangeTime"
          type="daterange"
          range-separator="—"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          size="mini"
        >
        </el-date-picker>
      </div>
      <div ref="chart" v-loading="chartLoading" class="w100 height-300"></div>
    </el-dialog>
  </div>
</template>

<script>
import { checkPermi} from "@/utils/permission";
import { listMonitor } from '@/api/iot/deviceLog';
import { listLayout,addLayout,delLayout } from '@/api/iot/layout';
import { chartOption } from './ChartOption';
import txt from './controls/txt.vue'
import ctl from './controls/ctl.vue'
import octl from './controls/octl.vue'
import aoctl from './controls/aoctl.vue'
import actl from './controls/actl.vue'
import sysTopics from '@/utils/sysTopics'
import mqttService from '@/utils/mqttService'
export default {
  name: '',
  mixins: [],
  components: {txt,ctl,octl,aoctl,actl},
  props: {
    device: {
      type: Object,
    },
  },
  data() {
    return {
      loading:false,
      draggable: false,
      layoutList:[],
      layout:{
          thingsModels:[],
          img:null
      },
      formLayoutList:[],
      imgLayout:{x:300,y:10,w:300,h:400},
      //图标查询统计
      daterangeTime: null,
      queryParams: {
        serialNumber: null,
        identity: '',
        total: 200,
      },
      chartLoading: false,
      dialogVisible: false,
      //实时监测参数
      isMonitor:false,
      //重置按钮
      resetBtn:true,
      shadowUnEnable:false
    };
  },
  computed: {},
  watch: {
    device: {
      handler: async function (n, o) {
        if (n.productId && n.serialNumber) {
          await this.getLayoutList();
          this.formatLayout()
          this.connectMqtt();
        }
      },
      immediate: true,
    },
    daterangeTime: {
      handler: function () {
        this.initChart();
      },
      deep: true,
    },
  },
  created() {
  },
  mounted() {},
  destroyed() {},
  methods: {
    checkPermi,
    //获取产品布局
    async getLayoutList(){
        const { productId} = this.device
        if(productId){
           const { rows } = await listLayout({productId})
           this.layoutList = rows;
           if(rows.length>0){
            this.resetBtn=true;
           }
        }
    },
  formatLayout() {
    const { productId } = this.device;
    // 容器高度和宽度
    let boxHeight = this.$refs.box.offsetHeight;
    let boxWidth = this.$refs.box.offsetWidth;
    const sizeMap = {
        'txt': { width: 340, height: 45 },
        'ctl': { width: 340, height: 60 },
        'octl': { width: 340, height: 220 },
        'aoctl': { width: 340, height: 320 },
        'actl': { width: 340, height: 220 }
    };
    // 默认第一列
    let column = 1;
    // 当前Y坐标
    let cy = 40;
    if (this.device.thingsModels && this.device.thingsModels.length > 0) {
        this.layout.thingsModels = this.device.thingsModels.map((item, index) => {
            let layoutItem = this.layoutList.find(i => i.identifier == item.id);
            let ctlType = this.controlType(item);
            let { width, height } = sizeMap[ctlType];

            // 检查是否需要换行
            if (cy + height > boxHeight) {
                cy = 40; // 重置Y坐标到顶部
                column++; // 换到下一列
            }

            // 计算控件的X和Y坐标
            let defaultX = column * width;
            let defaultY = cy;

            // 更新当前Y坐标和列高
            cy += height;

            let model = {
                productId,
                identifier: item.id,
                modelIcon: item.modelIcon,
                name: item.name,
                value: item.value,
                unit: item.dataType.unit,
                color: this.$colorList[index % 7],
                x: layoutItem ? layoutItem.x : defaultX,
                y: layoutItem ? layoutItem.y : defaultY,
                w: 'auto',
                h: 'auto',
                // 发布需要，后端不会接受到该值
                dataType: item.dataType,
                id: item.id,
                shadow: item.shadow,
                type: item.type,
                isReadonly: item.isReadonly,
                isMonitor:item.isMonitor,
                isTop:item.isTop
            };
            return model;
        });
    }
    // 处理图片控件的位置
    let layoutItem = this.layoutList.find(i => i.identifier == 'img');
    this.layout.img = {
        productId,
        identifier: 'img',
        x: layoutItem ? layoutItem.x : 0,
        y: layoutItem ? layoutItem.y : 200,
        w: layoutItem ? layoutItem.w : 200,
        h: layoutItem ? layoutItem.h : 300,
    };
},
    //判断用那种类型的控件
    controlType(item){
        let dataType = item.dataType;
        let type = item.dataType.type;
        let arr = ["integer","decimal","string"];
        if(arr.includes(type)){
            return item.isReadonly==1?'txt':'ctl'
        }
        else if(type=='bool' || type=='enum'){
            return 'ctl'
        }
        else if(type=="array" && arr.includes(dataType.arrayType)){
            return 'actl';
        }
        else if(type=="array" && dataType.arrayType=='object'){
            return 'aoctl'
        }
        else if(type=="object"){
            return 'octl'
        }
        else{
            return null;
        }
    },

    handleDragstop(a,identifier) {
        this.setValue(a,identifier)
    },
    handleResizestop(a,identifier){
        console.log(a)
        this.setValue(a,identifier)
    },
    setValue(a,identifier){
      for(let i =0;i<this.layout.thingsModels.length;i++){
            if(this.layout.thingsModels[i].identifier == identifier){
                this.layout.thingsModels[i].x = a[0];
                this.layout.thingsModels[i].y = a[1]
                if(a.length == 4){
                    this.layout.thingsModels[i].w = a[2];
                    this.layout.thingsModels[i].h = a[3]
                }
            }
        }
        if(identifier == 'img'){
            this.layout.img.x = a[0];
            this.layout.img.y = a[1];
            if(a.length == 4){
                this.layout.img.w = a[2];
                this.layout.img.h = a[3]
            }
        }
    },
    /** 布局保存 */
    async handleSave() {
        const { thingsModels,img} = this.layout;
        thingsModels.push(img);
        if(thingsModels.length>0){
            this.loading = true;
            await addLayout(thingsModels);
            this.$modal.msgSuccess("保存成功");
            this.loading = false;
            this.draggable = false
        }
    },
    /** 布局重置 */
    async handleReset() {
        this.loading = true;
        const { productId} = this.device;
        if(productId){
           const { rows } = await listLayout({productId})
           if(rows.length==0){
                this.$modal.msgWarning("已经在初始状态，不可重置");
                return;
           }
           await delLayout(productId)
           await this.getLayoutList()
           await this.formatLayout();
           this.$modal.msgSuccess("重置成功");
           this.loading = false;
           this.draggable = false
        }
    },
    //mqtt链接
    async connectMqtt() {
      if (this.$mqttTool.client == null) {
        await this.$mqttTool.connect();
      }
      this.mqttSubscribe();
      this.mqttCallback();
    },
    /** mqtt回调 */
    mqttCallback() {
      this.$mqttTool.client.on('message', (topic, message, buffer) => {
        let _message = JSON.parse(message.toString());
        const { thingsModels } = this.layout;
            if (thingsModels.length>0) {
                for (let i = 0; i < thingsModels.length; i++) {
                    for (let j = 0; j < _message.length; j++) {
                        //更新的integer、decimal、string，enum，bool
                        if (thingsModels[i].id == _message[j].id) {
                            thingsModels[i].value = _message[j].value;
                            thingsModels[i].shadow = _message[j].value;
                        }else{
                            let arr = _message[j].id.split('_');
                            //对象  device_switch
                            if(arr.length==2){
                                let fatherId = arr[0];
                                 if (thingsModels[i].id == fatherId) {
                                     thingsModels[i].dataType.params.forEach(item=>{
                                         if(item.id==_message[j].id){
                                             item.value = _message[j].value;
                                             item.shadow = _message[j].value;
                                         }
                                     })
                                 }
                            }
                            //简单数组 array_01_id
                            else if(arr.length==3){
                                let fatherId = arr[2];
                                if(thingsModels[i].id == fatherId){
                                    thingsModels[i].dataType.simpleArrayParams.forEach(item=>{
                                        if(item.id==_message[j].id){
                                            item.value=_message[j].value;
                                            item.shadow =_message[j].value;
                                        }
                                    })
                                }

                            }
                            //复杂数组 array_01_fatherid_childId
                            else if(arr.length==4){
                                let index = Number(arr[1]);
                                let fatherId = arr[2];
                                if (thingsModels[i].id == fatherId) {
                                    let arrayParam = thingsModels[i].dataType.arrayParams[index];
                                    arrayParam.forEach(item=>{
                                        if(item.id==_message[j].id){
                                            item.value=_message[j].value;
                                            item.shadow = _message[j].value;
                                        }
                                    })

                                }

                            }
                        }
                    }
                }
            }
      });
    },
    /** Mqtt订阅主题 */
    mqttSubscribe() {
      // 订阅当前设备状态和实时监测
      const { device } = this;
      let topicProperty ='/' + device.productId + '/' + device.serialNumber + sysTopics.propertyFetch;
      let topicFunction ='/' + device.productId + '/' + device.serialNumber + sysTopics.functionFetch;
      let topicMonitor ='/' + device.productId + '/' + device.serialNumber + sysTopics.monitorFetch;
      let topics = [];
      topics.push(topicProperty);
      topics.push(topicFunction);
      topics.push(topicMonitor);
      this.$mqttTool.subscribe(topics);
    },
    /** Mqtt发布  */
    mqttPublish(model) {
        mqttService.mqttPublish(model,this.device);
    },
    /**  处理图标查询点击事件 */
    handleChartClick(e) {
        this.dialogVisible = true;
        this.queryParams.identity = e;
        this.initChart();
    },
    async initChart() {
        this.queryParams.serialNumber = this.device.serialNumber;
        if (this.daterangeTime) {
            this.queryParams.beginTime = this.daterangeTime[0];
            this.queryParams.endTime = this.daterangeTime[1] + ' 23:59';
        }
        if (String(this.queryParams.identity)) {
            this.chartLoading = true;
            const { rows } = await listMonitor(this.queryParams);
            let times = [],values = [];
            rows.forEach((item) => {
            times.push(item.time);
            values.push(item.value);
            });
            chartOption.xAxis.data = times;
            chartOption.series[0].data = values;
            this.chartLoading = false;
            this.myChart = this.$echarts.init(this.$refs.chart);
            this.myChart.setOption(chartOption);
        }
    },
    /** 开始实时监测 */
    beginMonitor() {
        mqttService.monitor(this.device,true);
        this.isMonitor=true;
    },
    /** 停止实时监测 */
    stopMonitor() {
        mqttService.monitor(this.device,false);
        this.isMonitor=false;
    },
    /**处理ota升级 */
    handleOta(){
        mqttService.ota(this.device);
    }
  },
};
</script>
<style lang="scss" scoped>
.original {
    position:absolute;
  border: none;
}
.draggable {
  border: 1px dashed #b4b4b4;
}
.dragging {
  border: 2px dashed #33e642;
}
</style>
