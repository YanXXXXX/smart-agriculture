<template>
  <div>
    <div
      class="flex jcc font-size-12 padding-bottom-10 margin-tb-18"
      style="border-bottom: 1px dashed #ddd; color: #666"
    >
      选择店铺信息（可拖动排序）
    </div>
    <vuedraggable
      v-model="data.data"
      tag="ul"
      draggable="li"
      v-if="data.data && data.data.length > 0"
      class="data-list"
      :class="{ disable: data.tabType == 2 }"
    >
      <li v-for="(item, index) in data.data" :key="index">
        <div class="l-info">
          <div class="flex fdc">
                <p><span class="width-20 height-20 border-radius-10 flex jcc aic background-color-primary font-color-fff">{{ index + 1 }}</span></p>
              <span class="padding-top-5">店铺名称：{{item.shopName}}</span>
              <span class="padding-top-5">店铺地址：{{item.shopAddress}}</span>
              <span class="padding-top-5">联系人员：{{item.shopContacts}}</span>
              <span class="padding-top-5">店铺类型：{{item.shopType=='1'?'线上':'线下'}}</span>
              <span class="padding-top-5" v-if="item.shopType=='1'">店铺URL：<a class="font-color-primary" :href="item.shopUrl" target="_blank">店铺地址</a></span>
          </div>
          <!-- <p class="flex aic">
            <span>店铺名称：</span>
            <el-input
              placeholder="请输入店铺名称"
              v-model="item.shopName"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p>
          <p class="flex aic">
            <span>店铺地址：</span>
            <el-input
              placeholder="请输入店铺地址"
              v-model="item.shopAddress"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p>
          <p class="flex aic">
            <span>联系人员：</span>
            <el-input
              placeholder="联系人"
              v-model="item.shopContacts"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p>
          <p class="flex aic">
            <span>店铺类型：</span>
            <el-select v-model="item.shopType"  size="mini" placeholder="请选择店铺类型" @change="handleChange(index)" clearable filterable>
                <el-option
                    label="线上店铺"
                    :value="'1'">
                </el-option>
                <el-option
                    label="线下店铺"
                    :value="'2'">
                </el-option>
            </el-select>
          </p>
          <p class="flex aic" v-if="item.shopType==='1'">
            <span>店铺URL：</span>
            <el-input
              placeholder="请输入店铺URL"
              v-model="item.shopUrl"
              size="mini"
              clearable
              autofocus
            ></el-input>
          </p> -->
        </div>
        <div>
            <el-image class="width-60 height-60 margin-top-20 border-radius-10" :src="$baseUrl+item.shopImg" fit="fill" :lazy="true"></el-image>

        </div>
        <span @click="remove(index)" class="el-icon-close"></span>
      </li>
    </vuedraggable>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="importItem"
      class="add-image"
    >
      导入店铺
    </el-button>
    <!-- <div class="flex jcc">
        <el-button-group>
            <el-button type="primary" size="mini" @click="addItem">添加店铺</el-button>
            <el-button type="primary" size="mini" plain @click="importItem">导入店铺</el-button>
        </el-button-group>
    </div> -->

    <el-dialog
      title=""
      :visible.sync="dialogVisiable"
      width="50%"
      @close="dialogVisiable = false"
    >
      <el-card class="card-margin-bottom">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
          class="form-minus-bottom"
        >
          <el-form-item label="店铺名称">
            <el-input
              v-model="queryParams.shopName"
              placeholder="请输入店铺名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card-padding-bottom">
        <el-table
          v-loading="loading"
          :data="shopList"
          @selection-change="handleSelectionChange"
          >>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            label="店铺名称"
            align="center"
            prop="shopName"
          />
          <el-table-column
            label="店铺地址"
            align="center"
            prop="shopAddress"
          />
          <el-table-column label="店铺类型" align="center" prop="shopType" >
            <template #default="scope">
                <dict-tag :options="dict.type.trace_shop_type" :value="scope.row.shopType"/>
            </template>
          </el-table-column>
          <el-table-column label="联系人" align="center" prop="shopContacts"/>
          <el-table-column label="联系方式" align="center" prop="shopTel"/>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>
      <span slot="footer">
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listShop } from '@/api/trace/shop';
import vuedraggable from 'vuedraggable';
export default {
  name: 'Shop',
  dicts: ['trace_shop_type'],
  mixins: [],
  components: { vuedraggable },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisiable: false,
      // 溯源人员表格数据
      shopList: [],
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shopName: null,
        status: 0,
      },
      //选择的数据list
      dataList:[]
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  mounted() {},
  destroyed() {},
  methods: {
    /** 导入店铺 */
    importItem() {
      this.dialogVisiable = true;
    },
    /** 移除店铺 */
    remove(index){
        this.data.data.splice(index,1);
    },
    /** 处理选择事件 */
    handleChange(index){
        let item = this.data.data[index];
        if(item && item.shopType=='2'){
            console.log(item)
            item.shopUrl = '';
        }
    },
    getList() {
      this.loading = true;
      listShop(this.queryParams).then((response) => {
        this.shopList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 多选操作 */
    handleSelectionChange(val) {
      this.dataList = val.map((item) => ({
        shopName: item.shopName,
        shopAddress: item.shopAddress,
        shopType: item.shopType,
        shopUrl: item.shopUrl,
        shopContacts:item.shopContacts,
        shopTel:item.shopTel,
        shopImg:item.shopImg
      }));
    },
    /** 选择框确认操作 */
    confirm() {
        this.data.data = this.dataList;
        this.dialogVisiable = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.add-image {
  width: calc(100% - 20px);
  height: 34px;
  line-height: 34px;
  padding: 0;
  font-size: 12px;
  margin-left: 10px;
  margin-top: 10px;
}
.data-list {
  margin: 0;
  padding: 0 10px;
  overflow: auto;
  &::-webkit-scrollbar-thumb {
    background: #dbdbdb;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f6f6f6;
    border-radius: 10px;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  li {
    list-style: none;
    background: #f7f8f9;
    border-radius: 4px;
    padding: 6px 14px 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    &.disable div {
      pointer-events: none;
      user-select: none;
    }
    .l-info {
      font-size: 12px;
      p {
        margin: 12px 0 0;
        white-space: nowrap;
        overflow: hidden;
        display: flex;
        .link {
          color: #1b8bff;
          cursor: pointer;
        }
        .text {
          white-space: nowrap;
          text-align: -webkit-auto;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .el-icon-close {
      color: #999;
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  }
}
</style>
