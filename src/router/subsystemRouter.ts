import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import loader from './subSystemRoutes'
import Layout from '@/Layout/subSystem/subsystemLayout.vue'
import SubLayout from '@/Layout/subLayout.vue'
import redictComponent from '@/views/redirect/index.vue'
import SubSystemLogin from '@/views/login/subSystemLogin.vue'
import dashboard from '@/views/dashboard/index.vue'
import Collect from '@/modules/xingzheng/office/views/collect/index.vue'
import Search from '@/views/search/index.vue'
import Profile from '@/views/profile/index.vue'
import SettingUser from '@/views/setting/user/index.vue'
import { SubSystemModule } from '@/store/modules/subsystem'
Vue.use(VueRouter)

const { subsystem } = SubSystemModule

export let routes: RouteConfig[] = [
  {
    path: '/subsystemLogin/:symbol',
    component: SubSystemLogin,
    name: '子系统登录'
  },
  // 首页重定向
  {
    path: '/sub/:symbol',
    component: Layout,
    name: '子系统',
    meta: {
      icon: 'icc_qiye',
      alwaysShow: false // 本地配置的路由，需要有该属性，当其值为ture时就会展现再Sidebar中，否则便不能
    }
  },
  // 新版首页-不展示在左侧边栏菜单中
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        component: dashboard,
        name: '新首页'
      }
    ]
  },
  // 路由重定向
  {
    path: '/',
    component: Layout,
    redirect: `/sub/${subsystem.symbol}`,
    meta: {
      alwaysShow: false
    },
    children: [
      {
        path: 'redirect',
        component: SubLayout,
        children: [
          {
            path: '/redirect/:path*',
            component: redictComponent
          }
        ]
      }
    ]
  },
  // 不展示在左侧边栏菜单中
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'collect',
        component: Collect,
        name: '我的收藏'
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'search',
        component: Search,
        name: '智能搜索'
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'profile',
        component: Profile,
        name: '个人中心'
      },
      {
        path: 'setting/user',
        component: SettingUser,
        name: '个人设置'
      }
    ]
  }
]

routes = routes.concat(loader.routes)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export function resetRouter(dynaRoutes: RouteConfig[]) {
  const newRouter = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
  ;(router as any).matcher = (newRouter as any).matcher // reset router
  router.addRoutes(dynaRoutes)
}
// 修复路由返回一个promise没有catch接收而报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
export default router
