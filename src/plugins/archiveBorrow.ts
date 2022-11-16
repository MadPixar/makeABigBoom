import Vue, { Component, PropOptions } from 'vue'
import borrowDia from '@/modules/xingzheng/archive/views/manage/catalog/components/borrowDia.vue'
let comp: any = null
// Component - 组件配置对象
// props - 传递给它的属性
function create(Component: Component, props: PropOptions) {
  // if (comp) {
  //   debugger
  //   comp.hide()
  // }
  // 1.构建Component的实例
  const vm = new Vue({
    render(h) {
      // h是createElement
      // 它可以返回一个vnode
      return h(Component, { props })
    }
  }).$mount() // 不设置挂载目标，依然可以转换vnode为真实节点$el
  // 2.把 Vue 实例关联的DOM 元素挂载到 body 上
  document.body.appendChild(vm.$el)

  // 3.获取组件实例
  comp = vm.$children[0] as any
  comp.hide = () => {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }

  return comp
}
Vue.prototype.$borrow = function(options: any = { ref: 'borrowDia' }) {
  return create(borrowDia, options)
}
