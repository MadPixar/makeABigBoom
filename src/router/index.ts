import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import loader from './moduleRoutes'
import Login from '@/views/login/index.vue'
import Cockpit from '@/views/cockpit/index.vue'
import PlanCabin from '@/views/cockpit/subdivision/planCabin.vue'
import LandCabin from '@/views/cockpit/subdivision/landCabin.vue'
import OtherIframe from '@/views/otherIframe/index.vue'
// import Dashboard from '@/views/dashboard/index1.vue'
// import dashboard from '@/views/dashboard/index1.vue'
import Dashboard from '@/views/workbench/index.vue'
import ToSee from '@/views/dashboard/index3.vue'
import Layout from '@/Layout/index.vue'
import SubLayout from '@/Layout/subLayout.vue'
import SubLayoutHaveNav from '@/Layout/subLayoutHaveNav.vue'
import SubLayoutWantSee from '@/Layout/subLayoutWantSee.vue'
import redictComponent from '@/views/redirect/index.vue'
// import Login2 from '@/modules/demo/views/login/login2.vue'
// import Login3 from '@/modules/demo/views/login/login3.vue'
// import Login4 from '@/modules/demo/views/login/login4.vue'
// import Login5 from '@/modules/demo/views/login/login5.vue'
// import QrCode from '@/modules/demo/views/qrcode/index.vue'
import Collect from '@/modules/xingzheng/office/views/collect/index.vue'
// import Search from '@/views/search/index.vue'
import Search from '@/views/search/search.vue'
import Profile from '@/views/profile/index.vue'
import SettingUser from '@/views/setting/user/index.vue'
import ClearThreeMonth from "@/views/clearThreeMonth/index.vue"
import ClearThreeMonthDetail from "@/views/clearThreeMonth/clearThreeMonthDetail/index.vue"
import JcbhModule from "@/views/clearThreeMonth/clearThreeMonthDetail/jcbh.vue"
import WfwgModule from "@/views/clearThreeMonth/clearThreeMonthDetail/wfwg.vue"
import LxlgModule from "@/views/clearThreeMonth/clearThreeMonthDetail/lxlg.vue"
import KyzxModule from "@/views/clearThreeMonth/clearThreeMonthDetail/kyzx.vue"
import KylsModule from "@/views/clearThreeMonth/clearThreeMonthDetail/kyls.vue"


Vue.use(VueRouter)

export let routes: RouteConfig[] = [
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  // {
  //   path: '/login2',
  //   component: Login2,
  //   name: '登录2'
  // },
  // {
  //   path: '/login3',
  //   component: Login3,
  //   name: '登录3'
  // },
  // {
  //   path: '/login4',
  //   component: Login4,
  //   name: '登录4'
  // },
  // {
  //   path: '/login5',
  //   component: Login5,
  //   name: '登录5'
  // },
  // {
  //   path: '/qrcode',
  //   component: QrCode,
  //   name: '二维码登录'
  // },
  // 首页重定向
  {
    path: '/',
    redirect: '/index',
    component: Layout,
    name: '首页',
    meta: {
      icon: 'icc_qiye',
      alwaysShow: false // 本地配置的路由，需要有该属性，当其值为ture时就会展现再Sidebar中，否则便不能
    },
    children: [
      {
        path: '/index',
        name: '工作台',
        component: Dashboard
      },
      {
        path: 'wantToSuperintend',
        component: () => import('@/views/wantToSuperintend/index.vue'),
        name: '内控管理'
      },
      {
        path: 'wantToReport',
        component: () => import('@/views/wantToReport/index.vue'),
        name: '学习园地'
      }
    ]
  },
  {
    path: '/',
    component: SubLayoutWantSee,
    name: '首页',
    meta: {
      icon: 'icc_qiye',
      alwaysShow: false // 本地配置的路由，需要有该属性，当其值为ture时就会展现再Sidebar中，否则便不能
    },
    children: [
      {
        path: '/wantToSee',
        name: '首页',
        component: () => import('@/views/wantToSee/index.vue')
      }
    ]
  },
  {
    path: '',
    component: SubLayoutHaveNav,
    name: '首页',
    children: [
      {
        path: '/toSee',
        name: '工作台',
        component: ToSee
      }
    ]
  },
  // 新版首页-不展示在左侧边栏菜单中
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        component: Dashboard,
        name: '新首页'
      }
    ]
  },
  // 路由重定向
  {
    path: '',
    component: Layout,
    redirect: '/index',
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
        name: '全文检索'
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
        name: '用户中心'
      },
      {
        path: 'setting/user',
        component: SettingUser,
        name: '个人设置'
      }
    ]
  },
  {
    path: '/cockpit',
    component: Cockpit,
    name: '总舱'
  },
  {
    path: '/planCabin',
    component: PlanCabin,
    name: '规划分舱'
  },
  {
    path: '/landCabin',
    component: LandCabin,
    name: '土地分舱'
  },
  {
    path: '/otheriframe',
    component: OtherIframe,
    name: '外部系统调用'
  },
  {
    path: '/clearThreeMonth',
    component: ClearThreeMonth,
    name: "'月清三地两矿'调度中心"
  },
  {
    path: '/jyjy',
    component: ClearThreeMonthDetail,
    name: "'月清三地两矿'调度中心分仓"
  },
  {
    path: '/jcbh',
    component: JcbhModule,
    name: "'月清三地两矿'调度中心分仓"
  },
  {
    path: '/wfwg',
    component: WfwgModule,
    name: "'月清三地两矿'调度中心分仓"
  },
  {
    path: '/kyzx',
    component: KyzxModule,
    name: "'月清三地两矿'调度中心分仓"
  },
  {
    path: '/lxlg',
    component: LxlgModule,
    name: "'月清三地两矿'调度中心分仓"
  },
  {
    path: '/kyls',
    component: KylsModule,
    name: "'月清三地两矿'调度中心分仓"
  },
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
    ; (router as any).matcher = (newRouter as any).matcher // reset router
  router.addRoutes(dynaRoutes)
}
// 修复路由返回一个promise没有catch接收而报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
export default router
