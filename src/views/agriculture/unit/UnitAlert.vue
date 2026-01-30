<template>
  <div class="h100 overflow-auto">
        <div>
          <el-table :data="alertLogList" border stripe>
            <el-table-column label="告警名称" align="center" prop="alertName" />
            <el-table-column label="设备编号" align="center" prop="serialNumber" />
            <el-table-column label="设备名称" align="center" prop="deviceName" />
            <el-table-column label="告警级别" align="center" prop="alertLevel" width="120">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.iot_alert_level" :value="scope.row.alertLevel" />
                </template>
            </el-table-column>
            <el-table-column label="告警时间" align="center" prop="createTime" width="170">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="处理状态" align="center" prop="status">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.iot_process_status" :value="scope.row.status" />
                </template>
            </el-table-column>
          </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getAlertLogList" />
        </div>
    </div>
</template>

<script>
import { selectAlertLogList } from '@/api/agriculture/unit';

export default {
  name: '',
  dicts: ['iot_device_status','iot_alert_level','iot_process_status'],
  mixins: [],
  components: {},
  props: {
    landId: Number,
    refresh:[String,Number]
  },
  data() {
    return {
      alertLogList: [],
      queryParams: {
            pageNum: 1,
            pageSize: 10,
            landId:0
        },
    total:0
    };
  },
  computed: {},
  watch: {
    landId: {
      handler: function (n, o) {
        this.queryParams.landId = n
        this.getAlertLogList();
      },
    },
    refresh: {
      handler: function (n, o) {
        this.getAlertLogList();
      },
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    async getAlertLogList() {
      const { rows,total } = await selectAlertLogList(this.queryParams);
      this.alertLogList = rows;
      this.total = total
    },
     /** 处理设备查看 */
    async handDeviceView(row){
        this.$router.push({
            path: '/iot/device-view',
            query: {
                t: Date.now(),
                deviceId: row.deviceId,
                productId:row.productId,
                isCamera:row.isCamera,
            }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
