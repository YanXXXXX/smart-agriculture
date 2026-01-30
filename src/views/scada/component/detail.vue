<template>
    <div class="component-detail-wrap">
        <el-row :gutter="12">
            <el-col :span="12">
                <div class="card-wrap">
                    <el-tabs class="tabs-wrap" type="border-card">
                        <el-tab-pane label="Template">
                            <editor v-model="form.componentTemplate" @init="editorInit"  lang="java" theme="monokai" width="100%" height="75vh" :options="editorOptions"></editor>
                        </el-tab-pane>
                        <el-tab-pane label="CSS">
                            <editor v-model="form.componentCss" @init="editorInit"  lang="java" theme="monokai" width="100%" height="75vh" :options="editorOptions"></editor>
                        </el-tab-pane>
                        <el-tab-pane label="Script">
                            <editor v-model="form.componentScript" @init="editorInit"  lang="java" theme="monokai" width="100%" height="75vh" :options="editorOptions"></editor>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="tools-wrap">
                        <el-button class="item-btn" style="color: #e6a23c" type="text" @click="handleSubmitForm"
                            v-hasPermi="['scada:component:edit']">
                            <svg-icon icon-class="save" />
                            保存
                        </el-button>
                        <el-button class="item-btn" type="text" icon="el-icon-refresh" @click="handleRun">运行</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <el-card class="card-wrap">
                    <div slot="header">
                        <span>预览</span>
                    </div>
                    <div ref="componentResult" style="height: 74vh; width: 100%"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Vue from 'vue';
import html2canvas from 'html2canvas';
import Editor from 'vue2-ace-editor';

import { getComponent, updateComponent } from '@/api/scada/component';

export default {
    name: 'ComponentDetail',
    components:{Editor},
    data() {
        return {
            // 表单参数
            form: {
                componentTemplate: '',
                componentStyle: '',
                componentScript: '',
            },
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
        getDetail() {
            getComponent(this.$route.query.id).then((res) => {
                if (res.code === 200) {
                    this.form = res.data;
                    this.loadData();
                }
            });
        },
        loadData() {
            let template = this.form.componentTemplate;
            if (!template) return;
            let styleCss = this.form.componentStyle;
            let style = document.createElement('style');
            style.innerHTML = styleCss;
            document.head.appendChild(style);
            let script = this.form.componentScript;
            if (script) {
                script = script.replace(/export default/, 'return');
            }
            let obj = new Function(script)();
            obj.template = template;
            let Profile = Vue.extend(obj);
            if (this.$refs.componentResult.innerHTML) {
                this.$refs.componentResult.innerHTML = '';
            }
            let newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'component-result');
            this.$refs.componentResult.appendChild(newDiv);
            new Profile().$mount('#component-result');
        },
        // 运行
        handleRun() {
            this.loadData();
        },
        // 提交按钮
        handleSubmitForm() {
            let _this = this;
            _this.$modal.loading('保存中，请稍候...');
            let canvasBox = _this.$refs.componentResult;
            html2canvas(canvasBox).then(function (canvas) {
                _this.form.base64 = canvas.toDataURL('image/png');
                updateComponent(_this.form).then((res) => {
                    if (res.code === 200) {
                        _this.$modal.msgSuccess('修改成功');
                    }
                    _this.$modal.closeLoading();
                });
            });
        },
        /** 代码编辑器初始化 */
        editorInit(editor) {
            // 可以在这里进一步配置编辑器
            require('brace/ext/language_tools'); // 语言扩展
            require('brace/mode/java'); // 语言模式
            require('brace/theme/monokai'); // 主题
            require('brace/snippets/java'); // 代码片段
            require('brace/ext/searchbox');
        },
    },
};
</script>
<style lang="scss" scoped>
.component-detail-wrap {
    padding: 20px;

    .card-wrap {
        position: relative;
        height: 86vh;

        .tabs-wrap {
            border-radius: 4px;
            border: 1px solid #e6ebf5;
            background-color: #ffffff;
            overflow: hidden;
            color: #303133;
        }

        .tools-wrap {
            position: absolute;
            right: 0;
            top: 0;
            padding: 0 10px;

            .item-btn {
                padding: 0 5px;
                height: 40px;
            }
        }

        ::v-deep .el-card__header {
            padding: 9px 15px 7px;
            min-height: 39px;
            background-color: #f5f7fa;
            border-bottom: 1px solid #dfe4ed;
        }
    }
}
</style>
