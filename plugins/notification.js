import Vue from 'vue'
import Notifications from 'vue-notification'

Vue.use(Notifications)
// Vue.component('Notification', Notifications)
export default (context, inject) => {
  const openNotification = function (duration = 3000, type, title, text) {
    this.$notify({
      type,
      title,
      text,
      duration,
    })
  }

  inject('showToast', openNotification)
  context.$showToast = openNotification
}
