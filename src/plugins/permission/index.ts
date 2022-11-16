import Vue from 'vue'
import { UserModule } from '@/store/modules/user'
// v-permission: 功能权限指令
Vue.directive('permission', {
  inserted(el, binding, vnode, oldVnode) {
    const { value } = binding
    const limits = UserModule.userInfo && UserModule.userInfo.permissions
    if (value) {
      const permissionRoles = value
      const hasPermission = limits.some((limit: any) => {
        return permissionRoles == limit
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need limits! Like v-permission="'test'"`)
    }
  }
})
