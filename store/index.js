export const state = () => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  isActionRunning: false,
})

export const getters = {
  getUser: (state) => state.user,
}
export const mutations = {
  changeActionRunningState(state, status) {
    state.isActionRunning = status
  },
  storeUser(state, user) {
    state.user = user
    user
      ? localStorage.setItem('user', JSON.stringify(user))
      : localStorage.removeItem('user')
  },
  getNewMessage(state) {
    console.log('hello')
    this.$axios.get(`/users/${state.id}/messages/new`).then((response) => {
      console.log('new  =', response.data)
    })
  },
}
