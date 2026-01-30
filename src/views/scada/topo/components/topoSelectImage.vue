<template>
    <el-row class="topo-select-image" :gutter="10">
        <el-col :span="5">
            <el-menu class="menu-wrap" :default-active="categoryTypes[0] && categoryTypes[0].dictValue">
                <el-menu-item index="1" @click="handleClick('我的收藏')">
                    <i class="el-icon-star-off"></i>
                    <span slot="title">我的收藏</span>
                </el-menu-item>
                <el-submenu index="2">
                    <template slot="title">
                        <div class="submenu-title">
                            <i class="el-icon-location"></i>
                            <span>系统图库</span>
                        </div>
                    </template>
                    <el-menu-item v-for="item in categoryTypes" :key="item.dictValue" :index="item.dictValue" :label="item.dictLabel" :value="item.dictValue" @click="handleClick(item.dictValue)">
                        {{ item.dictLabel }}
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
        <el-col :span="19">
            <el-form @submit.native.prevent :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-form-item label="文件名称" prop="fileName">
                    <el-input style="width: 182px" v-model="queryParams.fileName" placeholder="请输入文件名称" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">重置</el-button>
                    <el-button type="warning" icon="el-icon-star-off" size="mini" :disabled="multiple" @click="handleCollection">收藏</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8" v-if="this.queryParams.categoryName == '我的收藏'">
                <el-col :span="1.5">
                    <el-upload
                        ref="upload"
                        :action="upload.uploadUrl"
                        :headers="upload.headers"
                        :before-upload="beforeUpload"
                        :limit="500"
                        :on-success="handleAvatarSuccess"
                        :show-file-list="false"
                        :file-list="upload.imageList"
                        multiple
                    >
                        <el-button type="primary" plain size="mini" @click="handleUploadFile">
                            <i class="el-icon-upload el-icon--right" />
                            上传
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
                </el-col>
            </el-row>
            <div v-loading="loading">
                <div class="data-box" v-if="total !== 0">
                    <el-checkbox-group class="img-box-wrap" v-model="checkImages" @change="checkboxChange">
                        <el-card class="img-card" :style="{ margin: '0 10px 10px 0' }" v-for="item in uploadList" :body-style="{ padding: '5px' }" :key="item.id">
                            <img class="img" :src="baseApi + item.resourceUrl" />
                            <div class="name-wrap">
                                <span>{{ item.fileName }}</span>
                            </div>
                            <el-checkbox class="checkbox" :label="item" :key="item.id"><span v-show="false">占位符</span></el-checkbox>
                        </el-card>
                    </el-checkbox-group>
                </div>
                <el-empty description="暂无数据" v-if="total == 0"></el-empty>
            </div>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="paginationChange" :page-sizes="[24, 48, 72]" :page-size="5" />
        </el-col>
    </el-row>
</template>

<script>
import { getDicts } from '@/api/system/dict/data';
import { listGallery } from '@/api/scada/gallery';
import { getFavoriteGallerys, delFavoritesGallery } from '@/api/scada/topo';

