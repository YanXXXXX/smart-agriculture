<template>
    <div class="echart-detail-wrap">
        <el-row :gutter="12">
            <el-col :span="12">
                <el-card class="card-wrap ">
                    <div slot="header">
                        <span>图表编辑&nbsp;-&nbsp;</span>
                        <a href="https://www.isqqw.com/" target="_blank" style="color: #1890ff">图表库</a>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="loadEchartDatas"
                            icon="el-icon-refresh">运行</el-button>
                        <el-button style="float: right; padding: 3px 0; margin-right: 10px; color: #e6a23c" type="text"
                            @click="handleSubmitForm" v-hasPermi="['scada:echart:edit']">
                            <svg-icon icon-class="save" />
                            保存
                        </el-button>
                    </div>
                    <editor v-model="form.echartData" @init="editorInit"  lang="javascript" theme="dawn" width="100%" height="75vh" :options="editorOptions"></editor>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="card-wrap">
                    <div slot="header">
                        <span>图表展示</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="handleDownloadImage"
                            icon="el-icon-download">下载</el-button>
                    </div>
                    <div ref="echart" style="height: 75vh; width: 100%"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getEchart, updateEchart } from '@/api/scada/echart';
import html2canvas from 'html2canvas';
import Editor from 'vue2-ace-editor';

export default {
    name: 'EchatDetail',
    components:{Editor},
    data() {
        return {
            // 表单参数
            form: {
                echartData: '',
            },
            echart: null,
            //代码组建参数
            editorOptions: {
                enableBasicAutocompletion: true, // 启用基本自动完成
                enableSnippets: true, // 启用代码段
                enableLiveAutocompletion: true, // 启用实时自动完成
                tabSize: 2, // 标签大小
                fontSize: 14, // 字体大小
                showPrintMargin: false, // 去除编辑器里的竖线
                useWorker: false, // 是否使用后台工作线程
                wrap: true, // 自动换行
            },
        };
    },
    mounted() {
        this.getDetail();
    },
    methods: {
        // 获取详情
        getDetail() {
            getEchart(this.$route.query.id).then((res) => {
                if (res.code === 200) {
                    this.form = res.data;
                    this.loadEchartDatas();
                }
            });
        },
        // 数据加载
        loadEchartDatas() {
            if (this.echart) {
                this.echart.dispose(); // 销毁ECharts实例
            }
            this.echart = this.$echarts.init(this.$refs.echart, 'light');
            let funStr = 'function (echarts,myChart) {\n' + this.form.echartData + '\n' + ' return option   \n' + '}';
            let fun = eval('(' + funStr + ')');
            let option = fun(this.$echarts,this.echart);
            if(!this.form.echartData.includes("myChart")) {
                this.echart.setOption(option);
            }
        },
        // 提交按钮
        handleSubmitForm() {
            let canvasBox = this.$refs.echart;
            let _this = this;
            _this.$modal.loading('保存中，请稍候...');
            html2canvas(canvasBox).then(function (canvas) {
                _this.form.base64 = canvas.toDataURL('image/png');
                updateEchart(_this.form).then((res) => {
                    if (res.code === 200) {
                        _this.$modal.msgSuccess('修改成功');
                    }
                    _this.$modal.closeLoading();
                });
            });
        },
        // 页面元素转图片
        handleDownloadImage() {
            // 转换成canvas
            let canvasBox = this.$refs.echart;
            let _this = this;
            html2canvas(canvasBox).then(function (canvas) {
                var img = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                // 创建a标签，实现下载
                var creatIMg = document.createElement('a');
                creatIMg.download = `${_this.form.echartName}.png`; // 设置下载的文件名，
                creatIMg.href = img; // 下载url
                document.body.appendChild(creatIMg);
                creatIMg.click();
                creatIMg.remove(); // 下载之后把创建的元素删除
            });
        },
        /** 代码编辑器初始化 */
        editorInit(editor) {
            // 可以在这里进一步配置编辑器
            require('brace/ext/language_tools'); // 语言扩展
            require('brace/mode/javascript'); // 语言模式
            require('brace/theme/dawn'); // 主题
            require('brace/snippets/javascript'); // 代码片段
            require('brace/ext/searchbox');
        },
    },
};
</script>
<style lang="scss" scoped>
.echart-detail-wrap {
    padding: 20px;

    .card-wrap {
        height: 86vh;
    }
}
</style>
