//const turnoverArea = r => require.ensure([], () => r(require('../../template/turnoverArea/index.vue')), 'test')
//const associated = r => require.ensure([], () => r(require('../../template/turnoverArea/associated.vue')), 'test')
import success from "../../components/success.vue"
import fail from "../../components/fail.vue"
import turnoverArea from "../../template/turnoverArea/index.vue"

import associated from "../../template/turnoverArea/associated.vue"   		  // 托盘与库位关联-托盘入库

import goodsToStore from "../../template/turnoverArea/goodsToStore/goodsToStore.vue"   //商品入库 -商品入库确认提交
import goodsAmount from "../../template/turnoverArea/goodsToStore/goodsAmount.vue"   //商品入库 -入库商品数量填写
import selectGoods from "../../template/turnoverArea/goodsToStore/selectGoods.vue"   //商品入库-入库商品选择
import goodsToStoreSuccess from "../../template/turnoverArea/goodsToStore/continue.vue"   //商品入库-入库商品选择




//后场界面
import backCount from "../../template/backCourt/index.vue"  
import addWoreHouse from "../../template/backCourt/woreHouse/addWoreHouse.vue"   		  // 仓库补货-提交补货单
import addRepDetail from "../../template/backCourt/woreHouse/addreplenishmentDetail.vue"   		  // 仓库补货-补货单确认
import replenishmentList from "../../template/backCourt/woreHouse/replenishmentList.vue"   		  // 仓库补货-我的补货单列表
import replenishmentDetail from "../../template/backCourt/woreHouse/replenishmentDetail.vue"   		  // 仓库补货-补货单详情



import inventory from "../../template/backCourt/inventory/inventory.vue"   				//库位盘点
import inventoryResult from "../../template/backCourt/inventory/inventoryResult.vue"   				//库位盘点差异比较页面


import selectMergeGoods from "../../template/backCourt/warehouseMerge/selectMergeGoods.vue"   //库位合并-选择将要合并的商品
import mergeGoodsAmount from "../../template/backCourt/warehouseMerge/mergeGoodsAmount.vue"   //库位合并-输入合并数量
import mergeGoodsConfirm from "../../template/backCourt/warehouseMerge/mergeGoodsConfirm.vue"   //库位合并-输入合并数量

import backMatch from "../../template/backCourt/backMatch/matchInfo.vue"	//后场反配

/*
 *直送界面
 * */

import direct from "../../template/direct/index.vue"

import directOrderInfo from "../../template/direct/receive/orderInfo.vue"  //直送收货订单信息
import receiptList from "../../template/direct/receive/receiptList.vue"  //直送收货添加商品订单信息
import receiptListConfirm from "../../template/direct/receive/receiptListConfirm.vue"  //直送收货添加商品订单信息


import directAddGoods from "../../template/direct/directShelves/addGoods.vue"  //直送上架
import confirmGoods from "../../template/direct/directShelves/confirmGoods.vue"	//直送商品上架确认

import directAddToStore from "../../template/direct/toStore/addGoods.vue" //直送入库添加商品
import directToStoreConfirm from "../../template/direct/toStore/confirmGoods.vue" //直送入库添加商品确认
import placeConfirm from "../../template/direct/toStore/placeConfirm.vue" //直送入库添加商品确认


export default [
//周转区界面
{path:"/turnover", component:turnoverArea,
	keepAlive:true,
	children:[
	//库位合并
        {path:'associated',name:'associated',component:associated},
    //商品入库
        {path:'selectGoods',name:'selectGoods',component:selectGoods},
        {path:'goodsAmount',name:'goodsAmount',component:goodsAmount},
        {path:'goodsToStore',name:'goodsToStore',component:goodsToStore},
        
    ]
},
{path:"/success",component:success,name:"success"},
{path:"/fail",component:fail,name:"fail"},
{path:'/goodsToStoreSuccess',name:'goodsToStoreSuccess',component:goodsToStoreSuccess},
//后场界面
{path:"/backCount", component:backCount,
	children:[
		//仓库补货
        {path:'addWoreHouse',name:"addWoreHouse",component:addWoreHouse}, //提交补货申请
        {path:'addRepDetail',name:"addRepDetail",component:addRepDetail},	//确认补货清单
        {path:'replenishmentList',name:"replenishmentList",component:replenishmentList}, //我的补货单列表
        {path:'replenishmentDetail',name:"replenishmentDetail",component:replenishmentDetail},  //补货单详情页
        //库位盘点
        {path:'inventory',name:"inventory",component:inventory},  //库位盘点
        {path:'inventoryResult',name:"inventoryResult",component:inventoryResult},  //库位盘点
        //库位合并
//      {path:'mergeLocation',name:"mergeLocation",component:mergeLocation},  //库位合并
        {path:'selectMergeGoods',name:"selectMergeGoods",component:selectMergeGoods}, //选择将要合并的商品
        {path:'mergeGoodsAmount',name:"mergeGoodsAmount",component:mergeGoodsAmount}, //合并数量填写
        {path:'mergeGoodsConfirm',name:"mergeGoodsConfirm",component:mergeGoodsConfirm}, //目标库位合并后情况
        
        //后场反配
        {path:'backMatch',name:'backMatch',component:backMatch}  //后场反配
    ]
},
/**
 * 直送
 * */
{path:'/direct',component:direct,
	children:[
//	直送收货
		{path:'directOrderInfo',name:'directOrderInfo',component:directOrderInfo},
		{path:'receiptList',name:'receiptList',component:receiptList},
		{path:'receiptListConfirm',name:'receiptListConfirm',component:receiptListConfirm},
		
	//直送商品上架
		{path:'directAddGoods',name:'directAddGoods',component:directAddGoods},
		{path:'confirmGoods',name:'confirmGoods',component:confirmGoods},
		//直送商品入库
		{path:'directAddToStore',name:'directAddToStore',component:directAddToStore},
		{path:'directToStoreConfirm',name:'directToStoreConfirm',component:directToStoreConfirm},
		{path:'placeConfirm',name:'placeConfirm',component:placeConfirm},
	]
}

]
