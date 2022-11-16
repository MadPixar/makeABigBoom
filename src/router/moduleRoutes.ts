import Modules from './loader'
import { RouteConfig } from 'vue-router'
export default Object.keys(Modules).reduce((obj: any, moduleName: string) => {
  const routes: any = {
    routes: ((Modules as any)[moduleName].routes || [])
      .map((route: RouteConfig) => {
        if (route.redirect) {
          // 表示路由有重定向
          route.redirect = `/${moduleName}${route.redirect}`
          route.children = (route as any).children.map((route: RouteConfig) => {
            route.path = `/${moduleName}${route.path}`
            return route
          })
        }
        route.path = route.path.includes(moduleName) ? route.path : `/${moduleName}${route.path}`
        return route
      })
      .concat(obj.routes || [])
  }
  return { ...routes }
}, {})
