<template>
    <div v-loading="loading" element-loading-text="正在初始化" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-if="loading" style="height: 100vh"></div>
    <div class="topo-fullscreen" v-else>
        <div>
            <el-dialog title="密码验证" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false" width="80%">
                <el-form :model="form">
                    <el-form-item label="分享密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmPass">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <topo-render v-if="isShow && dialogFormVisible == false" :defaultValue="selectedValue" :isShare="isShare" />
        <el-empty description="暂无分享" v-else></el-empty>
    </div>
</template>
<script>
import TopoRender from './components/topoRender';
import { getByGuid } from '@/api/scada/topo';

export default {
    name: 'TopoFullscreenShare',
    components: {
        TopoRender,
    },
    data() {
        return {
            dialogFormVisible: false,
            form: {},
            isShow: false,
            selectedValue: 30,
            isShare: true,
            sharePass: '',
            loading: true,
        };
    },
    created() {
        // this.loading = false;
    },
    mounted() {},
    methods: {
        confirmPass() {
            let url = 'dev-api/ghxx/bDeviceZt/confirmPass';
            let data = {
                guid: this.$route.query.guid,
                deviceMac: this.$route.query.deviceImei,
                sharePass: this.form.password,
            };
            this.$axios({
                url: url,
                method: 'post',
                data: data,
            }).then((res) => {
                let confirm = res.data.data;
                if (confirm) {
                    this.dialogFormVisible = false;
                    this.isShow = true;
                } else {
                    this.$message({
                        message: '密码不正确，请重新输入',
                        type: 'warning',
                    });
                }
            });
        },
        getZtData() {
            const guid = this.this.$route.query.guid;
            getByGuid(guid).then((res) => {
                if (res.data.rows.length > 0) {
                    let ztData = res.data.rows[0];
                    this.sharePass = ztData.sharePass;
                    if (ztData.isShare == 1 && ztData.sharePass) {
                        this.dialogFormVisible = true;
                        this.isShow = true;
                    } else if (ztData.isShare == 0 || ztData.isShare == null) {
                        this.dialogFormVisible = false;
                        this.isShow = false;
                    } else {
                        this.dialogFormVisible = false;
                        this.isShow = true;
                    }
                }
            });
        },
    },
};
</script>

<style scoped>
::-webkit-scrollbar-thumb {
    background-color: #ddd;
}

::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    position: absolute;
}

::-webkit-scrollbar-track {
    background-color: #ddd;
}
</style>
