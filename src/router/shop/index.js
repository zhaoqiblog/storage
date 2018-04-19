const shop = () => import ('../../template/shop/') // 卖场补货
// 卖场补货
const addProduct = () => import ('../../template/shop/supply/addProduct.vue') // 卖场补货-添加商品
const addProductList = () => import ('../../template/shop/supply/addProductList.vue') // 卖场补货-补货清单
const supply = () => import ('../../template/shop/supply/supply.vue') // 卖场补货-我的补货
const supplyDetail = () => import ('../../template/shop/supply/supplyDetail.vue') // 卖场补货-补货单详情
// 卖场返配
const backorderList = () => import ('../../template/shop/backorder/addProductList.vue') // 卖场返配-商品清单
const backorder = () => import ('../../template/shop/backorder/backorder.vue') // 卖场返配-我的返配
const backorderDetail = () => import ('../../template/shop/backorder/backorderDetail.vue') // 卖场返配-返配详情
// 卖场还货
const shopReturnAdd = () => import ('../../template/shop/returnToWarehouse/addProduct.vue') // 卖场还货-添加商品
const shopReturnAddList = () => import ('../../template/shop/returnToWarehouse/addProductList.vue') // 卖场还货-商品清单
const shopReturnList = () => import ('../../template/shop/returnToWarehouse/list.vue') // 卖场还货-我的还货
const shopReturnDetail = () => import ('../../template/shop/returnToWarehouse/detail.vue') // 卖场还货-还货详情

export default [{
  path: '/shop',
  name: 'shop',
  component: shop,
  children: [{
    path: 'addProduct',
    name: 'addProduct',
    component: addProduct
  }, {
    path: 'addProductList',
    name: 'addProductList',
    component: addProductList
  }, {
    path: 'supply',
    name: 'supply',
    component: supply
  }, {
    path: 'supplyDetail',
    name: 'supplyDetail',
    component: supplyDetail
  }, {
    path: 'backorderList',
    name: 'backorderList',
    component: backorderList
  }, {
    path: 'backorder',
    name: 'backorder',
    component: backorder
  }, {
    path: 'backorderDetail',
    name: 'backorderDetail',
    component: backorderDetail
  }, {
    path: 'shopReturnAdd',
    name: 'shopReturnAdd',
    component: shopReturnAdd
  }, {
    path: 'shopReturnAddList',
    name: 'shopReturnAddList',
    component: shopReturnAddList
  }, {
    path: 'shopReturnList',
    name: 'shopReturnList',
    component: shopReturnList
  }, {
    path: 'shopReturnDetail',
    name: 'shopReturnDetail',
    component: shopReturnDetail
  }]
}]
