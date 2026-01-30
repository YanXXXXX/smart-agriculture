<template>
  <div>
    <div class="flex jce margin-top-10 margin-bottom-10" v-if="!$store.getters.isAdmin">
      <el-alert title="同步数据按钮会同步萤石云设备和通道信息到本地,只做设备和通道的插入和更新，删除设备请到设备管理去操作！" type="info" show-icon class="margin-right-80"></el-alert>
      <el-button type="primary" :disabled="multipleSelection.length==0" :loading="btnLoading" @click="exportData">同步数据</el-button>
    </div>
    <el-card class="card-padding-bottom">
      <el-table ref="multipleTable" v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" :selectable="selectable"/>
        <el-table-column label="设备序列号" align="center" prop="deviceSerial" />
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备型号" align="center" prop="deviceType" />
        <el-table-column label="设备在线状态" align="center" prop="status" />
        <el-table-column label="布撤防状态" align="center" prop="defence" />
        <el-table-column label="固件版本号" align="center" prop="deviceVersion" />
        <el-table-column label="用户添加时间" align="center" prop="addTime" />
        <el-table-column label="设备最后更新时间" align="center" prop="updateTime" />
        <el-table-column label="设备二级类目名称" align="center" prop="parentCategory" />
        <el-table-column label="设备风险安全等级" align="center" prop="riskLevel" />
        <el-table-column label="设备IP地址" align="center" prop="netAddress" />
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getDevice" />
    </el-card>
  </div>
</template>

<script>
import { getDeviceList } from '@/api/iot/ys';
import { importDevice,listDevice } from '@/api/iot/device'
export default {
  name: '',
  mixins: [],
  components: {},
  props: {
      product:Object
  },
  data() {
    return {
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //table 等待
      loading:true,
      //按钮 等待
      btnLoading:false,
      deviceList:[],
      multipleSelection:[],
      disabledList:[],
      AllDevList:[]
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getDevice()
  },
  mounted() {},
  destroyed() {},
  methods: {
    async getDevice() {
        this.loading = true
        const {data} = await getDeviceList({productId:this.product.productId,pageSize:this.queryParams.pageSize,pageStart:this.queryParams.pageNum - 1})
        this.loading = false
        this.total = data.page.total
        this.deviceList = data.data
        this.filterData()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    exportData(){
      const ids = this.multipleSelection.map(i=>i.deviceSerial);
      this.$confirm('是否确认同步数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnLoading=true;
        importDevice({
          productId:this.product.productId,
          serialNums:ids
        }).then(res=>{
          this.getDevice()
          this.btnLoading=false;
          this.$message({
            type: 'success',
            message: `成功同步${res.data}条数据！`
          });
        })
      })
    },
    filterData(){
      listDevice({
        productId:this.product.productId,
      }).then(res=>{
        const ids = res.rows.map(i => i.serialNumber)
        this.multipleSelection = []
        this.disabledList = []
        this.deviceList.forEach(item => {
          if(ids.includes(item.deviceSerial)){
            this.disabledList.push(item)
            this.$refs.multipleTable.toggleRowSelection(item);
          }
        });
      })
    },
    selectable(row){
      let ids = this.disabledList.map(i=>i.deviceSerial)
      return !ids.includes(row.deviceSerial)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
