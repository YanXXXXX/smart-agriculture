<template>
  <div>
    <div :class="$isMobile?'mobileImain':'pcImain'">
      <div class="ibox">
        <div class="ibox_t">种植节点</div>
        <div class="ibox_m">
          <div class="zhjd">
            <div class="item" v-for="(item, index) in list" :key="index">
              <div class="item_t">
                <b>{{ item.taskName }}</b>
                {{ item.actualStart }}-{{ item.actualFinish }}
              </div>
              <div class="item_m">
                <div class="img"><img :src="$baseUrl + item.taskImage" /></div>
                <div class="con">
                  <div class="t">
                    负责人：<b>{{ item.taskHeadName }}</b>
                  </div>
                  <div class="m">
                    {{ item.remark }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="this.data.data.length>=3" class="zhjd_more" @click.stop="handleMore">
            <span :class="isShow ? 'up' : 'down'">{{ isShow ? '收起节点' : '更多节点' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlantProgress',
  mixins: [],
  components: {},
  props: ['data'],
  data() {
    return {
      list: [],
      isShow: false,
      isMobile:false
    };
  },
  computed: {},
  watch: {
      data:{
          handler:function(){
              this.list = this.data.data.slice(0, 2);
          },
          immediate:true,
          deep:true
      }
  },
  created() {
  },
  mounted() {},
  destroyed() {},
  methods: {
    //默认展示三个
    //slice的两个参数如果超出索引都不火报错，如果第一个参数超出索引则返回空数组，如果第二个参数超出索则会截取到数组最后一个元素
    handleMore(event) {
        event.stopPropagation()
      this.isShow = !this.isShow;
      if (this.isShow) {
        this.list = this.data.data;
      } else {
        this.list = this.data.data.slice(0, 2);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$pcUnit: 400px / 750;
$mobileUnit: 100vw / 750;
.pcImain {
  padding: 10 * $pcUnit 0;
  .ibox {
    border-radius: 10 * $pcUnit;
    background: #fff;
  }
  .ibox_t {
    padding: 0 50 * $pcUnit;
    line-height: 116 * $pcUnit;
    font-size: 36 * $pcUnit;
    color: #333333;
    position: relative;
  }
  .ibox_t:before {
    display: block;
    content: '';
    position: absolute;
    left: 22 * $pcUnit;
    top: 50%;
    width: 8 * $pcUnit;
    height: 40 * $pcUnit;
    border-radius: 4 * $pcUnit;
    background: #41dca2;
    margin-top: -20 * $pcUnit;
  }
  .ibox_m {
    padding: 0 22 * $pcUnit 2 * $pcUnit 22 * $pcUnit;
  }

  .zhjd {
    position: relative;
  }
  .zhjd .item {
    position: relative;
    padding: 0 18 * $pcUnit 20 * $pcUnit 80 * $pcUnit !important;
    background: #fff !important;
  }
  .zhjd .item:before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    top: 12 * $pcUnit;
    width: 60 * $pcUnit;
    height: 60 * $pcUnit;
    background: url(~@/assets/images/trace/dian.png) no-repeat;
    background-size: contain;
  }
  .zhjd .item:after {
    display: block;
    content: '';
    position: absolute;
    left: 30 * $pcUnit;
    top: 0;
    bottom: 0;
    width: 1 * $pcUnit;
    background: #07c185;
  }
  .zhjd .item:first-child:after {
    top: 42 * $pcUnit;
  }
  .zhjd .item:last-child:after {
    bottom: auto;
    height: 42 * $pcUnit;
  }

  .zhjd .item_t {
    padding: 30 * $pcUnit 0;
    line-height: 24 * $pcUnit;
    font-size: 26 * $pcUnit;
    color: #666666;
  }
  .zhjd .item_t b {
    font-weight: normal;
    margin-right: 20 * $pcUnit;
    font-size: 28 * $pcUnit;
    color: #333333;
  }
  .zhjd .item_m {
    position: relative;
    padding: 15 * $pcUnit 15 * $pcUnit 15 * $pcUnit 262 * $pcUnit;
    background: #f4f4f4;
    border-radius: 10 * $pcUnit;
    height: 198 * $pcUnit;
    box-sizing: border-box;
  }
  .zhjd .item_m .img {
    position: absolute;
    left: 15 * $pcUnit;
    top: 15 * $pcUnit;
    width: 224 * $pcUnit;
    height: 168 * $pcUnit;
  }
  .zhjd .item_m .img img {
    display: block;
    width: 224 * $pcUnit;
    height: 168 * $pcUnit;
    border-radius: 10 * $pcUnit;
    object-fit: cover;
  }
  .zhjd .item_m .con {
  }
  .zhjd .item_m .con .t {
    color: #666666;
    font-size: 26 * $pcUnit;
    line-height: 58 * $pcUnit;
    height: 58 * $pcUnit;
    margin-bottom: 12 * $pcUnit;
  }
  .zhjd .item_m .con .t b {
    font-weight: normal;
    color: #333;
    margin-left: 5 * $pcUnit;
  }
  .zhjd .item_m .con .m {
    color: #333333;
    font-size: 26 * $pcUnit;
    line-height: 34 * $pcUnit;
    height: 68 * $pcUnit;
    overflow: hidden;
  }

  .zhjd_more span {
    display: block;
    text-align: center;
    font-size: 25 * $pcUnit;
    line-height: 60 * $pcUnit;
    color: #333333;
    text-decoration: none;
  }
  .zhjd_more .down:after {
    display: inline-block;
    content: '';
    vertical-align: middle;
    margin-left: 16 * $pcUnit;
    width: 0;
    height: 0;
    border-left: 10 * $pcUnit transparent solid;
    border-right: 10 * $pcUnit transparent solid;
    border-top: 10 * $pcUnit #dddddd solid;
  }
  .zhjd_more .up:after {
    display: inline-block;
    content: '';
    vertical-align: middle;
    margin-left: 16 * $pcUnit;
    width: 0;
    height: 0;
    border-left: 10 * $pcUnit transparent solid;
    border-right: 10 * $pcUnit transparent solid;
    border-bottom: 10 * $pcUnit #dddddd solid;
  }
}
.mobileImain {
  padding: 10 * $mobileUnit 0;
  .ibox {
    border-radius: 10 * $mobileUnit;
    background: #fff;
  }
  .ibox_t {
    padding: 0 50 * $mobileUnit;
    line-height: 116 * $mobileUnit;
    font-size: 36 * $mobileUnit;
    color: #333333;
    position: relative;
  }
  .ibox_t:before {
    display: block;
    content: '';
    position: absolute;
    left: 22 * $mobileUnit;
    top: 50%;
    width: 8 * $mobileUnit;
    height: 40 * $mobileUnit;
    border-radius: 4 * $mobileUnit;
    background: #41dca2;
    margin-top: -20 * $mobileUnit;
  }
  .ibox_m {
    padding: 0 22 * $mobileUnit 2 * $mobileUnit 22 * $mobileUnit;
  }

  .zhjd {
    position: relative;
  }
  .zhjd .item {
    position: relative;
    padding: 0 18 * $mobileUnit 20 * $mobileUnit 80 * $mobileUnit;
  }
  .zhjd .item:before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    top: 12 * $mobileUnit;
    width: 60 * $mobileUnit;
    height: 60 * $mobileUnit;
    background: url(~@/assets/images/trace/dian.png) no-repeat;
    background-size: contain;
  }
  .zhjd .item:after {
    display: block;
    content: '';
    position: absolute;
    left: 30 * $mobileUnit;
    top: 0;
    bottom: 0;
    width: 1 * $mobileUnit;
    background: #07c185;
  }
  .zhjd .item:first-child:after {
    top: 42 * $mobileUnit;
  }
  .zhjd .item:last-child:after {
    bottom: auto;
    height: 42 * $mobileUnit;
  }

  .zhjd .item_t {
    padding: 30 * $mobileUnit 0;
    line-height: 24 * $mobileUnit;
    font-size: 26 * $mobileUnit;
    color: #666666;
  }
  .zhjd .item_t b {
    font-weight: normal;
    margin-right: 20 * $mobileUnit;
    font-size: 28 * $mobileUnit;
    color: #333333;
  }
  .zhjd .item_m {
    position: relative;
    padding: 15 * $mobileUnit 15 * $mobileUnit 15 * $mobileUnit 262 *
      $mobileUnit;
    background: #f4f4f4;
    border-radius: 10 * $mobileUnit;
    height: 198 * $mobileUnit;
    box-sizing: border-box;
  }
  .zhjd .item_m .img {
    position: absolute;
    left: 15 * $mobileUnit;
    top: 15 * $mobileUnit;
    width: 224 * $mobileUnit;
    height: 168 * $mobileUnit;
  }
  .zhjd .item_m .img img {
    display: block;
    width: 224 * $mobileUnit;
    height: 168 * $mobileUnit;
    border-radius: 10 * $mobileUnit;
    object-fit: cover;
  }
  .zhjd .item_m .con {
  }
  .zhjd .item_m .con .t {
    color: #666666;
    font-size: 26 * $mobileUnit;
    line-height: 58 * $mobileUnit;
    height: 58 * $mobileUnit;
    margin-bottom: 12 * $mobileUnit;
  }
  .zhjd .item_m .con .t b {
    font-weight: normal;
    color: #333;
    margin-left: 5 * $mobileUnit;
  }
  .zhjd .item_m .con .m {
    color: #333333;
    font-size: 26 * $mobileUnit;
    line-height: 34 * $mobileUnit;
    height: 68 * $mobileUnit;
    overflow: hidden;
  }

  .zhjd_more {
    padding: 20 * $mobileUnit 0;
    margin-top: -20 * $mobileUnit;
  }
  .zhjd_more span {
    display: block;
    text-align: center;
    font-size: 25 * $mobileUnit;
    line-height: 60 * $mobileUnit;
    color: #333333;
    text-decoration: none;
  }
  .zhjd_more .down:after {
    display: inline-block;
    content: '';
    vertical-align: middle;
    margin-left: 16 * $mobileUnit;
    width: 0;
    height: 0;
    border-left: 10 * $mobileUnit transparent solid;
    border-right: 10 * $mobileUnit transparent solid;
    border-top: 10 * $mobileUnit #dddddd solid;
  }
  .zhjd_more .up:after {
    display: inline-block;
    content: '';
    vertical-align: middle;
    margin-left: 16 * $pcUnit;
    width: 0;
    height: 0;
    border-left: 10 * $pcUnit transparent solid;
    border-right: 10 * $pcUnit transparent solid;
    border-bottom: 10 * $pcUnit #dddddd solid;
  }
}
</style>
