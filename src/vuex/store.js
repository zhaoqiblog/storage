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

Vue.use(Vuex)

export default new Vuex.Store({
//state: {
//  userInfo:{}//用户信息
//},
//mutations: {
//},
//actions: {
//  /**
//   * 获取用户信息
//   * @param  {[Object]} options.state [state]
//   */
//  getUser(context){
//    service.getUser().then((res)=>{
//
//      context.state.userInfo = res
//      let type = context.state.userInfo.positionName
//      if(type.match('合伙人')){
//        context.state.userInfo.type = 2
//      }else{
//        context.state.userInfo.type = 1
//      }
//    })
//  }
//},
  modules: {
    global,
    shop,
    backStorage,
    turnoverArea,
    backCount,
    direct
  },
})
