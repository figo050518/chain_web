<template>
  <div class="mini-modal">
    <a-row :gutter="10" class="animate__animated animate__zoomIn">
      <a-col :span="6" v-for="(item,index) in miniModalList" :key="index">
        <div class="mini-card">
          <div class="card-top-bg banner" :style="`background: url(${item.background_picture}) center center / cover no-repeat`">
            <img
              class="logo"
              :src="item.logo"
              alt=""
            /><br />
            <img
              class="warn"
              src="@/assets/images/mobile/warn.png"
              alt=""
            /><br />
            <span class="warnText">{{item.warning_module}}</span>

            <!-- <div class="header-logo">
              <img
                alt="logo"
                class="logo"
                src="@/assets/images/mobile/logo.png"
              />
            </div> -->
            <!-- <div class="warn">
              <a-icon type="info-circle" />&nbsp;
              <span>多次验证，谨防假冒</span>
            </div> -->
            <!-- <div class="scan-record">
              <div class="scan-time">
                <p class="title">首次查询时间</p>
                <p class="value">2018-10-21 16:17:26</p>
              </div>
              <div class="scan-addr">
                <p class="title">首次查询地点</p>
                <p class="value">--</p>
              </div>
            </div> -->
          </div>
          <a-card
            :title="item.applets_name"
            :bordered="false"
            style="width: 100%; height: 122px"
          >
            <div style="display:flex;justify-content:space-around;">
              <a-icon type="eye" style="cursor: pointer" @click="showMobile(item)" />
              <a-divider 
              v-if="item.applets_id != 1" type="vertical" />
              <a-icon type="edit" v-if="item.applets_id != 1" style="cursor: pointer" @click="editConfig(item)" />
            </div>
          </a-card></div
      ></a-col>

      <a-col :span="6"
        ><div class="add-mini-card" @click="addModal">
          <a-icon type="plus" />
          <span>添加模板</span>
        </div></a-col
      >
    </a-row>

    <a-modal v-model="visible" width="423px" title="模板预览" :footer="null">
      <div style="height: 640px; overflow-y: auto">
        <mobile-preview :config="curModalItem"></mobile-preview>
      </div>
    </a-modal>
  </div>
</template>
<script>
import MobilePreview from "@/components/MobilePreview.vue";
import {mapGetters,mapActions} from "vuex"
export default {
  data() {
    return {
      visible: false,
      // modalList: [
      // ],
      curModalItem:{}
    };
  },
  components: {
    MobilePreview,
  },
  computed:{
    ...mapGetters({
      miniModalList:"config/miniModalList"
    })
  },
  mounted() {
    this.getMiniList({
      company_id:this.$store.getters.company_id
    });
  },
  methods: {
    ...mapActions({
      getMiniList:"config/getMiniList"
    }),
    showMobile(item) {
      this.curModalItem=item;
      this.visible = true;
    },
    addModal() {
      this.$router.push({path:"/mini-config",query:{id:1}});
      // this.$router.push("/config/mini-config");
    },
    editConfig(item){
      // this.$router.push({path:"/mini-config",query:{id:2,item}});
      this.$router.push({path:"/mini-config",query:{id:2,item:JSON.stringify(item)}});
    }
  },
};
</script>
<style lang="less" scoped>
.mini-modal {
  .mini-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 8px;
    // .card-top-bg {
    //   height: 270px;
    //   padding-bottom: 14.4px;
    //   padding-top: 32px;
    //   justify-content: flex-end;

    //   background-image: url("https://trace-res.oss-cn-shanghai.aliyuncs.com/157915995212289708314");
    //   background-size: cover;
    //   background-position: center center;

    //   .header-logo {
    //     width: 130px;
    //     margin: 0 auto;
    //     text-align: center;
    //     height: 130px;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     .logo {
    //       width: 30%;
    //       background-size: 100% 100%;
    //     }
    //   }
    //   .warn {
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     width: 90%;
    //     max-width: 217.8px;
    //     // margin: 21.6px auto;
    //     margin: 21.6px auto 0;

    //     background: #ff4d4f;
    //     border-radius: 18.9px;
    //     color: #fff;
    //     font-size: 14.4px;
    //     text-align: center;
    //     height: 28.8px;
    //     line-height: 28.8px;
    //   }
    //   .scan-record {
    //     display: flex;
    //     justify-content: space-around;
    //     margin-top: 18px;
    //     width: 100%;
    //     font-size: 9px;
    //     color: hsla(0, 0%, 100%, 0.65);
    //     letter-spacing: 0;
    //     line-height: 16.2px;
    //     p {
    //       margin-bottom: 0;
    //     }
    //     .title{
    //             font-family: PingFangSC;
    // font-size: 10.8px;
    // height: 12.6px;
    // line-height: 12.6px;
    // color: hsla(0,0%,100%,.65);
    //     }
    //     .value{
    //         margin-top: 4.5px;
    // height: 12.6px;
    // font-family: PingFangSC;
    // font-size: 9px;
    // line-height: 12.6px;
    // color: #fff;
    // display: flex;
    // align-items: center;

    //     }
    //   }
    // }
    .banner {
      width: 100%;
      height: 270px;
      // height: 428px;
      // background: url("../../assets/images/mobile/banner.png") no-repeat;
      // background-size: cover;
      // background-position: center center;
      padding: 50px 0;
      text-align: center;
      .logo {
        width: 120px;
        height: 120px;
      }
      .warn {
        width: 50px;
        height: 57px;
      }
      .warnText {
        font-size: 15px;
        color: #feffff;
      }
    }
  }
  .add-mini-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 392px;
    margin: 0 5px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    cursor: pointer;
    .anticon-plus {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.3);
    }
    span {
      height: 22px;
      margin-top: 11px;
      color: #000;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      opacity: 0.65;
    }
  }
}
</style>
