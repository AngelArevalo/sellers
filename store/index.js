export const state = () => ({
  user: null
})
export const mutations = {
  STORE_USER(state, user) {
    state.user = user
  }
}
export const actions = {
  storeUser({commit}, user) {
    commit('STORE_USER', user)
  }
}
export const getters = {
  getUser(state) {
    return state.user
  }
}