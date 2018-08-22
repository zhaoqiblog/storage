import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from '../vuex/store'
import receivingPort from './receivingPort'
import turnoverPort from './turnoverArea'
import shop from './shop'
import backStorage from './backStorage'
import preWorehouse from './preWorehouse'

import $request from '@/service/request.js'
import $conf from 'configuration'

// 路由懒加载，实为异步加载路由，避免单个app.js体积过大
// const test = r => require.ensure([], () => r(require('@/template/test')), 'test')
const index = r => require.ensure([], () => r(require('@/template/index')), 'index')


Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      component: index,
      meta:{index:0}
    },
    /*{
      path: '/test',
      name: 'test',
      component: test,

    },*/
    {
      path: '/index',
      name: 'index',
      component: index,
      meta:{index:0}
    },
    ...receivingPort,
    ...turnoverPort,
    ...shop,
    ...backStorage,
    ...preWorehouse
  ]
})

sync(store, router)

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
router.beforeEach(function(to, from, next) {
  store.commit('updateLoading', true)
  Vue.$vux.loading.show();


  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function(to) {
  store.commit('updateLoading', false)
  Vue.$vux.loading.hide();
})
export default router
