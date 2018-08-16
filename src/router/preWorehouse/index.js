import preWorehouse from '../../template/preWorehouse/index.vue'
import preSuccess from '../../template/common/success.vue'

import pickList from '../../template/preWorehouse/picking/pickList.vue'  //前置仓拣货列表
import picking from '../../template/preWorehouse/picking/picking.vue'  //前置仓拣拣货中
//import pickDetail from '../../template/preWorehouse/picking/pickDetail.vue'  //前置仓拣货单详情
import historyPickList from '../../template/preWorehouse/picking/histotyPickList.vue'  //历史拣货单列表 
import historyDetail from '../../template/preWorehouse/picking/historyDetail.vue'  //历史拣货单详情

/**
 * 合并拣货
 */
import concatPickList from '../../template/preWorehouse/concatPicking/concatList.vue'  //前置仓拣货列表
import concatPicking from '../../template/preWorehouse/concatPicking/concatPicking.vue'  //前置仓拣货列表
import conHistoryDetail from '../../template/preWorehouse/concatPicking/historyDetail.vue'  //前置仓拣货列表
import test1 from '../../template/preWorehouse/concatPicking/concatSuccessDetail.vue'  //前置合并拣货成功

import concatPicking1 from '../../template/preWorehouse/concatPicking/concatPicking2.vue'  //前置仓拣货列表
import concatSuccessDetail from '../../template/preWorehouse/concatPicking/test1.vue'  //前置合并拣货成功
/*
 * 设置打印机
 */
import setPrinter from '../../template/preWorehouse/setPrinter/setPrinter.vue'  //前置仓拣货列表
import searchOrder from '../../template/preWorehouse/concatPicking/search.vue'
import searchDetail from '../../template/preWorehouse/concatPicking/searchDetail.vue'

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
 	{path:'/preWorehouse',component:preWorehouse,name:'preWorehouse',meta:{index:2},
 		children:[
 			 {path:'pickList',name:'pickList',component:pickList,meta:{index:2.1}},
 			 {path:'picking',name:'picking',component:picking,meta:{index:2.2}},
// 			 {path:'pickDetail',name:'pickDetail',component:pickDetail},
 			 {path:'historyPickList',name:'historyPickList',component:historyPickList,meta:{index:2.1}},
 			 {path:'historyDetail',name:'historyDetail',component:historyDetail,meta:{index:2.1}},
 			 //前置仓补货
 			 {path:'supplyList',name:'supplyList',component:supplyList,meta:{index:2.1}},
 			 {path:'supplying',name:'supplying',component:supplying,meta:{index:2.1}},
 			 {path:'confirmsupply',name:'confirmsupply',component:confirmsupply,meta:{index:2.1}},
 			 {path:'historySupplyList',name:'historySupplyList',component:historySupplyList,meta:{index:2.1}},
 			 {path:'supHistoryDetail',name:'supHistoryDetail',component:supHistoryDetail,meta:{index:2.1}},
 			 {path:'preSupSuccess',name:'preSupSuccess',component:preSupSuccess,meta:{index:2.1}},
 			 //卖场补货
 			 {path:'shopAdd',name:'shopAdd',component:shopAdd,meta:{index:2.1}},
 			 {path:'confirmShopAdd',name:'confirmShopAdd',component:confirmShopAdd,meta:{index:2.1}},
 			 {path:'shopHistoryList',name:'shopHistoryList',component:shopHistoryList,meta:{index:2.1}}, 
 			 {path:'preShopDetail',name:'preShopDetail',component:preShopDetail,meta:{index:2.1}}, 
 			 //后场补货
 			 {path:'wareHouseAdd',name:'wareHouseAdd',component:wareHouseAdd,meta:{index:2.1}},
 			 {path:'wareHouseConfirm',name:'wareHouseConfirm',component:wareHouseConfirm,meta:{index:2.1}},
 			 //合并拣货
 			 {path:'concatPickList',name:'concatPickList',component:concatPickList,meta:{index:2.1}},
 			 {path:'concatPicking',name:'concatPicking',component:concatPicking,meta:{index:2.1}},
 			 {path:'conHistoryDetail',name:'conHistoryDetail',component:conHistoryDetail,meta:{index:2.1}},
 			 {path:'concatSuccessDetail',name:'concatSuccessDetail',component:concatSuccessDetail,meta:{index:2.1}},
 			 {path:'test',name:'test',component:test1,meta:{index:2.1}},
 			 
 			 {path:'setPrinter',name:'setPrinter',component:setPrinter,meta:{index:2.1}},
 			
 			 {path:'searchOrder',name:'searchOrder',component:searchOrder},
 			 {path:'searchDetail',name:'searchDetail',component: searchDetail},
 			 {path:'concatPicking1',name:'concatPicking1',component:concatPicking1,meta:{index:2.1}},
 			 
 			 
 		]
 	},
 	{path:"/preSuccess",component:preSuccess,name:'preSuccess'},
 ]
