const state ={
	lRemoveGoods:{},   //移动货位，原货位商品
	removeResult:{},   //移动货位成功之后结果数据
}
const mutations={
	setLremoveGoods(state,data){
		state.lRemoveGoods = data
	},
	setRemoveResult(state,data){
		state.removeResult =data;
	},
}
const actions ={
	setLremoveGoods({commit},payload){
		commit("setLremoveGoods",payload)
	},
	setRemoveResult({commit},payload){
		commit("setRemoveResult",payload)
	}
}
export default {
	state,
	mutations,
	actions
};