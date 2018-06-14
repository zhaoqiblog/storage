import preWorehouse from '../../template/preWorehouse/index.vue'
import preSuccess from '../../template/common/success.vue'

import pickList from '../../template/preWorehouse/picking/pickList.vue'  //前置仓拣货列表
import picking from '../../template/preWorehouse/picking/picking.vue'  //前置仓拣拣货中
//import pickDetail from '../../template/preWorehouse/picking/pickDetail.vue'  //前置仓拣货单详情
import historyPickList from '../../template/preWorehouse/picking/histotyPickList.vue'  //历史拣货单列表 
import historyDetail from '../../template/preWorehouse/picking/historyDetail.vue'  //历史拣货单详情

/**
 * 前置仓补货
 */
import supplyList from '../../template/preWorehouse/supply/supplyList.vue'		//补货列表
import supplying from '../../template/preWorehouse/supply/supplying.vue'		//提交补货单
import confirmsupply from '../../template/preWorehouse/supply/confirmsupply.vue'	//确认补货单
import historySupplyList from '../../template/preWorehouse/supply/historyList.vue'	//补货历史列表
import supHistoryDetail from '../../template/preWorehouse/supply/supHistoryDetail.vue'	//补货历史详情
import preSupSuccess from '../../template/preWorehouse/supply/success.vue'	//补货历史详情

/*
 * 卖场补货preSupSuccess
 */
import shopAdd from '../../template/preWorehouse/shop/shopsupply.vue'	//卖场补货添加商品
import confirmShopAdd from '../../template/preWorehouse/shop/confirmSupply.vue'	//卖场补货添加商品
import shopHistoryList from '../../template/preWorehouse/shop/historyList.vue'	//卖场补货历史列表
import preShopDetail from '../../template/preWorehouse/shop/detail.vue'	//卖场补货单详情

/**
 * 仓库补货
 */
import wareHouseAdd from '../../template/preWorehouse/backStorage/addGoods.vue'  //库位上商品信息
import wareHouseConfirm from '../../template/preWorehouse/backStorage/confirmGoodsInfo.vue'  //确认商品信息

 export default [
 	{path:'/preWorehouse',component:preWorehouse,name:'preWorehouse',
 		children:[
 			 {path:'pickList',name:'pickList',component:pickList},
 			 {path:'picking',name:'picking',component:picking},
// 			 {path:'pickDetail',name:'pickDetail',component:pickDetail},
 			 {path:'historyPickList',name:'historyPickList',component:historyPickList},
 			 {path:'historyDetail',name:'historyDetail',component:historyDetail},
 			 //前置仓补货
 			 {path:'supplyList',name:'supplyList',component:supplyList},
 			 {path:'supplying',name:'supplying',component:supplying},
 			 {path:'confirmsupply',name:'confirmsupply',component:confirmsupply},
 			 {path:'historySupplyList',name:'historySupplyList',component:historySupplyList},
 			 {path:'supHistoryDetail',name:'supHistoryDetail',component:supHistoryDetail},
 			 {path:'preSupSuccess',name:'preSupSuccess',component:preSupSuccess},
 			 //卖场补货
 			 {path:'shopAdd',name:'shopAdd',component:shopAdd},
 			 {path:'confirmShopAdd',name:'confirmShopAdd',component:confirmShopAdd},
 			 {path:'shopHistoryList',name:'shopHistoryList',component:shopHistoryList}, 
 			 {path:'preShopDetail',name:'preShopDetail',component:preShopDetail}, 
 			 //后场补货
 			 {path:'wareHouseAdd',name:'wareHouseAdd',component:wareHouseAdd},
 			 {path:'wareHouseConfirm',name:'wareHouseConfirm',component:wareHouseConfirm},
 			 
 		]
 	},
 	{path:"/preSuccess",component:preSuccess,name:'preSuccess'},
 ]