export default {
    name: 'Upload',
    props: {
        categoryName: String,
        message: String,
    },
    data() {
        return {
            baseApi: process.env.VUE_APP_BASE_API,
            loading: true, // 遮罩层
            categoryTypes: [], // 种类类型
            multiple: true, // 非多个禁用
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 24,
                categoryName: '',
                fileName: '',
                moduleGuid: '云组态',
                orderByColumn: 'id',
                isAsc: 'desc',
            },
            uploadList: [], // 上传信息表格数据
            total: 0, // 总条数
            checkImages: [], // 选中图标
            ids: [], // 选中数组
            upload: {
                // 设置上传的请求头部
                headers: { Authorization: 'Bearer ' + sessionStorage.getItem('Admin-Token-WebTopo') },
                // 上传的地址
                uploadUrl: '',
                imageList: [],
            },
        };
    },
    mounted() {
        this.getDatas();
    },
    methods: {
        async getDatas() {
            const dictType = 'scada_gallery_type';
            const { data } = (await this.getCategoryTypes(dictType)) || [];
            this.categoryTypes = data;
            this.queryParams.categoryName = data[0].dictValue;
            this.getList();
        },
        // 获取图库菜单
        getCategoryTypes(dictType) {
            return new Promise((resolve, reject) => {
                getDicts(dictType)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 查询上传信息列表
        getList() {
            this.loading = true;
            listGallery(this.queryParams).then((res) => {
                if (res.code === 200) {
                    this.uploadList = res.rows;
                    this.total = res.total;
                    this.checkImages = [];
                }
                this.loading = false;
            });
        },
        getFavorites() {
            this.loading = true;
            getFavoriteGallerys(this.queryParams).then((res) => {
                if (res.code === 200) {
                    this.uploadList = res.rows;
                    this.total = res.total;
                    this.checkImages = [];
                }
                this.loading = false;
            });
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            if (this.queryParams.categoryName === '我的收藏') {
                this.getFavorites();
            } else {
                this.getList();
            }
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // pagination变化
        paginationChange() {
            if (this.queryParams.categoryName === '我的收藏') {
                this.getFavorites();
            } else {
                this.getList();
            }
        },
        // 选中后
        checkboxChange(selection) {
            this.multiple = !selection.length;
        },
        //收藏
        handleCollection() {
            this.checkImages.forEach((item) => {
                const params = {
                    categoryName: '我的收藏',
                    resourceUrl: item.resourceUrl,
                    fileName: item.fileName,
                    moduleGuid: '云组态',
                };
                listGallery(params).then((res) => {});
            });
            this.$message({ message: '收藏成功', type: 'success' });
            this.checkImages = [];
        },
        // 菜单选择
        handleClick(label) {
            this.queryParams.categoryName = label;
            this.multiple = true;
            this.checkImages = [];
            if (this.queryParams.categoryName === '我的收藏') {
                this.getFavorites();
            } else {
                this.getList();
            }
        },
        // 上传
        handleUploadFile(file) {
            this.upload.uploadUrl = this.baseApi + '/scada/center/uploadGalleryFavorites' + '?categoryName=' + this.queryParams.categoryName;
        },
        beforeUpload(file) {
            if (this.queryParams.categoryName == '') {
                this.$message({
                    message: '请选择左侧上传的类型',
                    type: 'warning',
                });
                this.$refs.upload.abort();
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 10MB!');
            }
            return isLt2M;
        },
        handleAvatarSuccess(res, file) {
            if (res.code == 200) {
                this.$message.success('上传成功');
                this.$refs.upload.clearFiles();
                this.getFavorites();
            } else {
                this.$message.error(res.msg);
            }
        },
        // 删除按钮操作
        handleDelete() {
            const ids = [];
            this.checkImages.forEach((item) => {
                ids.push(item.id);
            });
            this.$confirm('是否确认删除此图标文件么？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(function () {
                    return delFavoritesGallery(ids);
                })
                .then(() => {
                    if (this.queryParams.categoryName === '我的收藏') {
                        this.getFavorites();
                    } else {
                        this.getList();
                    }
                    this.$modal.msgSuccess('删除成功');
                });
        },
        // 图片选择（外部调用）
        handleChoice() {
            return this.checkImages;
        },
        // 清除选择（外部调用）
        clearChoice() {
            this.checkImages = [];
        },
    },
};
</script>
<style lang="scss" scoped>
.topo-select-image {
    .menu-wrap {
        margin-top: 5px;
        height: 500px;
        overflow-x: hidden;
        overflow-y: auto;

        .submenu-title {
            padding: 0 20px;
        }
    }

    .data-box {
        height: 377px;
        overflow-y: auto;
        overflow-x: hidden;

        .img-box-wrap {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: center;
            padding: 0 10px;

            .img-card {
                width: 153px;
                height: auto;
                text-align: center;
                padding: 10px;
                position: relative;

                .img {
                    width: 80px;
                    height: 80px;
                    margin-top: 10px;
                }

                .name-wrap {
                    text-align: center;
                    font-size: 11px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-top: 10px;
                }

                .checkbox {
                    position: absolute;
                    top: 8px;
                    right: 0px;
                }
            }
        }
    }
}

::-webkit-scrollbar {
    width: 2px;
    height: 3px;
    position: absolute;
}

::-webkit-scrollbar-thumb {
    background-color: #cccccc59;
}
</style>
