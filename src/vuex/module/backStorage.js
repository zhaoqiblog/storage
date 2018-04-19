import $request from '../../service/request.js';
export default {
  state: {
    backLogistics: [], // 补货清单
  },
  mutations: {
    addBackLogistics(state, payload) {
      state.backLogistics.push(payload.data)
    },
    updateBackLogistics(state, payload) {
      state.backLogistics = payload.data
    },
    clearBackLogistics(state, payload) {
      state.backLogistics = []
    }
  },
  actions: {
    addBackLogistics({ commit }, payload) {
      commit({
        type: 'addBackLogistics',
        data: payload.data
      })
    },
    updateBackLogistics({ commit }, payload) {
      commit({
        type: 'updateBackLogistics',
        data: payload.data
      })
    },
    clearBackLogistics({ commit }, payload) {
      commit('clearBackLogistics')
    }
  }
}
