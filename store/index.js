export const state = () => ({
  user: null
})
export const mutations = {
  STORE_USER(state, user) {
    state.user = user
  }
}
export const actions = {
}
export const getters = {
  getUser(state) {
    return state.user
  }
}