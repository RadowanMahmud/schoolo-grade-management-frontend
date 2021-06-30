export const state = () => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  isActionRunning: false,
  messageInterval: null,
  newMessage: null,
})

export const getters = {
  getUser: (state) => state.user,
  getNewMessages: (state) => state.newMessage,
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
  addMessage(state, data) {
    console.log('in mut')
    state.newMessage = data
  },
  testFunction(state, data) {
    console.log('data in mutation = ', data)
    state.newMessage = [...data]
  },
}
