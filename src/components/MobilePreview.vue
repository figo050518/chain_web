<template>
  <div class="moblie-preview">
    <div class="banner"
         :style="bannerBg">
      <!-- <img class="logo" src="@/assets/images/mobile/logo.png" alt="" /><br /> -->
      <!-- <span style="color:#fff">config：{{config}}</span>  -->
      <img class="logo"
           :src="config.logo"
           alt="" /><br />
      <img class="warn"
           src="@/assets/images/mobile/warn.png"
           alt="" /><br />
      <span class="warnText">{{
        config.warning_module || "多次验证 谨防假冒"
      }}</span>

    </div>

    <div class="content-wrap">
      <!-- 记录展示 -->
      <div class="info-item"
           v-show="config.scan_record === '1'">
        <div class="time">
          <img src="@/assets/images/mobile/time-icon.png"
               alt="" /><br />
          <span class="title">首次查询时间</span> <br />
          <span class="value">18-11-21 16:17:26</span>
        </div>
        <div class="addr">
          <img src="@/assets/images/mobile/addr-icon.png"
               alt="" /><br />
          <span class="title">首次查询地点</span> <br />
          <span class="value">江苏 南京 雨花台区</span>
        </div>
        <div class="record">
          <img src="@/assets/images/mobile/record-icon.png"
               alt="" /><br />
          <span class="title">查看扫码记录</span> <br />
          <span class="value">查看详情 ></span>
        </div>
      </div>
      <!-- 店铺 -->
      <div class="per-card modal-guide">
        <img src="@/assets/images/mobile/shop.png"
             class="store-logo" />
        <div class="right">
          <p class="name">南京老字号店铺</p>
          <p class="intro">面馆</p>
          <a-button class="guide-btn"
                    icon="shop">前往旗舰店铺</a-button>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="per-card">
        <div class="title">产品认证信息</div>
        <div class="wrap">
          <p>品名：修复油</p>
          <p>规格：500ml</p>
          <p>原产地：法国</p>
          <p>贸易国：法国</p>
          <p>贸易商：5g4s5gs5g4s4g5sgs4gsg5sg</p>
        </div>
        <div class="button">
          <img src="@/assets/images/mobile/logo-mini.png"
               alt="" />
          <span>区块链标识：a4babaa539afsu8048</span>
        </div>
      </div>

      <!-- 各环节展示 -->
      <div class="per-card">
        <div class="title">加工流程</div>
        <div class="wrap steps">
          <div class="per-step">
            <div class="step-title">
              <div class="line"></div>
              <img src="@/assets/images/mobile/step.png"
                   alt="" />
              <span class="text">发酵</span>
            </div>
            <div class="step-content"></div>
          </div>
          <div class="per-step">
            <div class="step-title">
              <div class="line"></div>
              <img src="@/assets/images/mobile/step.png"
                   alt="" />
              <span class="text">勾兑</span>
            </div>
            <div class="step-content"></div>
          </div>
          <div class="per-step">
            <div class="step-title">
              <div class="line"></div>
              <img src="@/assets/images/mobile/step.png"
                   alt="" />
              <span class="text">陈酿</span>
            </div>
            <div class="step-content"></div>
          </div>
          <div class="per-step">
            <div class="step-title">
              <div class="line"></div>
              <img src="@/assets/images/mobile/step.png"
                   alt="" />
              <span class="text">制曲</span>
            </div>
            <div class="step-content"></div>
          </div>
          <div class="per-step">
            <div class="step-title">
              <div class="line"></div>
              <img src="@/assets/images/mobile/step.png"
                   alt="" />
              <span class="text">罐装</span>
            </div>
            <div class="step-content">
              <img class="play"
                   src="@/assets/images/mobile/play.png"
                   alt="" />
            </div>
          </div>
        </div>

        <div class="button">
          <img src="@/assets/images/mobile/logo-mini.png"
               alt="" />
          <span>区块链标识：a4babaa539afsu8048</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // bannerBg: {
      //   background: `url(${this.config.banner}) center center / cover no-repeat`,
      // },
    };
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          applets_name: "",
          background_picture: "https://image.peerfintech.cn/saas-bg.png",
          logo: "https://image.peerfintech.cn/FjQI8VfXnwnBt3LFsx93N_90DLEx",
          warn1: "1",
          warning_module: "多次验证 谨防假冒",
          scan_record: "1",
        };
      },
    },
  },
  computed: {
    bannerBg () {
      return {
        background: `url(${this.config.background_picture}) center center / cover no-repeat`,
      };
    },
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.moblie-preview {
  widows: 100%;
  .banner {
    width: 100%;
    height: 428px;
    // background: url("../assets/images/mobile/banner.png") center center / cover
    //   no-repeat;
    padding: 80px 0;
    text-align: center;
    .logo {
      width: 150px;
      height: 150px;
      margin-bottom: 20px;
    }
    .warn {
      width: 76px;
      height: 83px;
    }
    .warnText {
      font-size: 20px;
      color: #feffff;
    }
  }
  .content-wrap {
    padding: 20px 13px;
    .info-item {
      display: flex;
      text-align: center;
      justify-content: space-around;
      font-family: 'Source Han Sans CN';
      img {
        width: 26px;
        height: 26px;
      }
      .title {
        font-size: 13px;
        line-height: 26px;
        color: #022648;
      }
      .value {
        font-size: 12px;
        line-height: 20px;
        color: #1890ff;
      }
    }
    .shop {
      margin-top: 30px;
      padding-bottom: 16px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    }
    .modal-guide {
      padding: 13px 25px;
      display: flex;
      justify-content: space-between;
      .store-logo {
        width: 70px;
        height: 70px;
      }
      .right {
        width: calc(100% - 90px);
        .name {
          font-size: 13px;
          margin-bottom: 4px;
          color: #000;
        }
        .intro {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
          margin-bottom: 4px;
        }
        .guide-btn {
          background-image: linear-gradient(180deg, #46bbff, #186dff);
          border-radius: 15px;
          border: 0;
          font-size: 12px;
          height: 27px;
          line-height: 27px;
          color: #fff;
          padding: 0px 20px;

          
        }
      }
    }

    .per-card {
      margin-top: 30px;
      padding-bottom: 16px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
      .title {
        width: 144px;
        height: 37px;
        line-height: 37px;
        margin-left: 5px;
        text-align: center;
        color: #022648;
        font-family: Source Han Sans CN;
        font-size: 14px;
        font-weight: Medium;
        background: url('../assets/images/mobile/card-title.png') no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .wrap {
        padding: 16px 30px 0;
      }
      .steps {
        padding-bottom: 16px;
        //   display: flex;
        //   justify-content: space-between;
        //   position: relative;
        .per-step {
          display: flex;
          justify-content: space-between;
          .step-title {
            width: 80px;
            // height: 100%;
            height: 90px;
            position: relative;
            .line {
              position: absolute;
              top: 10px;
              left: 10px;
              width: 3px;
              height: 110%;
              border-left: 2px dotted #0083ff;
              z-index: 0;
            }

            img {
              width: 19px;
              height: 19px;
              position: absolute;
              top: 10px;
              left: 0;
              z-index: 2;
              //   margin-right: 10px;
            }
            .text {
              display: inline-block;
              margin-left: 30px;
              margin-top: 10px;
            }
          }
          .step-content {
            width: 150px;
            height: 90px;
            margin-top: 10px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            .play {
              width: 56px;
              height: 56px;
            }
          }
        }
        .per-step:last-child .line {
          height: 100%;
        }

        //   .steps-title{
        //       width: 80px;
        //       .line{
        //       position: absolute;
        //       top: 0;
        //       left: 20px;
        //       width: 3px;
        //       height: 100%;
        //       border-left: 1px dotted #0083FF;
        //       z-index: -1;
        //   }
        //   }
        //   .steps-content{
        //       width: 100px;

        //   }
      }
      .button {
        margin: 0 30px 16px 30px;
        padding: 6px 23px;
        border-radius: 5px;
        border: 1px solid #0083ff;
        background: #ecf6ff;
        color: #0083ff;
        img {
          width: 22px;
          height: 22px;
          margin-right: 20px;
        }
        span {
          display: inline-block;
          width: calc(100% - 42px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: bottom;
        }
      }
    }
  }
}
</style>