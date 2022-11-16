import router from './router/subsystemRouter'
import { UserModule } from '@/store/modules/user'
import { cookies } from '@/utils'

const symbol = window.location.pathname.split('/')[2]

const init = async () => {
  let flag = 0 //配置一个索引，让请求失败时最多请求3次
  if (UserModule.token) {
    if (UserModule.roles === null || UserModule.token !== cookies.getToken()) {
      try {
        if (flag < 3) {
          /*
            判断Cookies中的token和Store中的token进行比较,看是否一致,不一致时重新获取路由和用户信息,
            该情况主要存在与同一个浏览器登录两个账户的场景下
          */
          if (UserModule.token !== cookies.getToken()) {
            UserModule.SET_TOKEN(cookies.getToken())
          }
          UserModule.getMenuCount()
          await UserModule.GetUserInfo()
          // await PermissionModule.GenerateRoutes(subsystem.symbol)
          // 清空之前注册的路由，重新加载新的路由
          // resetRouter(PermissionModule.dynamicRoutes)
        }
      } catch (err) {
        flag++
        UserModule.ResetToken()
        // next(`/login?redirect=${to.path}`)
        router.replace({ path: `/subsystemLogin/${symbol}`, replace: true })
      }
    } else {
      flag = 0
      router.push({ replace: true })
    }
  } else {
    return router.replace({ path: `/subsystemLogin/${symbol}` })
  }
}

if (symbol) {
  init()
}
