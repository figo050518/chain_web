import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/modules/app'
import user from '@/store/modules/user'
import getters from '@/store/getters'
import record from "@/store/modules/record"
import config from "@/store/modules/config"
import overview from "@/store/modules/overview"


Vue.use(Vuex);

const store = new Vuex.Store({
  modules:{
    app,
    user,
    record,
    config,
    overview
  },
  getters
})

export default store
