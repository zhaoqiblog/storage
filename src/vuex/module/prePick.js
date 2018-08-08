const state ={
	preSupplyInfo:{},  //前置仓补货页数据
	preSupplyConfirm:{},  //前置仓补货确认页数据
	shopSupplyList:[], //卖场补货值前置仓数据
	confirmShopList:[], //卖场补货确认页列表数据
	backSupplyList:[], //后场补货至前置仓，选择商品页数据
	backConfirmList:[], //后场补货至前置仓，确认页数据
	searchList:{},  //搜索界面数据
};
const mutations ={  //方法：同步事件
	setPreSupplyInfo(state,data){
		state.preSupplyInfo=data;
	},
	setPreSupplyConfirm(state,data){
		state.preSupplyConfirm = data;
	},
	//设置列表数据
	setShopSupplyList(state,data){
		state.shopSupplyList=data;
	},
	//更新列表
	addShopSupplyList(state,data){
		state.shopSupplyList.push(data)
	},
	
	updatePreSupplyInfo(state,data){
		const lastDatas=state.preSupplyInfo
		state.preSupplyInfo=Object.assign(lastDatas,data)
	},
	setConfirmShopList(state,data){
		state.confirmShopList=data;
	},
	setBackSupplyList(state,data){
		state.backSupplyList=data;
	},
	setBackConfirmList(state,data){
		state.backConfirmList=data;
	},
	setSearchList(state,data){
		state.searchList=data
	}
};
const actions={
	setPreSupplyInfo({ commit }, payload){
		 commit("setPreSupplyInfo",payload)
	},
	setPreSupplyConfirm({commit},payload){
		commit("setPreSupplyConfirm",payload)
	},
	setShopSupplyList({commit},payload){
		commit("setShopSupplyList",payload)
	},
	addShopSupplyList({commit},payload){
		commit("addShopSupplyList",payload)
	},
	setConfirmShopList({commit},data){
		commit("setConfirmShopList",data)
	},
	setBackSupplyList({commit},data){
		commit("setBackSupplyList",data)
	},
	setBackConfirmList({commit},data){
		commit("setBackConfirmList",data)
	},
	setSearchList({commit},data){
		commit("setSearchList",data)
	}
}
//方法只能通过commit触发：使用时：
//<button @click="$store.commit('setToken')"></button>
export default {
	state,
	mutations,
	actions
};
