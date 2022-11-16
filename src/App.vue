<template>
  <div
    ref="rootRef"
    id="hnup"
    class="theme-defaultVariables fill-height"
    :class="[themeFontSize, theme]"
    style="height:100%"
  >
    <div class="v-gh fill-height" id="app-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide, Ref } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { Login } from './api/login'
import { UserModule } from './store/modules/user'
import { TagsViewModule } from './store/modules/tags-view'
import { resetRouter } from './router'
import { PermissionModule } from './store/modules/permission'
import { getDevelopStatus, setDevelopStatus } from './utils/storage'
import ElementUI from 'element-ui'
import MobileDetect from 'mobile-detect'
import { AppModule } from './store/modules/app'
import { getToken } from '@/utils/tabletUtil'

@Component({
  name: 'App'
})
export default class App extends Vue {
  @Provide() globalAlert = this.globalAlertFn
  @Provide() App = this
  @Provide() appConfig = {
    develop: getDevelopStatus()
  }

  @Ref() rootRef!: any
  private testInfo = { msg: '' }
  private flag = false
  get token() {
    return getToken()
  }
  get themeFontSize() {
    return `theme-${SettingsModule.fontSize}`
  }
  get theme() {
    return `theme-${SettingsModule.theme}`
  }
  @Watch('theme')
  themeChange() {
    // 给全局messageBox添加类名
    ;(ElementUI.MessageBox as any).setDefaults({ customClass: `${this.theme} ${this.themeFontSize}` })
  }
  @Watch('themeFontSize')
  themeFontSizeChange() {
    // 给全局messageBox添加类名
    ;(ElementUI.MessageBox as any).setDefaults({ customClass: `${this.theme} ${this.themeFontSize}` })
  }
  created() {
    this.initDeviceType()
    this.developMode()
    ;(ElementUI.MessageBox as any).setDefaults({ customClass: `${this.theme} ${this.themeFontSize}` })
  }
  /** 刷新提示 */
  beforeunloadHandler(e: any) {
    e = e || window.event
    // 兼容IE8和Firefox 4之前的版本
    if (e) e.returnValue = '系统即将刷新,请确保数据已保存'
    return '系统即将刷新,请确保数据已保存'
  }
  mounted() {
    /** 非开发者模式下刷新回首页 */
    // this.$router.push('/')
    // setTimeout(() => {
    //   TagsViewModule.delAllViews()
    // }, 500)
  }
  goHome() {
    if (this.$route.path !== '/') {
      this.$router.replace('/')
    }
  }
  developMode() {
    ;(window as any).__dev__ = undefined
    const updateDevelop = this.updateDevelop
    Object.defineProperty(window, '__dev__', {
      get: function() {
        return getDevelopStatus()
      },
      set: function(val) {
        if (val === undefined) return
        updateDevelop(val)
      }
    })
  }
  updateDevelop(val: any) {
    this.appConfig.develop = val
    setDevelopStatus(val)
    PermissionModule.GenerateRoutes().then(() => {
      resetRouter(PermissionModule.dynamicRoutes)
      this.$router.push(this.$route as any)
    })
  }
  beforeDestroy() {
    window.removeEventListener('load', this.goHome)
  }
  destroy() {
    window.removeEventListener('beforeunload', this.beforeunloadHandler, false)
  }
  globalAlertFn(loginIp: string, loginDateTime: string) {
    this.$alert(
      `<div class="ws-msg-inline"> <div >您的账号在</div> <div><span style="margin-right:10px;">地点:</span >${loginIp}</div><div><span style="margin-right:10px;">时间:</span>${loginDateTime}</div> <div>已登录,即将退出</div> </div>`,
      '提示',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: () => {
          Login.logOut()
            .then(() => {
              UserModule.LogOut()
              window.location.reload()
            })
            .catch(() => {
              this.$router.push('/login')
            })
        }
      }
    )
  }
  initDeviceType() {
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    const status = mobileDetect.tablet()
    Vue.prototype.$isTablet = status
    AppModule.setIsTablet(Boolean(status))
  }
}
</script>
