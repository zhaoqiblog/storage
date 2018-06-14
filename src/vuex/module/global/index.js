const state = {
  loading: false,
  direction: 'forward',
  user: null,
  commonInfo:{},
  storeInfo:{}
}

const getters = {
  getLoading: state => state.loading,
  getDirection: state => state.direction,
  getUser: state => state.user,
  getCommonInfo: state => state.commonInfo
}

const mutations = {
  // 切换左侧导航的显示状态
  updateLoading (state, loading) {
    state.loading = loading
  },
  updateDirection (state, direction) {
    state.direction = direction
  },
  updateUser (state, user) {
    state.user = user
  },
  updateCommonInfo (state, data) {
   state.commonInfo = {
   	...state.commonInfo,
   	...data,
   }
    
  /*  if(state.commonInfo.stores.length>=0){//梁军改的
    	state.commonInfo = {
    		...state.commonInfo,
    		costName:state.commonInfo.stores[0].storeName,
    		costNumber:state.commonInfo.stores[0].storeCode,
    	}
    }*/
  },
  updatestoreInfo (state, data) {
    state.storeInfo = data
  },

}

const actions = {
  changeLoading: ({ commit }, loading) => {
    commit('updateLoading', loading)
  },
  changeDirection: ({ commit }, direction) => {
    commit('updateDirection', direction)
  },
  changeUser: ({ commit }, user) => {
    commit('updateUser', user)
  },
  changeCommonInfo ({ commit }, commonInfo) {
    commit('updateCommonInfo', commonInfo)
  },
  changetoreInfo ({ commit }, commonInfo) {
    commit('updatestoreInfo', commonInfo)
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
