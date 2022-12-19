import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

import App from './App'
import store from './store'
import Routers from './router'
import Util from 'common/js/setTitle'
import 'common/scss/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import AxiosPlugin from 'common/js/Axios'
import moment from "moment" ;



Vue.use(AxiosPlugin)
Vue.use(ElementUI)
Vue.use(VueRouter)


Vue.filter('dateFormat', (data) => {
  // 日期处理函数 - moment
  if (data !== '' && data !== null && data !== undefined) {
    return moment(data).format('YYYY-MM-DD')
  }else {
    return data
  }
})

// route config
const router = new VueRouter({
  routes: Routers
})
router.beforeEach((to, from, next) => {
  Util.title(to.meta.title)
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


