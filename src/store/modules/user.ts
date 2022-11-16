import Vue from 'vue'
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { cookies } from '@/utils'
import router, { resetRouter } from '@/router/index'

import store from '@/store'
import { Login } from '@/api/login'
import { menuCount, UserInfoApi } from '@/api/userInfo'
// import { log } from '@/utils/util'
// import { UserInfoApi } from '@/api/userInfo'
export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[] | null
  email: string
  permissions: any
  userInfo: any
  menuCount: any
  loginExpired: boolean
  useMost: any
}

export interface IMenuCount {
  count: string
  menuId: string
  menuName: string
  userId: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = cookies.getToken() || ''
  public name = 'zhangssan'
  public avatar: any = ''
  public introduction = ''
  public roles: string[] | null = null
  public email = ''
  public permissions = ''
  public userInfo: any = {}
  public menuCount: IMenuCount[] = []
  public userInfoDialog = false
  public loginExpired = false
  public useMost = []
  public originUser = ''
  // 督查用户   省级  市级  县级   武汉局
  public provinceUser = false //省
  public cityUser = false //市
  public countyUser = false //县
  public leaderUser = false //是否处长用户  特殊用户销号
  public wuHanUser = false //武汉
  public AreaCode = '' //用户行政区code

  @Mutation
  private SET_ORIGINUSER(data: any) {
    this.originUser = data
  }

  @Mutation
  private SET_UseMost(data: any) {
    this.useMost = data
  }
  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }
  @Mutation
  public SET_MENU_COUNT(data: any) {
    this.menuCount = data
  }
  @Mutation
  public UPDATE_MENU_COUNT({ menuId, count }: { menuId: string; count: string }) {
    this.menuCount = this.menuCount.map(item => {
      if (item.menuId === menuId) item.count = count
      return item
    })
  }
  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: any) {
    this.avatar = avatar
  }

  @Mutation
  private SET_PERMISSIONS(permissions: any) {
    this.permissions = permissions
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
    this.provinceUser = false
    this.cityUser = false
    this.countyUser = false
    this.leaderUser = false
    this.wuHanUser = false
    roles.forEach((el: string) => {
      if (el === 'province' || el === 'admin') {
        this.provinceUser = true
      }
      if (el === 'city') {
        this.cityUser = true
      }
      if (el === 'district') {
        this.countyUser = true
      }
      if (el === 'Leader' || this.userInfo.deptId === 103) {
        this.leaderUser = true
      }
      if (el === 'WuHan') {
        this.wuHanUser = true
      }
    })
    Vue.prototype.$roles = roles
  }

  @Mutation
  private SET_USER_INFO(userinfo: any) {
    this.userInfo = userinfo
  }
  @Mutation
  private SET_AREA_CODE(AreaCode: any) {
    this.AreaCode = AreaCode
  }

  @Mutation
  private SET_USERINFO(userInfo: any) {
    this.userInfo = userInfo
  }
  @Mutation
  private SET_USERINFO_DIALOG(val: boolean) {
    this.userInfoDialog = val
  }
  @Mutation
  private SET_LOGIN_EXPIRED(val: boolean) {
    this.loginExpired = val
  }

  @Action
  public async Login({ logParams, params }: { logParams: any; params: {} }) {
    const { data } = await Login.login(logParams, params)
    cookies.setToken(data.access_token)
    this.SET_TOKEN(data.access_token)
  }

  @Action
  async authLogin(token: string) {
    cookies.setToken(token)
    this.SET_TOKEN(token)
  }

  @Action
  public ResetToken() {
    cookies.removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    const res = await Login.getInfo()
    // if (!res) {
    //   throw Error('认证失败，请重新登录')
    // }
    this.SET_USERINFO(res.data)
    const { roles, permissions, administrativeCode, unit } = res.data
    const { userName } = res.data.user
    // 获取用户头像
    const { userId }: { userId: string } = { ...res.data.user }
    UserInfoApi.getUserAvatar({ userId }).then(res => {
      const blob = new Blob([res.data])
      const url = (URL || window.webkitURL).createObjectURL(blob)
      const avatar = url ? url : require('../../assets/user-photo.jpg')
      this.SET_AVATAR(avatar)
    })
    this.SET_ROLES(roles)
    this.SET_NAME(userName)
    this.SET_PERMISSIONS(permissions)
    this.SET_USER_INFO(res.data)
    this.SET_AREA_CODE(administrativeCode || unit.administrativeCode)
  }

  @Action
  public getMenuCount() {
    menuCount()
      .then(({ data }) => {
        this.SET_MENU_COUNT(data)
      })
      .catch(() => {})
  }

  @Action
  public LogOut() {
    cookies.removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_PERMISSIONS('')
    resetRouter([])
    if (!this.token) {
      router.replace('/login')
    }
  }
  @Action
  public setUserInfoDialog(val: boolean) {
    this.SET_USERINFO_DIALOG(val)
  }
  @Action
  public setLoginExpired(val: boolean) {
    this.SET_LOGIN_EXPIRED(val)
  }
  @Action
  public setUseMost(data: any) {
    this.SET_UseMost(data)
  }
}

export const UserModule = getModule(User)
