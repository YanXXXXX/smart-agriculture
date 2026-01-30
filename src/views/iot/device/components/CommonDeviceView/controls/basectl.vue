<template>
  <div>
      <el-select v-if="item.dataType.type=='bool'" size="mini" v-model="item.value" class="w100"  placeholder="请选择" @change="mqttPublish(item)" :disabled="isDisabled">
        <el-option v-for="subItem in [{value:'0',text:item.dataType.falseText},{value:'1',text:item.dataType.trueText}]" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
    </el-select>
    <el-select v-if="item.dataType.type=='enum'" size="mini" v-model="item.value" class="w100"  placeholder="请选择" @change="mqttPublish(item)" :disabled="isDisabled">
        <el-option v-for="subItem in item.dataType.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
    </el-select>
    <el-input v-if="item.dataType.type=='string'" size="mini" v-model="item.value" :placeholder="'请输入字符串 '+(item.dataType.unit?'，单位：'+item.dataType.unit:'')" :disabled="isDisabled">
        <el-button slot="append" icon="el-icon-s-promotion" @click="mqttPublish(item)" style="font-size:20px;" title="指令发送" :disabled="isDisabled"></el-button>
    </el-input>
    <el-input v-if="item.dataType.type=='decimal'" size="mini" v-model="item.value" type="number" :placeholder="'请输入小数 '+(item.dataType.unit?'，单位：'+item.dataType.unit:'')" :disabled="isDisabled">
        <el-button slot="append" icon="el-icon-s-promotion" @click="mqttPublish(item)" style="font-size:20px;" title="指令发送" :disabled="isDisabled"></el-button>
    </el-input>
    <el-input v-if="item.dataType.type=='integer'" size="mini" v-model="item.value"  type="integer" :placeholder="'请输入整数 '+(item.dataType.unit?'，单位：'+item.dataType.unit:'')" :disabled="isDisabled">
        <el-button slot="append" icon="el-icon-s-promotion" @click="mqttPublish(item)" style="font-size:20px;" title="指令发送" :disabled="isDisabled"></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'basectl',
  mixins: [],
  components: {},
  props: {
      item:Object,
      device:Object
  },
  data() {
    return{}
  },
  computed: {
      isDisabled(){
        //只读肯定禁用
        if(this.item.isReadonly==1){
            return true;
        }
        //在线 或者 影子模式 不禁用
        else if(this.device.status==3 || this.device.isShadow==1){
            return false;
        }
        else{
            return true;
        }
      },
  },
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
      mqttPublish(item){
          this.$emit('mqttPublish',item)
      }
  },
};
</script>
<style lang="scss" scoped>
</style>
