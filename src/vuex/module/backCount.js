const state ={
	addWoreHouse:[],  //提交补货申请页面数据
	addWoreHouseToAmount:[],  //提交补货申请页面向补货确认页面传的数据
	myaddWroseList:[],//	我的补货单列表数据
	
	selectMergeGoods:[],//库位合并选择页面列表
	mergeAmountGoods:[],//选择完成输入数量页面列表
	
	inventoryList:[],//库位盘点页面列表
	inventoryToConfirm:[],//盘点页面列表
	
	wareHouseList:[]						//	要选择的反配库位列表
};
const mutations ={  //方法：同步事件
	setAddWoreHouse(state,data){
		state.addWoreHouse=data;
	},
	setaddWoreHouseToAmount(state,data){
		state.addWoreHouseToAmount=data;
	},
	setmyaddWroseList(state,data){
		state.myaddWroseList=data;
	},
	setSelectGoods(state,data){
		state.selectMergeGoods=data;
	},
	setmergeAmountGoods(state,data){
		state.mergeAmountGoods=data;
	},
	setinventoryList(state,data){
		state.inventoryList=data;
	},
	setinventoryToConfirm(state,data){
		state.inventoryToConfirm=data;
	},
	setwareHouseList(state,data){
		state.wareHouseList=data;
	}
};
const actions={
	changemyaddWroseList({ commit }, commonInfo){
		commit('setmyaddWroseList', commonInfo)
	},
	
	changeselectMergeGoods({ commit }, commonInfo){
		commit('setSelectGoods', commonInfo)
	},
	changeinventoryList({commit},payload){
		commit('setinventoryList',payload)
	},
	chaninventoryToConfirm({commit},payload){
		commit('setinventoryToConfirm',payload)
	},
	changewareHouseList({commit},payload){
		commit('setwareHouseList',payload)
	},
//	chaninventoryToConfirm({commit},payload){
//		commit('setinventoryToConfirm',payload)
//	},
}
//方法只能通过commit触发：使用时：
//<button @click="$store.commit('setToken')"></button>
export default {
	state,
	mutations,
	actions
};
