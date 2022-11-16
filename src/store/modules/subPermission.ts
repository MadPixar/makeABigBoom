const modules = require.context('../../modules/', true, /\.vue$/)
const cache: any = {}
function importAll(r: any) {
  r.keys().forEach((key: any) => (cache[key] = r(key)))
}
importAll(modules)
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
// import { routes } from '@/router/index' // 本地配置的常态路由数据
import router, { routes as subRoutes } from '@/router/subsystemRouter'
import store from '@/store'
import { Login } from '@/api/login'
import { defaultApi } from '@/api/default'
import { cookies } from '@/utils'
import { SubSystemModule } from '@/store/modules/subsystem'
import SubsystemLayout from '@/Layout/subSystem/subsystemLayout.vue'
import SubLayout from '@/Layout/subLayout.vue'
import cloneDeep from 'lodash.clonedeep'

const { subsystemInfo } = SubSystemModule

export const filterAsyncRoutes = (
  routes: (RouteConfig & { component: any; children?: any; fullPath: any })[],
  isModule: boolean,
  moduleName: string,
  subLeave: boolean
) => {
  return routes.filter(route => {
    if (isModule) {
      // 需判断是不是子模块
      moduleName = ''
      moduleName = route.path
    }
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        if (subLeave) {
          // 表示非一级目录
          route.component = SubLayout
        } else {
          route.component = SubsystemLayout
        }
      } else {
        route.component = loadView(route.component, moduleName, route.fullPath === 0)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children, false, moduleName, true)
    }
    return true
  })
}

export const loadView = (view: any, moduleName: string, full: boolean) => {
  // 路由懒加载
  moduleName = moduleName.replace(subsystemInfo.symbol, '')
  try {
    if (moduleName.length > 1) {
      // 加载子模块
      moduleName = moduleName.slice(1)
      let key: any
      if (moduleName === 'office') {
        key = `xingzheng/${view}.vue`
      } else {
        const systemName = view.split('/')[0]
        const componentName = view.replace(systemName, '')
        if (full) {
          key = `${view}.vue`
        } else {
          key = `subsystem/${systemName}/views${componentName}.vue`
        }
      }
      const arr = Object.keys(cache)
      const chooseKey = arr.find(item => item.includes(key))
      if (chooseKey) {
        return cache[chooseKey].default
      }
    } else {
      // 加载主模块
      return () => import(`@/views/${view}.vue`)
    }
  } catch {}
}

// 定义一个方法，用来筛选符需要展现在Sidebar中的路由
export const filterRoute = (routes: RouteConfig[]) => {
  if (routes) {
    return routes.filter(route => route.meta?.alwaysShow)
  } else {
    return []
  }
}

// 定义一个方法，用来拼接组件的路由
export const compoundPath = (routes: RouteConfig[]) => {
  routes = routes.map(route => {
    if (route.children && route.children.length > 0) {
      const parentPath = route.path === '/' ? '' : route.path
      route.children = [
        ...route.children.map(childRoute => {
          childRoute.path = parentPath + '/' + childRoute.path
          childRoute.path = childRoute.path.replace(/(\/\/)/g, '/')
          if (childRoute.children && childRoute.children.length > 0) {
            const childPath = childRoute.path
            childRoute.children.map(subChild => {
              subChild.path = childPath + '/' + subChild.path
              subChild.path = subChild.path.replace(/(\/\/)/g, '/')
              subChild.path = subChild.path.replace(/\/guide\/guide/g, '/guide')
              return subChild
            })
          }
          return childRoute
        })
      ]
    }
    return route
  })
  return routes
}
// 定义一个方法，用来处理引用类型的浅拷贝问题
export const checkedType = (target: any) => {
  return Object.prototype.toString.call(target).slice(8, -1)
}
export const clone = (target: any): any => {
  const copyed = new WeakMap()
  const targetType = checkedType(target)
  let result = null
  if (copyed.has(target)) {
    return target
  }
  switch (targetType) {
    case 'Object': {
      result = {}
      copyed.set(target, target)
      for (const [key, value] of Object.entries(target)) {
        ;(result as any)[key] = clone(value)
      }
      break
    }
    case 'Array': {
      result = []
      copyed.set(target, target)
      for (const item of target) {
        result.push(clone(item))
      }
      break
    }
    default: {
      result = target
    }
  }
  return result
}
export interface IPermissionState {
  dynamicRoutes: RouteConfig[]
  sidebarRoutes: RouteConfig[]
}
const developModeRoute = ['/demo']

