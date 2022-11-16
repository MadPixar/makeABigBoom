import IcMapUI from 'ic-map-ui'
import Vue from 'vue'
import Download from './download'
import './permission'
import ElementUI, { DatePicker, TimePicker, Dialog, Tooltip, Upload } from 'element-ui'
import uploader from 'vue-simple-uploader'
import VueRx from 'vue-rx'
import Rx from 'rxjs/Rx'
import treeselect from '@riophae/vue-treeselect' //引入全局树
import UserTree from '@/components/UserTree/index.vue' //引入全局人员树
import IconTree from '@/components/IconTree/index.vue' //人员树加图标
import '@riophae/vue-treeselect/dist/vue-treeselect.css' // 引入树样式
import Message from '@/utils/message'
import Cookies from 'js-cookie'
// import './socket.ts'
import { bus, log, format, chunkFile, isVisitedPage } from '@/utils/util'
import BtnGroup from '@/components/BtnGroup/index.vue'
import './toast'
import '@/utils/loading'
import '@/utils/publicFun'
import '@/plugins/archiveBorrow'
import throttle from 'lodash.throttle'
import 'ic-map-ui/lib/ic-map-ui.css'
import { TagsViewModule } from '@/store/modules/tags-view'
import '@/plugins/tree/virtual-tree.css'
const { FlowEditorVue } = require('../../public/flow-editor') // 无需编写声明文件
const VirtualTree = require('@/plugins/tree/virtual-tree.umd.min.js').default

// 关闭当前tagsView,跳转到前一tagsView
// 页面使用方式： this.$closeTab(this)
Vue.prototype.$closeTab = function(view: any) {
  TagsViewModule.delView(view.$route)
  const stroagedVisitedViews = TagsViewModule.visitedViews
  const latestView = stroagedVisitedViews.slice(-1)[0]
  // if (latestView) return latestView
  if (latestView?.path) {
    view.$router.push({ path: latestView.path, query: latestView.query })
  }
}
// import VConsole from 'vconsole';
// if(process.env.NODE_ENV === 'development') new VConsole();
const { FormGenerate } = require('../../public/FormMaking') // 无需编写声明文件
const formatMap: { [propName: string]: string } = {
  date: 'yyyy-MM-dd',
  datetime: 'yyyy-MM-dd HH:mm'
}
;(Dialog as any).props.lockScroll = { default: () => false }
;(ElementUI.Tooltip as any).props.effect.default = 'dark' //dark|light
;(DatePicker as any).props.format = {
  default: function() {
    return formatMap[this.$options.propsData.type]
  }
}
;(TimePicker as any).props.format = { default: () => 'HH:mm' }
;(Tooltip as any).props.openDelay.default = 300

Vue.prototype.$opener = function(moduleName: string, ...args: any[]) {
  if (moduleName) {
    bus.$emit(moduleName, ...args)
  } else {
    log(`moduleName 为空`)
  }
}

// vue-treeselect搜索节流
const originFunction = treeselect.mixins[0].methods.handleLocalSearch
treeselect.mixins[0].methods.handleLocalSearch = throttle(originFunction, 800)

// 全局控制Dialog弹窗点击遮罩层是否关闭弹窗
;(ElementUI.Dialog as any).props.closeOnClickModal = false

// 全局控制$confirm确认弹窗点击遮罩层是否关闭弹窗
;(ElementUI.MessageBox as any).setDefaults({ closeOnClickModal: false })

Vue.use(Download)
Vue.use(ElementUI, { size: Cookies.get('size') === undefined ? 'small' : Cookies.get('size') })
Vue.use(ElementUI)
Vue.use(uploader)
Vue.use(VirtualTree)
Vue.use(VueRx, Rx)
Vue.use(IcMapUI)
Vue.component('venus-tree', treeselect)
Vue.component('IconTree', IconTree)
Vue.component('UserTree', UserTree)
Vue.component('BtnGroup', BtnGroup)
Vue.prototype.$message = Message
Vue.prototype.$format = format
Vue.prototype.$upload = (options: any) => new uploader(options)
Vue.prototype.$chunkFile = chunkFile
Vue.prototype.$isVisitedPage = isVisitedPage
Vue.use(FormGenerate)
Vue.use(FlowEditorVue)
