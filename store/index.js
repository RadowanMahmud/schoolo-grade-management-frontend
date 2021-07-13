export const state = () => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  isActionRunning: false,
  messageInterval: null,
  newMessage: null,
  messageCount: 0,
})

export const getters = {
  getUser: (state) => state.user,
  getNewMessages: (state) => state.newMessage,
  getCount: (state) => state.messageCount,
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
    state.newMessage = data
  },
  testFunction(state, data) {
    state.newMessage = [...data]
  },
  setMessageCount(state) {
    this.state.messageCount += 1
  },
  setZero(state) {
    this.state.messageCount = 0
  },
}