@Module({ dynamic: true, store, name: 'subpermission' })
class SubPermission extends VuexModule implements IPermissionState {
  public dynamicRoutes: RouteConfig[] = []
  public dynamicRoutesOrigin: RouteConfig[] = []
  // public sidebarRoutes: RouteConfig[] = compoundPath(filterRoute(routes))
  public sidebarRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(route: any) {
    const { asyRoute } = route
    this.dynamicRoutes = asyRoute
    let dealDynaMicRoutes = cloneDeep(asyRoute)
    dealDynaMicRoutes = compoundPath(dealDynaMicRoutes)
    const localRoutes = compoundPath(filterRoute(subRoutes))
    const noRepeatLocalData = localRoutes.filter((item: any) => {
      if (developModeRoute.includes(item.path)) {
        return (window as any).__dev__ === true
      } else {
        return !dealDynaMicRoutes.map((it: any) => it.path).includes(item.path)
      }
    })
    // 线上
    if (noRepeatLocalData.length > 0) {
      this.sidebarRoutes = dealDynaMicRoutes.concat(noRepeatLocalData)
    } else {
      this.sidebarRoutes = dealDynaMicRoutes
    }
  }
  @Mutation
  private CONCAT_ROUTE(data: any) {
    const { customRoute, fastEntry } = data
    customRoute.forEach((item: any) => {
      let moduleName = '/'
      if (item.path) {
        moduleName = '/' + item.path.split('/')[0]
        item.path = item.path.startsWith('/') ? item.path : '/' + item.path
      }
      item.component = loadView(item.component, moduleName, false)
    })
    this.sidebarRoutes.forEach((item: any) => {
      if (item.name === '首页') {
        //自定义面板路由
        if (customRoute?.length > 0) {
          item.children.splice(1, 1, {
            path: '',
            redirect: null,
            name: '自定义',
            meta: {
              icon: 'icl-guide'
            },
            component: SubLayout,
            children: customRoute
          })
        } else {
          item.children.splice(1, 1)
        }
        //快捷发起
        if (fastEntry?.length > 0) {
          item.children.splice(2, 1, {
            path: '',
            name: '快捷发起',
            meta: {
              icon: 'icl-guide'
            },
            component: SubLayout,
            children: fastEntry
          })
        } else {
          item.children.splice(2, 1)
        }
      }
    })
  }
  @Mutation
  private SET_ORIGIN_ROUTE(data: any) {
    this.dynamicRoutesOrigin = data
  }
  @Action
  public async setCustomRoutes(data: any) {
    let res1: any = { data: [] }
    try {
      res1 = await defaultApi.getCustomRoutes()
    } catch (error) {}
    this.CONCAT_ROUTE({ customRoute: res1.data, fastEntry: data })
  }
  @Action
  public async GenerateSubRoutes(symbol: string) {
    if (!cookies.getToken()) {
      router.replace(`/subsystemLogin/${symbol}`)
      throw Error('获取token失败')
    }
    const res = await Login.getRouters({ symbol })
    const { data } = res || []
    this.SET_ORIGIN_ROUTE(cloneDeep(data))
    if (!data) {
      throw Error('认证失败，请重新登录')
    }
    const moduleName = ''
    // 暂时去掉第一个系统管理路由，为维护系统, 临时处理
    data.map((item: any) => {
      if (item.path === undefined || item.path === null || item.path === '/null' || item.path === 'null')
        item.path = '/'
      if (!item.path.includes('/')) item.path = '/' + item.path
      item.path = item.path.includes(`/sub/${subsystemInfo.symbol}`)
        ? item.path
        : `/sub/${subsystemInfo.symbol}${item.path}`
    })
    const asycRoutes: RouteConfig[] = [...filterAsyncRoutes(data, true, moduleName, false)]
    this.SET_ROUTES({ asyRoute: asycRoutes })
  }
}

export const SubPermissionModule = getModule(SubPermission)
