import Vue from 'vue'
import { toolsFunc } from '@/utils/tools'
import { globalProps, deleteTipText } from '@/utils/globalprops'
export { cookies } from './cookies'
export { request, request_noLoading, pdf_preview_request } from './request'

Vue.prototype.$globalProps = globalProps
Vue.prototype.$toolsFunc = toolsFunc
Vue.prototype.$openLoading = toolsFunc.openLoading
Vue.prototype.$closeLoading = toolsFunc.closeLoading
Vue.prototype.$deleteTipText = deleteTipText
