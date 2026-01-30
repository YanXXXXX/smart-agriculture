<template>
  <div id="screen" :style="{'background-image':`url(${bg})`,'background-size':'100% 100%'}">
    <div id="indexMap" v-if="type=='pageThree'" v-loading="loading" element-loading-background="#263840" element-loading-text="地图加载中" element-loading-spinner="el-icon-loading"
      :style="{height:'100vh',width:'100vw',transform: `${scale}`}"></div>
    <div class="boxTop"></div>
    <div class="boxCentLeft" v-if="type!='pageThree'&&type!='pageFive'">
      <slot name="one"></slot>
    </div>
    <div class="boxRightTop">
      <div class="title">{{title[0]}}</div>
      <div class="content">
        <slot name="two"></slot>
      </div>
    </div>
    <div class="boxRightBom">
      <div class="title">{{title[1]}}</div>
      <div class="content">
        <slot name="three"></slot>
      </div>
    </div>
    <div class="boxBomLeft" v-if="type!='pageFive' && type!='pageFour'">
      <div class="title">{{title[2]}}</div>
      <div class="content">
        <slot name="four"></slot>
      </div>
    </div>
    <div class="boxBomCent" v-if="type!='pageFive' && type!='pageFour'">
      <div class="title">{{title[3]}}</div>
      <div class="content">
        <slot name="five"></slot>
      </div>
    </div>
    <div class="boxBomRight">
      <div class="title">{{title[4]}}</div>
      <div class="content">
        <slot name="six"></slot>
      </div>
    </div>
    <div class="left" v-if="type=='pageFive' || type=='pageFour'">
      <div class="content">
        <slot name="seven"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import mapMixin from './map';
export default {
  name: '',
  mixins: [mapMixin],
  props: {
    bg: String,
    title: Array,
    baseId:Number
  },
  inject: ['getType', 'getX', 'getY'],
  //TODO:使用eventBus祖孙传参待优化
  computed: {
    type() {
      return this.getType();
    },
    scale() {
      return `scale(${1 / this.getX()},${1 / this.getY()})`;
    },
  },
};
</script>
<style lang="scss" scoped>
#screen {
  width: 100%;
  height: 100%;
  #indexMap::v-deep {
    transform-origin: left top;
    .amap-info-content {
      background: rgba(13, 29, 39, 0.8);
      border-radius: 10px;
      .InfoBox {
        width: 250px;
        height: 100px;
        position: relative;
        .title {
          color: #fff;
          font-size: 18px;
          border-bottom: 1px solid #fff;
          height: 40px;
          line-height: 40px;
        }
        .num {
          height: 60px;
          color: #ccefff;
          font-size: 12px;
          padding-top: 10px;
          box-sizing: border-box;
        }
        .tips {
          position: absolute;
          right: -18px;
          bottom: -9px;
          width: 50px;
          height: 26px;
          line-height: 26px;
          font-size: 12px;
          text-align: center;
          background: #2effb7;
          border-bottom-right-radius: 10px;
          border-top-left-radius: 10px;
        }
        .type {
          color: #fff;
          height: 60px;
          display: flex;
          align-items: center;
          .item {
            width: 50%;
          }
          .tag {
            background: #203c49;
            border-radius: 10px;
            color: #2effb7;
            font-size: 12px;
            padding: 4px 12px;
            display: inline-block;
            margin: 10px 0;
          }
        }
      }
    }
    .amap-info-sharp {
      border-top-color: rgba(13, 29, 39, 0.8);
    }
  }
  .title {
    height: 35px;
    line-height: 35px;
    padding-left: 43px;
    background: url('./img/title.png');
    background-size: 100% 100%;
    color: #ccefff;
    font-weight: 900;
  }
  .content {
    height: calc(100% - 35px);
    padding: 10px;
    box-sizing: border-box;
  }
  .boxTop {
    height: 75px;
  }
  .boxCentLeft {
    position: absolute;
    left: 20px;
    top: 95px;
    width: 65%;
    height: 650px;
    z-index: 200;
    display: flex;
  }
  .boxRightTop {
    position: absolute;
    right: 20px;
    top: 95px;
    width: 32%;
    height: 325px;
    z-index: 200;
    background: #0f2b39;
  }
  .boxRightBom {
    position: absolute;
    right: 20px;
    bottom: calc(100% - 650px - 95px);
    width: 32%;
    height: 310px;
    z-index: 200;
    background: #0f2b39;
  }
  .boxBomLeft {
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: 32%;
    height: 300px;
    z-index: 200;
    background: #0f2b39;
  }
  .boxBomCent {
    position: absolute;
    left: 50%;
    bottom: 20px;
    width: 32%;
    height: 300px;
    z-index: 200;
    background: #0f2b39;
    transform: translateX(-50%);
  }
  .boxBomRight {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 32%;
    height: 300px;
    z-index: 200;
    background: #0f2b39;
  }
  .left {
    position: absolute;
    left: 20px;
    top: 95px;
    width: 65%;
    height: calc(100% - 95px - 20px);
    z-index: 200;
  }
}
</style>
