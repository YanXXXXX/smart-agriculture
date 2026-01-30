<template>
    <el-dialog :title="!!id ? '修改' : '新增'" :visible.sync="open" width="25%" append-to-body>
        <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
        <el-form v-loading="loading" :model="form" ref="form" :rules="rules" label-width="80px">
            <el-form-item label="文件类型" prop="categoryName">
                <el-select v-model="form.categoryName" placeholder="请选择文件类型" filterable clearable style="width: 100%">
                    <el-option v-for="dict in dict.type.scada_gallery_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文件名称" prop="fileName">
                <el-input v-model="form.fileName" placeholder="请输入文件名称" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getGallery, updateGallery } from '@/api/scada/gallery';

export default {
    name: 'detail-dialog',
    dicts: ['scada_gallery_type'],
    props: {
        id: {
            type: Number,
            default: null,
        },
    },
    watch: {
        id: function (val) {
            if (val) {
                this.getDetailData();
            }
        },
    },
    data() {
        return {
            loading: false,
            open: false, // 是否显示
            // 表单校验
            rules: {
                categoryName: [
                    {
                        required: true,
                        message: '请选择文件类型',
                        trigger: 'change',
                    },
                ],
                fileName: [
                    {
                        required: true,
                        message: '请输入文件名称',
                        trigger: 'change',
                    },
                ],
            },
            // 表单参数
            form: {
                categoryName: '',
                fileName: '',
            },
        };
    },
    methods: {
        // 获取详情
        getDetailData() {
            this.loading = true;
            getGallery(this.id)
                .then((res) => {
                    if (res.code === 200) {
                        this.form = res.data;
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        // 保存数据
        handleSave() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.id) {
                        updateGallery(this.form).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.$emit('save');
                            } else {
                                this.$modal.msgError(res.msg);
                            }
                        });
                    }
                }
            });
        },
        // 取消
        handleCancel() {
            this.open = false;
        },
    },
};
</script>
