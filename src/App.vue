<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view/>
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
}
</script>

<style lang="less">
#app {
  font-family: AlibabaSans Avenir, Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width:100vw;
  min-width:1280px;
}
html,body,p,ul,li{
  padding:0 ;
  margin:0 ;
}

ul,li{
  list-style: none;
}
</style>
