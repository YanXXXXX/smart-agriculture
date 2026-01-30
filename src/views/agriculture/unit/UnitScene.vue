<template>
  <div class="h100 overflow-auto">
        <div>
          <el-table :data="sceneList" border stripe>
              <el-table-column
                  prop="sceneName"
                  show-overflow-tooltip
                  label="场景名称">
              </el-table-column>
             <el-table-column label="状态" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <el-tag type="success" size="small" v-if="scope.row.status==1">启动</el-tag>
                    <el-tag type="danger" size="small" v-if="scope.row.status==2">暂停</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right"  width="100" class-name="small-padding fixed-width">
                <template #default="{row}">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-caret-right"
                        @click="handleRun(row)"
                    >执行一次</el-button>
                    </template>
            </el-table-column>
          </el-table>

        </div>
    </div>
</template>

<script>
import { selectSceneList } from '@/api/agriculture/unit';
import sysTopics from '@/utils/sysTopics';
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
      sceneList: []
    };
  },
  computed: {},
  watch: {
    landId: {
      handler: function (n, o) {
        this.getAlertLogList();
      },
    },
    refresh: {
      handler: function (n, o) {
        this.getAlertLogList();
      },
    },
  },
  created() {
      this.connectMqtt();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /* 连接Mqtt消息服务器 */
    async connectMqtt() {
        if (this.$mqttTool.client == null) {
            await this.$mqttTool.connect();
        }
    },
    async getAlertLogList() {
      const { rows } = await selectSceneList(this.landId);
      this.sceneList = rows;
    },
    /** 执行一次 */
    handleRun(scene) {
        let actions = JSON.parse(scene.actions);
        for (let i = 0; i < actions.length; i++) {
            let topic = "";
            let message = ""
            if (actions[i].type == 1) {
                // 属性,在线模式
                topic = "/" + actions[i].productId + "/" + actions[i].serialNumber + sysTopics.propertyOnlineSend;
                message = '[{"id":"' + actions[i].id + '","value":"' + actions[i].value + '"}]';
            } else if (actions[i].type == 2) {
                // 功能,在线模式
                topic = "/" + actions[i].productId + "/" + actions[i].serialNumber + sysTopics.functionOnlineSend;
                message = '[{"id":"' + actions[i].id + '","value":"' + actions[i].value + '"}]';
            }
            if (topic != "") {
                // 发布
                this.$mqttTool.publish(topic, message, actions[i].deviceName).then(res => {
                    this.$modal.notifySuccess(res);
                }).catch(res => {
                    this.$modal.notifyError(res);
                });
            }
        }

    },
  },
};
</script>
<style lang="scss" scoped>
</style>
