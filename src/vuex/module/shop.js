import $request from '../../service/request.js';
export default {
  state: {
    supplement: [], // 补货清单
    returnList: [] // 还货清单
  },
  mutations: {
    addSupplement(state, payload) {
      state.supplement.push(payload.data)
    },
    updateSupplement(state, payload) {
      state.supplement = payload.data
    },
    clearSupplement(state, payload) {
      state.supplement = []
    },
    // 还货——添加商品
    addReturn(state, payload) {
      state.returnList.push(payload.data)
    },
    // 还货——商品清单
    updateReturn(state, payload) {
      state.returnList = payload.data
    },
    clearReturn(state) {
      state.returnList = []
    }
  },
  actions: {
    addSupplement({ commit }, payload) {
      commit({
        type: 'addSupplement',
        data: payload.data
      })
    },
    updateSupplement({ commit }, payload) {
      commit({
        type: 'updateSupplement',
        data: payload.data
      })
    },
    clearSupplement({ commit }, payload) {
      commit('clearSupplement')
    },
    // 还货——添加商品
    addReturn({ commit }, payload) {
      commit({
        type: 'addReturn',
        data: payload.data
      })
    },
    // 还货——更新商品清单
    updateReturn({ commit }, payload) {
      commit({
        type: 'updateReturn',
        data: payload.data
      })
    }
  }
}
