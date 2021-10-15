<template>
  <div class="home">
    <Header></Header>
    <div class="container">
      <sider-bar @handleCrumd="changeCrumb"></sider-bar>
      <div
        class="main"
        :style="
          sidebar.opened
            ? 'width:calc(100vw - 207px);min-width:1073px;margin-left:207px;'
            : 'width:calc(100vw - 80px);min-width:1200px;margin-left:80px;'
        "
      >
        <bread-crumb class="bread" :crumbList="crumbList"></bread-crumb>
        <section
          class="section"
          :style="
            sidebar.opened
              ? 'width:calc(100vw - 207px);min-width:1073px;'
              : 'width:calc(100vw - 80px);min-width:1200px;'
          "
        >
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import SiderBar from "@/components/SiderBar";
import BreadCrumb from "@/components/BreadCrumb";
import { mapGetters } from "vuex";
export default {
  components: {
    Header,
    SiderBar,
    BreadCrumb,
  },
  data() {
    return {
      crumbList: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  created() {
    this.crumbList = JSON.parse(sessionStorage.getItem("crumbList"));
  },
  methods: {
    changeCrumb(val) {
      if (val.index == undefined) {
        this.crumbList = [val.menu.meta.title];
      } else {
        this.crumbList = [
          val.menu.meta.title,
          val.menu.children[val.index].title,
        ];
      }
      this.$store.dispatch("ToggleCrumb", this.crumbList);
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  min-width: 1280px;
  height: 100%;
  min-height: 100vh;
  .container {
    width: 100%;
    min-width: 1280px;
    padding-top: 46px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .main {
      width: 100%;
      background: #f0f2f5;
      // max-width:calc(100vw - 207px);
      min-width: calc(100vw - 207px);
      height: 100%;
      min-height: calc(100vh - 48px);
      .bread {
        background: #fff;
        height: 58px;
        padding: 0 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .section {
        padding: 30px;
        background: #f0f2f5;
        min-height: calc(100vh - 106px);
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>