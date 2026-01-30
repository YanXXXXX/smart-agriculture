<template>
  <div class="h100 overflow-auto">
        <div>
          <el-table :data="deviceList" border stripe>
              <el-table-column
                  prop="deviceName"
                  show-overflow-tooltip
                  label="设备名称">
              </el-table-column>
              <el-table-column
                  prop="serialNumber"
                  label="设备序号">
              </el-table-column>
              <el-table-column label="是否在线" align="center" prop="status">
                <template #default="{row}">
                    <dict-tag :options="dict.type.iot_device_status" :value="row.status" size="small" style="display:inline-block;" />
                </template>
            </el-table-column>
              <el-table-column label="操作" align="center" fixed="right"  width="60" class-name="small-padding fixed-width">
                <template #default="{row}">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-eye"
                        @click="handDeviceView(row)"
                    >查看</el-button>
                    </template>
            </el-table-column>
          </el-table>

        </div>
    </div>
</template>

<script>
import { selectDeviceList } from '@/api/agriculture/unit';

export default {
  name: '',
  dicts: ['iot_device_status'],
  mixins: [],
  components: {},
  props: {
    landId: Number,
    refresh:[String,Number]
  },
  data() {
    return {
      deviceList: []
    };
  },
  computed: {},
  watch: {
    landId: {
      handler: function (n, o) {
        this.getDeviceList();
      },
    },
    refresh: {
      handler: function (n, o) {
        this.getDeviceList();
      },
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    async getDeviceList(landId) {
      const { rows } = await selectDeviceList(this.landId);
      this.deviceList = rows;
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
