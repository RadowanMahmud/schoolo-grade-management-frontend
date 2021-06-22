export default function ({ $axios, $router, store }) {
  $axios.onRequest((config) => {
    if (store.getters.getUser) {
      config.headers.common.Authorization = 'Bearer ' + store.state.user.token
      store.commit('changeActionRunningState', true)
    }
  })

  $axios.onResponse((r) => {
    store.commit('changeActionRunningState', false)
  })

  $axios.onError((error) => {
    store.commit('changeActionRunningState', false)
    if (error.response.status === 403 || error.response.status === 401) {
      store.commit('storeUser', null)
      $router.push({ name: 'login' })
    }
  })
}
