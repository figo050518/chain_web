<template>
  <div class="crumb" :class="{ hello: crumbList[0]=='总览页' && !showCrumb }">
    <div v-if="crumbList[0]=='总览页' && !showCrumb">
      <h2>Hi，欢迎使用众享溯源 SAAS 平台！</h2>
      <p class="intro">
        轻松使用区块链为商品赋能，实现来可追、去可查，提升品牌价值，保障消费者利益。
      </p>
      <a-button
        class="arrow"
        type="primary"
        shape="circle"
        icon="up"
        size="small"
        @click="toggleCrumb"
      />
    </div>
    <div v-else>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(item, index) in crumbList" :key="index">{{
            crumbList[0]=='总览页' ? 'Hi，欢迎使用众享溯源 SAAS 平台！' : item
        }}</a-breadcrumb-item>
      </a-breadcrumb>
      <a-button
      v-show="crumbList[0]=='总览页'"
        class="arrow"
        shape="circle"
        icon="down"
        size="small"
        @click="toggleCrumb"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      // crumbFlag:this.showCrumb
    };
  },
  computed: {
    ...mapGetters(["crumbList", "showCrumb"]),
  },
  methods: {
    ...mapActions({
      ToggleCrumbShow: "ToggleCrumbShow",
    }),
    toggleCrumb() {
      //   this.crumbFlag = !this.crumbFlag;
      this.ToggleCrumbShow(!this.showCrumb);
    },
  },
};
</script>
<style lang="less" scoped>
.home .container .main .bread{
  &.crumb {
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    transition: height 0.3s, margin 0.3s;

    h2 {
      margin: 0 0 4px;
      color: #fff;
      font-weight: 400;
      font-size: 20px;
      line-height: 28px;
    }
    .intro {
      margin-bottom: 0;
      color: hsla(0, 0%, 100%, 0.85);
      font-weight: 300;
      font-size: 14px;
      line-height: 22px;
    }
    .arrow {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }
  &.bread.hello {
    height: 86px;
    display: block;
    background: #247fff;
    color: #fff;
    padding: 16px 24px;
    // background-position: 50% 50%;
    // background-size: cover;
    margin: 24px 24px -14px;
  }
}

</style>