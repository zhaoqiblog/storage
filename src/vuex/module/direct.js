const state ={
	directConfirmList:[],  //直送上架确认页列表数据
	
	directToStoreAdd:[],	//直送入库也数据
	directToStoreList:[],  //直送入库确认页列表数据
	
	directReceiveShowList:[], //直送收货订单信息页面数据
	directReceiveAddGoods:[],	//直送收货添加商品页数据
	directReceiveConfirm:[],	// 直送收货确认清单页数据
	
};
const mutations ={  //方法：同步事件
	setdirectConfirmList(state,data){
		state.directConfirmList=data;
	},
	setdirectToStoreAdd(state,data){
		state.directToStoreAdd=data;
	},
	setdirectToStoreList(state,data){
		state.directToStoreList=data;
	},
	setReceiveAddGoods(state,data){
		state.directReceiveAddGoods=data;
	},
	setdirectReceiveConfirm(state,data){
		state.directReceiveConfirm=data;
	},
	setdirectReceiveShowList(state,data){
		state.directReceiveShowList=data
	}
};
const actions={
	updatedirectReceiveShowList({ commit }, payload){
		 commit("setdirectReceiveShowList",payload)
	}
}
//方法只能通过commit触发：使用时：
//<button @click="$store.commit('setToken')"></button>
export default {
	state,
	mutations,
	actions
};
