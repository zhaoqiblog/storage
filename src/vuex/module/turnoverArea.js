const state ={
	goodsToStore:{
	 //入库商品选择
		receiveGoodsId:'',
		selectData:[],
		amountDatas:[],
		confirmDatas:[],
	},
	goodsToMallSeleData:{},  //商品上架到确认上架商品清单页面的列表
	shopId:[],//商品上架选择的小店
};
const mutations ={  //方法：同步事件
	setSelectGoods(state,data){
		state.goodsToStore.selectData=data
	},
	setreceiveGoodsId(state,data){
		state.goodsToStore.receiveGoodsId=data
	},
	setamountDatas(state,data){
		state.goodsToStore.amountDatas=data
	},
	setconfirmDatas(state,data){
		state.goodsToStore.confirmDatas=data
	},
	setinnerStealList(state,data){
		state.innerStealList=data
	},
	setgoodsToMallSeleData(state,data){
		state.goodsToMallSeleData=data
	},
	setshopId(state,data){
		state.shopId=data
	}
};
const actions ={  //方法：允许异步操作   //调用时： this.$store.dispatch({type: 'getinnerStealList'	});

}
//方法只能通过commit触发：使用时：
//<button @click="$store.commit('setToken')"></button>
export default {
	state,
	mutations,
	actions
};
