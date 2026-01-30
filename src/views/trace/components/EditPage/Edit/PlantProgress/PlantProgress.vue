<template>
    <!-- Banner & Image 通用组件 -->
    <div class="image-content">
        <p class="desc">添加生长过程(可拖动排序）</p>
        <vuedraggable
            v-model="list.data"
            tag="ul"
            draggable="li"
            v-if="list.data && list.data.length > 0"
            class="image-list"
            :class="{ disable: data.tabType == 2 }"
        >
            <li v-for="(item, index) in list.data" :key="index">
                <div class="l-info">
                    <p><span class="width-20 height-20 border-radius-10 flex jcc aic background-color-primary font-color-fff">{{ index + 1 }}</span></p>
                    <p class="flex aic">
                        <span>任务名称：</span>
                        <el-input class="width-160 "  placeholder="请输入任务名称" v-model="item.taskName" size="mini" clearable autofocus></el-input>
                    </p>
                    <p class="flex aic">
                        <span>负责人员：</span>
                        <el-input class="width-160 "  placeholder="请输入任务负责人" v-model="item.taskHeadName" size="mini" clearable autofocus></el-input>
                    </p>
                    <p class="flex aic">
                        <span>开始时间：</span>
                        <el-date-picker
                            v-model="item.actualStart"
                            class="width-160 "
                            type="date"
                            size="mini"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </p>
                    <p class="flex aic">
                        <span>结束时间：</span>
                        <el-date-picker
                            v-model="item.actualFinish"
                            class="width-160 "
                            type="date"
                            size="mini"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </p>
                    <p class="flex aic">
                        <span>任务描述：</span>
                        <el-input type="textarea" :line="2" v-model="item.remark" placeholder="请输入任务描述" size="normal" clearable></el-input>

                    </p>
                </div>
                <div class="r-image">
                    <span @click="removeItem(index)" class="el-icon-close"></span>
                    <div class="image-box margin-top-25 width-50 height-50">
                        <img :src="item && $baseUrl+item.taskImage">
                        <span @click="addItem(index)" class="el-icon-edit-outline"></span>
                    </div>
                </div>
            </li>
        </vuedraggable>
        <!-- <template >
            <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addItem(null)"
                class="add-image"
            >
                添加生长过程图片
            </el-button>
            <p class="size">（建议尺寸： 350*350 ）</p>
        </template> -->
        <div class="flex jcc">
            <el-button-group>
                <el-button type="primary" size="mini" @click="addItem(null)">添加生长过程</el-button>
                <el-button type="primary" size="mini" plain @click="importItem">导入生长过程</el-button>
            </el-button-group>

        </div>
        <el-upload
            ref="upload"
            :http-request="upload"
            :show-file-list="false"
            multiple
            action
            style="display:none"
        >
        </el-upload>
        <!-- 弹窗选择-->
        <el-dialog
            title=""
            :visible.sync="dialogVisiable"
            width="70%"
            @close="dialogVisiable=false">
            <PlantProgressDialog @selection-change="handleChange"></PlantProgressDialog>
            <span slot="footer">
                <el-button @click=" dialogVisiable= false">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import uploadFile from '../upload'
import PlantProgressDialog from './PlantProgressDialog'
export default {
    name: 'PlantProgress',
    components: {
        vuedraggable,
        PlantProgressDialog
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            list: {},
            dataList:[],
            url: '',
            index: null,
            imageIndex: null,
            dialogVisiable:false
        }
    },
    mounted() {
        this.list = this.data
    },
    methods: {
		removeItem(index) {
            this.list.data.splice(index, 1)
		},
        addItem(index) {
			this.imageIndex = index
			this.$refs['upload'].$children[0].$refs.input.click()
        },
        /** 导入生长过程 */
        importItem(){
            this.dialogVisiable = true;
        },
        /** 处理选择事件 */
        handleChange(data){
            //先不给list，因为给了list就跳过了确认按钮，先给dataList
            this.dataList = data;
        },
        /** 弹窗确认 */
        confirm(){
            //确认按钮点击之后再给this.list.data,这里的list是this.data的代言人
            this.list.data = [...this.list.data,...this.dataList];
            this.dialogVisiable = false;
        },
        async upload(params) {
			const file = params.file,
				  fileType = file.type;

            const verifyList = [
                    {
                        text: "只能上传图片格式png、jpg、gif!",
                        result: fileType.indexOf('image') != -1
                    },
                    {
                        text: "只能上传大小小于5M",
                        result: file.size / 1024 / 1024 < 5
                    }
                ]

            for (let item of verifyList) {
                if (!item.result) {
                    this.$message.error(item.text)
                    return
                }
            }

			const form = new FormData();
			form.append("file", file);

            const {url} = await uploadFile(form);

            const index = this.imageIndex
            const data = {
                taskName: '',
                taskHeadName:'',
                actualStart:'',
                actualFinish:'',
                remark:'',
                taskImage:url,
                form
            }

            if (index !== null) {
               this.list.data[index].taskImage=url;
            } else {
                this.list.data.push(data)
            }
		}
    }
}
</script>

<style lang="scss" scoped>
.image-content{
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 100%;
    overflow: hidden;
    .desc{
        text-align: center;
        font-size: 12px;
        color: #666;
        margin: 18px 0;
        padding-bottom: 10px;
        border-bottom: 1px dashed #ddd;
    }
    .size{
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-bottom: 0;
    }
    .add-image{
        width: calc(100% - 20px);
        height: 34px;
        line-height: 34px;
        padding: 0;
        font-size: 12px;
        margin-left: 10px;
        margin-top: 10px;
    }
    .image-list{
        margin: 0;
        padding: 0 10px;
        overflow: auto;
        &::-webkit-scrollbar-thumb{
            background: #dbdbdb;
            border-radius: 10px;
        }
        &::-webkit-scrollbar-track{
            background: #f6f6f6;
            border-radius: 10px;
        }
        &::-webkit-scrollbar{
            width: 6px;
        }
        li{
            list-style: none;
            background: #f7f8f9;
            border-radius: 4px;
            padding: 6px 14px 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            &.disable div{
                pointer-events: none;
                user-select: none;
            }
            .l-info{
                font-size: 12px;
                width: calc(100% - 70px);
                p{
                    margin: 12px 0 0;
                    white-space: nowrap;
                    overflow: hidden;
                    display: flex;
                    .link{
                        color: #1b8bff;
                        cursor: pointer;
                    }
                    .text{
                        white-space: nowrap;
                        text-align: -webkit-auto;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
            .r-image{
                text-align: right;
                .el-icon-close{
                    color: #999;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 6px;
                    cursor: pointer;
                    &:hover{
                        color: red;
                    }
                }
                .image-box{
                    width: 70px;
                    height: 70px;
                    border-radius: 5px;
                    overflow: hidden;
                    position: relative;
                    background: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &::before{
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,.5);
                        opacity: 0;
                        transition: all .3s;
                    }
                    span{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        color: #fff;
                        transform: translate(-50%, -50%);
                        font-size: 20px;
                        cursor: pointer;
                        opacity: 0;
                        transition: all .3s;
                    }
                    img{
                        max-width: 100%;
                    }
                    &:hover{
                        &::before, span{
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
}
</style>
