/**
 *  @desc 整个app的设置信息
 */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
export enum DeviceType {
  Mobile,
  Desktop
}
export interface IAppState {
  device: DeviceType
  sidebar: {
    mini: boolean
  }
  loginDailog: boolean
  loading: boolean // 是否开启loading效果
  loadingText: string
  closeOnClick: boolean // 点击菜单时是否隐藏二级菜单
  collapse: boolean // sidebar是否最小化
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public test = false
  public device = DeviceType.Desktop
  public sidebar = {
    mini: true
  }
  public loginDailog = true
  public loading = false
  public loadingText = '加载中...'
  public closeOnClick = true
  public collapse = true
  public isTablet = false
  @Mutation
  private SET_SIDEBAR(opened: boolean) {
    this.sidebar.mini = opened
  }

  @Mutation
  private SET_LOADING({ loading, text }: { loading: boolean; text?: string }) {
    this.loading = loading
    text && (this.loadingText = text)
  }
  @Mutation
  private SET_LOGIN_DAILOGIN(dailog: boolean) {
    this.loginDailog = dailog
  }

  @Mutation
  private SET_CLOSE_ON_CLICK(closeOnClick: boolean) {
    this.closeOnClick = closeOnClick
  }

  @Mutation
  private SET_MINI_SIDEBAR(collapse: boolean) {
    this.collapse = collapse
  }
  @Mutation
  private SET_IS_TABLET(status: boolean) {
    this.isTablet = status
  }
  @Action
  public setSidebar(opened: boolean) {
    this.SET_SIDEBAR(opened)
  }
  @Action
  public setLoginDailog(dailog: boolean) {
    this.SET_LOGIN_DAILOGIN(dailog)
  }
  @Action
  /**
   * 控制全局loadi效果的开关
   */
  public setLoading(loadParam: { loading: boolean; text?: string }) {
    this.SET_LOADING(loadParam)
  }

  @Action
  public setCloseOnClick(closeOnClick: boolean) {
    this.SET_CLOSE_ON_CLICK(closeOnClick)
  }
  @Action
  public setMinSidebar(collapse: boolean) {
    this.SET_MINI_SIDEBAR(collapse)
  }
  @Action
  public setIsTablet(collapse: boolean) {
    this.SET_IS_TABLET(collapse)
  }
}

export const AppModule = getModule(App)
