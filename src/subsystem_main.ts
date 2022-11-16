import Vue from 'vue'
import SubApp from '@/SubApp.vue'
import router from '@/router/subsystemRouter'
import store from '@/store'
import '@/styles/index.scss'
import '@/assets/icons'
import '@/permission_subsystem'
import '@/plugins'
import '@/utils/index'
import '@/utils/directives'
import '@/components'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'font-awesome/css/font-awesome.min.css'
import { infoLinkTypeEnum, infoLinkStatusEnum } from '@/utils/constant'

Vue.config.productionTip = false
Vue.prototype.Constants = { infoLinkTypeEnum, infoLinkStatusEnum }

new Vue({
  router,
  store,
  render: h => h(SubApp)
}).$mount('#sub')
