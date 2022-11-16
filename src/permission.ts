import router, { resetRouter } from './router'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import { cookies } from '@/utils'
import qs from 'qs'
import HandleApi from '@/modules/op/api/handle/index'

const whiteList = ['/login', '/logout', '/qrcode', '/qrCode', '/cockpit']
router.beforeEach(async (to: Route, _: Route, next: any) => {
  let flag = 0 //配置一个索引，让请求失败时最多请求3次
  const urlQuery = qs.parse(window.location.search)
  if (to.path === '/myHandle/policiesAndRegulations/index') {
    window.open('http://zrzyt.hunan.gov.cn/ztzl/shce/')
    return
  }
  if (UserModule.token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (UserModule.roles === null || UserModule.token !== cookies.getToken()) {
        try {
          if (flag < 3) {
            /*
              判断Cookies中的token和Store中的token进行比较,看是否一致,不一致时重新获取路由和用户信息,
              该情况主要存在与同一个浏览器登录两个账户的场景下
            */
            if (UserModule.token !== cookies.getToken()) UserModule.SET_TOKEN(cookies.getToken())
            UserModule.getMenuCount()
            await UserModule.GetUserInfo()
            await PermissionModule.GenerateRoutes()
            // 清空之前注册的路由，重新加载新的路由
            resetRouter(PermissionModule.dynamicRoutes)
            if (urlQuery.module && urlQuery.moduleKey) {
              const { module, moduleKey } = urlQuery
              moduleEntry(module, moduleKey)
              return
            }
            next({ ...to })
          }
        } catch (err) {
          flag++
          UserModule.ResetToken()
          // next(`/login?redirect=${to.path}`)
          next({ path: '/login', replace: true })
        }
      } else {
        flag = 0
        next({ replace: true })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (urlQuery?.auth) {
        await UserModule.authLogin(urlQuery.auth)
        await UserModule.GetUserInfo()
        await PermissionModule.GenerateRoutes()
        resetRouter(PermissionModule.dynamicRoutes)
        const { module, moduleKey } = urlQuery
        moduleEntry(module, moduleKey)
        return
      }
      // next(`/login?redirect=${to.path}`)
      next({ path: '/login', replace: true })
    }
  }
})

const moduleEntry = (module: string, moduleKey: string) => {
  switch (module) {
    case 'op':
      entryOP(module, moduleKey)
      break
    case 'project':
      entryProject(module, moduleKey)
      break
  }
}

const entryOP = (module: string, moduleKey: string) => {
  const keyDigNumGather = String(moduleKey)
  HandleApi.getComParams(keyDigNumGather, '1', {}).then(res => {
    router.push({
      path: '/otheriframe',
      query: {
        subParams: JSON.stringify(res.data),
        filesKey: res.data.keyNumGather,
        module
      }
    })
  })
}
const entryProject = (module: string, moduleKey: string) => {
  router.push({
    path: '/otheriframe',
    query: {
      prjNumGather: moduleKey,
      module
    }
  })
}
