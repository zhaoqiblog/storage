const backStorage = () => import ('../../template/backStorage/') // 物流仓库
// 物流返配
const backLogisticsAddList = () => import ('../../template/backStorage/backLogistics/addList.vue') // 物流返配-返配清单
const backLogistics = () => import ('../../template/backStorage/backLogistics/list.vue') // 物流返配-我的返配
const backLogisticsDetail = () => import ('../../template/backStorage/backLogistics/detail.vue') // 物流返配-返配单详情

export default [{
  path: '/backStorage',
  name: 'backStorage',
  component: backStorage,
  children: [{
    path: 'backLogisticsAddList',
    name: 'backLogisticsAddList',
    component: backLogisticsAddList
  }, {
    path: 'backLogistics',
    name: 'backLogistics',
    component: backLogistics
  }, {
    path: 'backLogisticsDetail',
    name: 'backLogisticsDetail',
    component: backLogisticsDetail
  }]
}]
