import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import '@/utils/filter'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
// import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import '@/assets/icon/iconfont.css';
import '@/styles/index.less';

import {errCode} from '@/utils/config'
import http from '@/utils/http';
Vue.prototype.$http = http;
Vue.prototype.$errCode = errCode;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
