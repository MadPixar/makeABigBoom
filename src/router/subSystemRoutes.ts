import Modules from './subSystemLoader'
import { RouteConfig } from 'vue-router'
// import { SubSystemModule } from '@/store/modules/subsystem'
// import SubsystemLayout from '@/Layout/subSystem/subsystemLayout.vue'

const subsystem = {
  isSubsystem: window.location.pathname.startsWith('/sub'),
  symbol: window.location.pathname.split('/')[2]
}

// SubSystemModule.setInfo(subsystem)

let localRoutes: { routes: any[] } = {
  routes: []
}

if (subsystem.isSubsystem) {
  localRoutes = Object.keys(Modules).reduce((obj: any, moduleName: string) => {
    const routes: any = {
      routes: ((Modules as any)[moduleName].routes || [])
        .map((route: RouteConfig & { component: any }) => {
          if (route.redirect) {
            // 表示路由有重定向
            route.redirect = `/${moduleName}${route.redirect}`
            route.children = (route as any).children.map((route: RouteConfig) => {
              route.path = subsystem.isSubsystem
                ? `/sub/${subsystem.symbol}${route.path}`
                : `/${moduleName}${route.path}`
              return route
            })
          }
          try {
            // route.component = SubsystemLayout
          } catch (err) {}
          route.path = subsystem.isSubsystem
            ? `/sub/${subsystem.symbol}${route.path.replace('/subsystem', '')}`
            : `/${moduleName}${route.path}`
          return route
        })
        .concat(obj.routes || [])
    }
    return { ...routes }
  }, {})
}

export default localRoutes
