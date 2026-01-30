<template>
  <div class="search-menu">
    <div class="search-menu-header">{{title}}</div>
    <div class="search-menu-body">
      <el-input v-model="queryParams[searchParma]" @input="handleInput" :placeholder="searchPlaceholder" suffix-icon="el-icon-search">
      </el-input>
      <el-menu v-if="list.length > 0" @select="handleSelect" v-loading="loading" :collapse-transition="false" :default-active="defaultActive">
        <!-- 带子项列表 -->
        <template v-if="isSub">
          <el-submenu v-for="(item,index) in list" :index="index.toString()" :key="item[keyName]">
            <template slot="title">
              <svg-icon :icon-class="icon" class="margin-left-5 margin-right-10" />
              <span slot="title">{{item[labelName].length > 11 ? `${item[labelName].substring(0, 11)}...`: item[labelName]}}</span>
            </template>
            <template v-if="item.children.length>0">
              <el-menu-item v-for="subItem in item.children" :key="subItem[subKeyName]" :index="subItem[subKeyName].toString()" :disabled="subTag[subItem[subTag.propertyName]].disable">
                <template #title>
                  <svg-icon :icon-class="subIcon" class="margin-left-10 margin-right-5" />
                  <span class="font-size-13">{{subItem[subLabelName].length > 11? `${subItem[subLabelName].substring(0, 11)}...`: subItem[subLabelName]}}</span>
                  <el-tag class="margin-left-5" :type="subTag[subItem[subTag.propertyName]].type" size="mini">{{subTag[subItem[subTag.propertyName]].text}}</el-tag>
                </template>
              </el-menu-item>
            </template>
            <template v-else>
              <div class="font-size-12 flex jcc">
                暂无数据
              </div>
            </template>
          </el-submenu>
        </template>

          <el-menu-item v-for="(item, index) in list" :index="index.toString()" :key="index" :class="customClass">
            <template #title>
              <slot :data="item">
                <svg-icon :icon-class="icon" class="margin-left-5 margin-right-5" />
                <span>{{item[labelName].length > 11? `${item[labelName].substring(0, 11)}...`: item[labelName]}}</span>
              </slot>
            </template>
          </el-menu-item>
      </el-menu>
      <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
    </div>
    <div class="search-menu-footer">
      <el-pagination small background layout="prev, pager, next" :page-size="queryParams.pageSize" :total="total" @current-change="handlePagination" @prev-click="handlePagination" @next-click="handlePagination">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SearchMenu',
  props: {
    //标题
    title: {
      type: String,
    },
    //数据查询函数
    fun: [Function],
    //搜索的参数
    searchParma: [String],
    //搜索的展位文字
    searchPlaceholder: [String],
    //值的属性
    keyName: [String],
    //名称的属性
    labelName: [String],
    //激活的菜单，是否激活，激活的项目那个属性（name）的值为value就激活，否则默认激活第一个
    activeMenu: {
      type: Object,
      default: function () {
        return {
          isActive: false,
          name: '', //属性
          value: '', //值
        };
      },
    },
    //项目的图标
    icon: {
      type: String,
      default: 'land',
    },
    //是否包含子项
    isSub: false,
    //子项的图标
    subIcon: {
      type: String,
      default: 'channel',
    },
    //项目的tag值
    tag:Object,
    //子项值的属性
    subKeyName: [String],
    //子项名称的属性
    subLabelName: [String],
    //子项tag的值
    subTag: Object,
    //不带子项自定义样式
    customClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      list: [],
      total: null,
      queryParams: {
        pageNum: 1,
        pageSize: 16,
        [this.searchParma]: null,
      },
    };
  },
  computed: {
    defaultActive: {
      get: function () {
        const { isActive, name, value } = this.activeMenu;
        const { list } = this;
        if (isActive) {
          if (name && value) {
            let index = list.findIndex((item) => item[name] == value);
            return index == -1 ? '0' : index.toString();
          } else {
            return '0';
          }
        } else {
          return '';
        }
      },
    },
  },
  watch: {
    dataList: {
      handler: function () {},
    },
  },
  async created() {
    await this.getList();
    const { isActive, name, value } = this.activeMenu;
    const { list } = this;
    if (isActive) {
      if (name && value) {
        let item = list.find((i) => i[name] == value);
        this.$emit('select', item ? item : this.list[0]);
      } else {
        this.$emit('select', this.list[0]);
      }
    }
  },
  methods: {
    /** 查询列表 */
    async getList() {
      this.loading = true;
      if (
        this.fun !== null &&
        typeof this.fun !== 'undefined' &&
        typeof this.fun === 'function'
      ) {
        const { rows, total } = await this.fun(this.queryParams);
        this.list = rows;
        this.total = total;
        this.loading = false;
      }
    },
    handleSelect(index) {
      if (this.isSub) {
        let childrenList = [];
        this.list.forEach((item) => {
          childrenList = childrenList.concat(item.children);
        });
        this.$emit('select',childrenList.filter((item) => item.channelSipId == index)[0]);
      } else {
        this.$emit('select', this.list[Number(index)]);
      }
    },
    handleInput(value) {
      this.queryParams[this.searchParma] = value;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handlePagination(e) {
      this.queryParams.pageNum = e;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.search-menu {
  &-header {
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 15px;
  }
  &-body {
    height: calc(100vh - 84px - 70px - 50px - 30px);
    padding: 0px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &-footer {
    height: 50px;
    text-align: center;
  }
}
::v-deep {
  & .el-menu {
    border-right: none;
    width: 100%;
    margin-top: 10px;
  }
  & .el-menu-item {
    padding-left: 0 !important;
    height: 40px;
    line-height: 40px;
  }
  & .el-submenu__title {
    padding-left: 5px !important;
  }
}
</style>
