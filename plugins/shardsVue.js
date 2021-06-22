import Vue from 'vue'
import ShardsVue from 'shards-vue'
// Styles
import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/scss/shards-dashboards.scss'
import '@/assets/scss/date-range.scss'

// Import base styles (Bootstrap and Shards)
import 'shards-ui/dist/css/shards.css'
ShardsVue.install(Vue)

Vue.use(ShardsVue)
