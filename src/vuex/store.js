import Vue from 'vue'
import Vuex from 'vuex'
import global from './module/global'
import request from '../service/request'
//import service from '../service'
import factory from '../factory'

import shop from './module/shop.js'
import backStorage from './module/backStorage.js'
import turnoverArea from './module/turnoverArea.js'
import backCount from './module/backCount.js'
import direct from './module/direct.js'
import prePick from './module/prePick.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    shop,
    backStorage,
    turnoverArea,
    backCount,
    direct,
    prePick
  },
})
