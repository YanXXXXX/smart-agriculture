<template>
    <div
        :style="{
            width: detail.style.position.w + 'px',
            height: detail.style.position.h + 'px',
            background: this.detail.style.backColor,
        }"
        class="tableClass"
    >
        <div>
            <el-row :gutter="10" class="mb8">
                <el-col :span="6">
                    <el-select v-model="queryParams.paramName" placeholder="所属变量" size="small" style="width: auto" clearable filterable>
                        <el-option v-for="realData in realDataOptions" :key="realData.id" :label="realData.paramName" :value="realData.paramName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="14">
                    <el-date-picker
                        v-model="dateRange"
                        size="small"
                        :style="{ width: '340px', background: this.detail.style.backColor, color: this.detail.style.foreColor }"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    ></el-date-picker>
                </el-col>
                <el-col :span="4">
                    <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                </el-col>
            </el-row>

            <el-table
                v-loading="loading"
                :data="historyList"
                :cell-style="{ background: this.detail.style.backColor, color: this.detail.style.foreColor }"
                :row-style="{ background: this.detail.style.backColor, color: this.detail.style.foreColor }"
                :header-cell-style="{ background: this.detail.style.backColor, color: this.detail.style.foreColor }"
            >
                <el-table-column label="上传时间" align="center" prop="reportTime" width="180" />
                <el-table-column label="变量名称" align="center" prop="paramName" />
                <el-table-column label="变量值" align="center" prop="paramValue" />
            </el-table>
        </div>
        <pagination
            :style="{ background: this.detail.style.backColor, color: this.detail.style.foreColor }"
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
            :page-sizes="[5, 10, 15]"
            :page-size="5"
        />
    </div>
</template>

<script>
import BaseView from './View';

export default {
    name: 'History',
    extends: BaseView,
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 设备历史记录表格数据
            historyList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 5,
                deviceImei: null,
                orderByColumn: 'id',
                isAsc: 'desc',
                paramName: '',
                beginTime: null,
                endTime: null,
                ztGuid: this.$route.query.guid,
            },
            dateRange: [],
            realDataOptions: [],
        };
    },
    mounted() {
        // this.getRealList();
        // this.getList();
    },
    methods: {
        getRealList() {
            let queryParams = {
                ztGuid: this.$route.query.guid,
                pageNum: 1,
                pageSize: 999,
                orderByColumn: 'id',
                isAsc: 'desc',
            };
            let url = 'prod-api/ghxx/bDeviceRealData/list';
            this.$axios({
                url: url,
                method: 'get',
                params: queryParams,
            }).then((res) => {
                this.realDataOptions = res.data.rows;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            if (this.dateRange && this.dateRange.length == 2) {
                this.queryParams.beginTime = this.dateRange[0];
                this.queryParams.endTime = this.dateRange[1];
            } else {
                this.queryParams.beginTime = null;
                this.queryParams.endTime = null;
            }
            this.getList();
        },
        /** 查询设备历史记录列表 */
        getList() {
            this.loading = true;
            let url = 'prod-api/ghxx/bDeviceHistoryData/list';
            this.$axios({
                url: url,
                method: 'get',
                params: this.queryParams,
            }).then((res) => {
                this.historyList = res.data.rows;
                this.total = res.data.total;
                this.loading = false;
            });
        },
    },
};
</script>
<style scoped>
.tableClass {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
}

.el-input {
    background-color: brown !important;
    color: #fff !important;
}
</style>
