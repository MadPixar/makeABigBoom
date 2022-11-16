import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/styles/font.scss'
import '@/styles/index.scss'
import '@/assets/icons'
import '@/permission'
import '@/plugins'
import '@/utils/index'
import '@/utils/directives'
import '@/components'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'font-awesome/css/font-awesome.min.css'
import { infoLinkTypeEnum, infoLinkStatusEnum } from '@/utils/constant'
import foxPreviewImage from 'fox-preview-image'
// 过滤器
import * as filters from '@/modules/zbk/filter/filters'

Vue.use(foxPreviewImage)

Vue.config.productionTip = false
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.Constants = { infoLinkTypeEnum, infoLinkStatusEnum }

Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as any)[key])
})

const remove = (el: Element) => (el.parentNode as Element).removeChild(el)

Vue.directive('auth', {
  inserted: (el: Element, binding: any, vNode: any) => {
    const { $root: vm } = vNode.context
    // 获取当前用户拥有的权限列表（根据自身业务获取）
    const access = vm.$store.state.user.roles
    // 获取传入的权限码value（string or array）和修饰符modifiers
    let { value } = binding
    const { modifiers } = binding
    // 判断条件：当传入的值不是数组或者字符串时，直接隐藏元素
    if (!(typeof value === 'string' || value instanceof Array) || !value) {
      remove(el)
      return console.error('please set the value to a string or array.')
    }

    // 判断条件：如果传入的权限码是string则转化成数组
    if (typeof value === 'string') {
      value = [value]
    }
    /**
     * 判断条件
     *  -修饰符为 every时 value数组只要有一个元素不存在access权限集内，隐藏元素
     *  -修饰符为 some或者没有时，value数组所有元素都不存在access权限集内，隐藏元素
     */
    if (
      (modifiers.every && value.some((v: any) => !access.includes(v))) ||
      (!modifiers.every && value.every((v: any) => !access.includes(v)))
    ) {
      remove(el)
    }
  }
})

// max 为限定的最大值；min 为限定的最小值；precision 为保留的小时位数 precision不传默认为2，0代表整数
// v-limit-number="{max: 10, min: 0,precision:0}"
Vue.directive('limitNumber', {
  inserted: (el, binding, vNode) => {
    // 设置输入框的值,触发input事件,改变v-model绑定的值
    const setVal = (val: any) => {
      if (vNode.componentInstance) {
        // 如果是自定义组件就触发自定义组件的input事件
        vNode.componentInstance.$emit('input', val)
      } else {
        // 如果是原生组件就触发原生组件的input事件
        ;(el as HTMLInputElement).value = val
        el.dispatchEvent(new Event('input'))
      }
    }
    el.addEventListener('keyup', event => {
      // 第一步：转成字符串
      // 第二步：把不是数字，不是小数点的过滤掉
      // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
      // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
      // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到n位小数
      let val: any = '' + (event.target as HTMLInputElement).value
      const retainDecimalReg = new RegExp(`^\\d*(\\.?\\d{0,${binding.value?.precision || 2}})`, 'g')
      if (binding.value?.precision === 0) {
        val = val.replace(/\d/g, '').replace(/^0{1,}/g, '')
      } else {
        val =
          val
            .replace(/[^\d^\\.]+/g, '')
            .replace(/^0+(\d)/, '$1')
            .replace(/^\./, '0.')
            .match(retainDecimalReg)[0] || ''
      }

      setVal(val)
      // -- callback1
      // vNode.data.model.callback = ()=>{
      //     val = val.toFixed(argPrecision)
      // }
      // vNode.data.model.callback();
      // -- callback2
      // vNode.data.model.callback(
      //     val = val.toFixed(argPrecision)
      // )
    })
    el.addEventListener('focusout', event => {
      let val: any = '' + (event.target as HTMLInputElement).value
      let argMax = ''
      let argMin = ''
      if (binding.value?.min || binding.value?.max) {
        // 这里转化成字符串形式 防止当最大或者最小只为0时，判断为false
        argMax = parseFloat(binding.value.max) + ''
        argMin = parseFloat(binding.value.min) + ''

        if (argMax && val > +argMax) {
          val = argMax
        }
        if (argMin && val < +argMin) {
          val = argMin
        }
      }
      setVal(val)
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
