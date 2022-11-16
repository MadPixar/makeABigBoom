<template>
  <div :class="{ sidebar: true, isExpend: isExpend }">
    <el-menu class="side-menu" :default-active="firstLevelPath" v-if="!isProduction">
      <div class="el-clear menu-list el-hover-overflow">
        <div class="menu-wrapper">
          <template v-for="(item, index) in menuList">
            <el-menu-item
              @mouseover.native="handleHover(index)"
              @mouseleave.native="handleHoverLeave"
              style="margin-bottom:4px"
              @click="handleRoute(index)"
              :index="item.path"
              v-if="index > 1"
              :key="item.path + '_' + index"
              :class="{
                'is-active': idx === index,
                'bottom-line': item.frontDivider === 0
              }"
            >
              <div :class="['icon-menu-item', item.showTag ? 'menu-tag-active' : '']">
                <template v-if="theme === 'classic-2020'">
                  <svg-icon
                    v-show="idx === index || hoverIdx == index"
                    :icon-class="item.meta.icon + '-active'"
                  ></svg-icon>
                  <svg-icon v-show="idx !== index && hoverIdx !== index" :icon-class="item.meta.icon"></svg-icon>
                </template>
                <template v-else>
                  <svg-icon :icon-class="item.meta.icon"></svg-icon>
                </template>
                <span class="icon-menu-title">{{ item.name }}</span>
              </div>
            </el-menu-item>
          </template>
        </div>
      </div>
      <div class="expandBtn" index="expandBtn">
        <div class="icon-menu-item2">
          <svg-icon v-if="isExpend" icon-class="ic-indent" @click="minSidebar(false)" />
          <svg-icon v-else icon-class="ic-outdent" @click="minSidebar(true)" />
        </div>
      </div>
    </el-menu>
    <div :class="isExpend ? 'full-bg' : ''">
      <div
        class="sub-menu sub-menu-ipad"
        v-if="
          menuList[idx] &&
            menuList[idx].children &&
            !(menuList[idx].children.length === 1 && !menuList[idx].children[0].children)
        "
      >
        <div class="top-icon">{{ deptName }}</div>
        <ul class="menu-tabs el-pl-1 el-pr-1" v-if="tabsShow">
          <li :class="{ 'tab-active': menuName === 'ducha' }" @click="menuTabClick('ducha')">督察模块</li>
          <li :class="{ 'tab-active': menuName === 'zf' }" @click="menuTabClick('zf')">执法模块</li>
          <li :class="{ 'tab-active': menuName === 'zhbg' }" @click="menuTabClick('zhbg')">综合办公</li>
        </ul>
        <!-- <div class="top-icon">{{ defaultActive }}</div> -->
        <el-menu
          :default-active="defaultActive"
          :default-openeds="openKeys"
          class="sub-main-menu el-hover-overflow"
          :style="{ height: tabsShow ? 'calc(100% - 107px)' : 'calc(100% - 72px)' }"
        >
          <template v-for="(item, index) in menuData">
            <el-submenu v-if="item.name != '首页' && item.children" :index="item.path" :key="item.path + '_' + index">
              <template slot="title">
                <span class="el-pl-4">{{ item.name }}</span>
              </template>
              <template v-for="(val, idx) in item.children">
                <el-menu-item
                  :class="{
                    singleModelItem: true,
                    'is-active': val.path === routePath,
                    'top-line': val.frontDivider === 0
                  }"
                  :index="val.path + idx"
                  v-if="!val.children"
                  :key="val.path + '_' + index + '_' + idx"
                  @click="handleOpen(val)"
                >
                  <template v-if="val.extraParams && getCount(JSON.parse(val.extraParams).todoId) > 0">
                    <template v-if="getTagName(val) === '内部通知'">
                      <el-badge v-if="getCount(JSON.parse(val.extraParams).todoId) > 99" value="99+" class="badge-item">
                        <i></i><span>{{ getTagName(val) }}</span>
                      </el-badge>
                      <el-badge v-else :value="getCount(JSON.parse(val.extraParams).todoId)" class="badge-item">
                        <i></i><span>{{ getTagName(val) }}</span>
                      </el-badge>
                    </template>
                    <template v-else>
                      <i></i><span class="pointRed">{{ getTagName(val) }}</span>
                    </template>
                  </template>
                  <template v-else>
                    <span :class="{ pointRed: getTagCount(val) > 0 }">{{ getTagName(val) }}</span>
                  </template>
                </el-menu-item>
                <template v-else>
                  <el-submenu :index="val.path + idx" :key="val.path + '_' + index + '_' + idx" class="third-menu">
                    <template slot="title">{{ val.name }}</template>
                    <el-menu-item v-for="(v, i) in val.children" :key="i" :index="v.path" @click="handleOpen(v)">
                      <span>{{ v.name }}</span>
                    </el-menu-item>
                  </el-submenu>
                </template>
              </template>
            </el-submenu>
            <template v-else>
              <el-menu-item
                :class="{
                  singleModelItem: true,
                  'is-active': item.path === routePath,
                  'top-line': item.frontDivider === 0
                }"
                class="submenu__title"
                :index="item.path"
                :key="item.path + '_' + index"
                @click="handleOpen(item)"
              >
                <span>{{ getTagName(item) }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
        <div class="bottom-bg"></div>
        <div class="bottom-bg-1"></div>
        <div class="bottom-bg-2">
          <img src="@/assets/images/sidebar/huxi.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
import { PermissionModule } from '@/store/modules/permission'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { TagsViewModule } from '@/store/modules/tags-view'
import { SidebarModule } from '@/store/modules/sidebar'
import { SettingsModule } from '@/store/modules/settings'
import ApiService from '@/modules/xingzheng/process/api/manage/index'
import affairModule from '@/modules/xingzheng/process/store/index'
import { getThirdSystems, encrypt } from '@/modules/xingzheng/office/api/post'
import { UserInfoApi } from '@/api/userInfo'
import { cookies } from '@/utils/cookies'
interface ITree {
  id: string
  label?: string
  children?: ITree[]
  path?: string
  [propName: string]: any
}
interface IMenuItem {
  count: string
  menuId: string
}

const initMenu = (node: ITree, menuCount: IMenuItem[]) => {
  // 添加菜单数据
  if (!node || !node.children) return
  if (!Array.isArray(menuCount)) return
  let flag = false
  const menuMap = menuCount.map(i => i.menuId)
  node.children.filter((item: ITree) => {
    const nodeArr = item && item.children && item.children.filter((it: ITree) => menuMap.includes(it.id))
    if (!(nodeArr && nodeArr.length)) {
      return
    }
    nodeArr.forEach((p: any) => {
      const count = menuCount.find((cur: any) => cur.menuId === p.id)
      if (count) p.__number = count.count
      if (p.__number === '0') {
        if (!flag) node.showTag = false
      } else {
        flag = true
        node.showTag = !!p.__number
      }
    })
  })
}
@Component({
  name: 'sidebarNew'
})
export default class sidebarNew extends Vue {
  private idx = -1
  private hoverIdx: null | number = null
  private firstLevelPath = '/'
  private isHome = true
  private themeName = ''
  private menuName = 'ducha'
  private tabsShow = false
  menuTabClick(name: string) {
    // if (this.menuName === name) return
    this.menuName = name
    // this.getMenuList()
  }
  @Watch('$route', { deep: true, immediate: true }) routePathChange(val: any) {
    if (val.path && val.path.split('/').length) {
      const firstLevelPath = val.path
        .split('/')
        .slice(0, 2)
        .join('/')
      const defineModules = this.isDashboardClick()
      if (firstLevelPath === '/index' || (this.firstLevelPath === '/' && defineModules.includes(firstLevelPath))) {
        this.firstLevelPath = '/'
        this.isHome = true
        // 工作台  不需要二级菜单。
        if (this.idx !== -1) this.idx = this.menuList.findIndex((item: any) => item.path === '/')
      } else {
        this.firstLevelPath = firstLevelPath
        this.isHome = false
        const filterMenu = ['内控管理']
        // 因为部分path 设置为/后  导致过滤不到当前index  this.idx会为-1  这些菜单直接return
        if (this.idx && this.idx > -1 && !filterMenu.includes(this.menuList[this.idx].name))
          this.idx = this.menuList.findIndex((item: any) => item.path === firstLevelPath)
      }
    } else {
      this.idx = 0
    }
    // 从督察首页访问任务 刷新菜单。
    if (val.path.includes('/taskRectification')) {
      this.menuName = ''
      setTimeout(() => {
        this.menuName = 'ducha'
      })
    }
  }
  @Watch('theme') getTheme(newVal: any) {
    this.themeName = newVal
  }

  get theme() {
    return SettingsModule.theme
  }
  get isExpend() {
    return AppModule.collapse
  }
  get deptName() {
    return (UserModule.userInfo as any).deptName
  }
  getCount(data: any) {
    const menuCount = UserModule.menuCount as any[]
    if (data && data.length > 0) {
      const arr = menuCount.filter((item: any) => data.includes(Number(item.menuId)))
      const arr1 = Array.from(arr, (item: any) => Number(item.count || 0))
      var sum = arr1.reduce((prev, cur) => {
        return prev + cur
      }, 0)
      return sum
    } else {
      return 0
    }
  }

  // private menuList:any=[]
  get menuList() {
    const menuCount = UserModule.menuCount as any[]
    const tree = PermissionModule.sidebarRoutes as any
    tree.forEach((item: any) => {
      initMenu(item, menuCount)
    })
    // 将首页放第一个
    const dashbaordIndex = PermissionModule.sidebarRoutes.findIndex((item: any) => {
      return item.name === '首页'
    })
    if (dashbaordIndex >= 0) {
      const dashboardRoute = PermissionModule.sidebarRoutes[dashbaordIndex]
      PermissionModule.sidebarRoutes.splice(dashbaordIndex, 1)
      PermissionModule.sidebarRoutes.unshift(dashboardRoute)
    }

    return this.regroupMenu()
  }
  // set menuList(data: any) {
  //   // this.menuList = data
  //   data.forEach((item: any, index: number) => {
  //     this.$set(this.menuList, index, item)
  //   })
  // }
  regroupMenu() {
    const copyMenuList = JSON.parse(JSON.stringify(PermissionModule.sidebarRoutes))
    const that = this
    const taskType = cookies.getTaskType()
    const duchaMenu = cookies.getLocalParams('CurrentDuchaMenu')
    if (this.deptName.includes('执法局')) {
      this.tabsShow = true
    }
    copyMenuList.forEach((item: any) => {
      if (item.name === '我要办') {
        item.children = item.children.filter((node: any) => {
          if (node.extraParams) {
            const extraParams = JSON.parse(node.extraParams)
            // 督察系统菜单特殊处理 -- 维护系统需配置name  菜单分别为  国家  省级  市县-国家   市县-省级
            if (extraParams.groupCode === that.menuName) {
              // 督察系统菜单默认只显示首页，如果有选择taskType任务类型  对应显示配置菜单，
              if (extraParams.groupCode === 'ducha') {
                if (node.name.includes('首页')) return true
                if (!taskType) {
                  return false
                } else {
                  // 对应删除不同类菜单
                  if (extraParams.name && extraParams.name !== duchaMenu) {
                    return false
                  }
                  return true
                }
              }
              return true
            } else {
              if (!this.tabsShow) return true
            }
          } else if (that.menuName === 'zhbg' || !this.tabsShow) {
            return true
          }
        })
      }
    })
    return copyMenuList
  }

  get menuData() {
    return this.menuList[this.idx as number].children
  }
  // 如果params中有id参数,则认为是详情页
  get routePath() {
    return this.$route.params.id
      ? this.$route.matched[1].path
      : this.$route.path.split('/').length >= 5
      ? this.$route.matched[1].path
      : this.$route.path
  }
  get openKeys() {
    return (
      this.menuData &&
      this.menuData.reduce(
        (initData: any, cur: any) => {
          if (cur.children) {
            initData.push(cur.path)
          }
          return initData
        },
        ['1-4']
      )
    )
  }
  get defaultActive() {
    if (this.idx === null) return ''
    if (!this.menuList[this.idx] || !this.menuList[this.idx].children) return ''
    // 路由是否在路由树中
    const RouteChildren = this.menuList[this.idx].children as ITree[]
    const flag =
      RouteChildren.find(item => item.children && item.children.find(it => it.path === this.routePath)) || false
    if (flag) {
      return this.routePath
    }
    // 第三级菜单
    const flag1 =
      RouteChildren.find(
        item =>
          item.children && item.children.find(it => it.children && it.children.find(i => i.path === this.$route.path))
      ) || false
    if (flag1) {
      return this.$route.path
    }
    return ''
  }
  mounted() {
    this.themeName = this.theme
  }
  handleHover(idx: any) {
    this.hoverIdx = idx
  }
  handleHoverLeave() {
    this.hoverIdx = null
  }
  async handleOpen(item: any) {
    item.component = ''
    UserInfoApi.addNumApi(
      {
        menuGrade: '2',
        equipment: 'pc'
      },
      item
    )
    if (item.thirdSystemId) {
      const { data }: any = await getThirdSystems([item.thirdSystemId])
      const encryptRes = await encrypt()
      window.open(data[0]?.configUrl + '?uid=' + encryptRes.data)
      return
    }
    if (window.innerWidth < this.$globalProps.maxDeviceWidth) {
      AppModule.setMinSidebar(false)
    }
    TagsViewModule.DEL_CACHE(item.path)
    SidebarModule.SET_MENU_ITEM(item)
    if (item.isFast) {
      this.goto(item)
      return
    }
    const projectBusinessManagementPathArray = ['/locationPretrial/', '/planningPermission/', '/completionAcceptance/']
    this.$nextTick(() => {
      this.$router.push({
        path:
          item.path + (item.path.includes('/dikuang/') || item.path.includes('/tudi/') ? `?MenuGuid=${item.id}` : ''),
        query: { menuItem: item }
      })
      projectBusinessManagementPathArray.forEach(path => {
        if (item.path.indexOf(path) > -1) {
          this.$router.push(item.path + `?menuid=${item.id}`)
          return
        }
      })
    })
  }
  isDashboardClick() {
    //判断调整的路由是否属于自定义中的路由
    const definedModules: string[] = []
    if (this.menuList[0].children) {
      const definedRoutes = this.menuList[0].children.find((item: any) => {
        return item.name === '自定义'
      })
      if (definedRoutes && definedRoutes['children'])
        definedRoutes['children'].forEach((it: any) => {
          const moduleName =
            it.path &&
            it.path
              .split('/')
              .slice(0, 2)
              .join('/')
          if (!definedModules.includes(moduleName)) definedModules.push(moduleName)
        })
    }
    return definedModules
  }
  getTagName(tag: any) {
    return tag.meta && tag.meta.title ? tag.meta.title : tag.name
  }
  getTagCount(tag: any) {
    const menuCount = UserModule.menuCount as any[]
    const obj = menuCount.find((item: any) => +item.menuId === +tag.id)
    return obj ? Number(obj.count || 0) : 0
  }

  handleRoute(index: number) {
    PermissionModule.SET_NAV_SIDERBAR_PROP(null)
    this.firstLevelPath = this.menuList[index].path
    const secomdMenu = this.menuList[index].children || null
    if (secomdMenu && secomdMenu.length === 1 && !secomdMenu[0].children && this.menuList[index].name !== '首页') {
      this.$router.push(secomdMenu[0].path)
    } else {
      AppModule.setMinSidebar(true)
      this.idx = index
      if (this.menuList[index].name === '首页') {
        this.isHome = true
        this.$router.push('/')
      } else {
        this.isHome = false
      }
      const path = this.defaultActive
      if (path) this.$router.push({ path })
    }
  }
  get navbarToSidebarProp() {
    return PermissionModule.navbarToSidebarProp
  }
  @Watch('navbarToSidebarProp', { immediate: true })
  navbarToSidebarPropChange(val: number | null) {
    if (val !== null) {
      this.idx = val
    }
  }
  get isProduction() {
    // return process.env.NODE_ENV === 'production'
    return true
  }
  minSidebar(status: boolean) {
    AppModule.setMinSidebar(status)
  }
  //发起事务，并跳转
  startAffiar(keyTypeCode: any) {
    return ApiService.startAffair(keyTypeCode).then((res: any) => {
      affairModule.setAffairData(res.data)
      this.$opener('process', {
        moduleKey: res.data.keyDigNumGather,
        boxType: res.data.boxType,
        source: 'launch',
        data: res.data
      })
    })
  }
  async goto(item: any) {
    const { moduleName, keyTypeCode, path } = item
    if (moduleName === '事务') {
      await this.startAffiar(keyTypeCode)
      return
    }
    this.$router.push(path.slice(1))
  }
  closeSlidebar() {
    AppModule.setMinSidebar(false)
  }
}
</script>

<style lang="scss" scoped>
@mixin sidebar-height {
  display: flex;
  align-items: center;
  height: 48px;
  border-radius: 8px;
}
.sidebar {
  display: flex;
  .full-bg {
    // box-shadow: 1px 0 5px 0 rgb(57 66 60 / 20%);
    z-index: 999;
    @include themify {
      @if themed('classic-2020') {
        background: linear-gradient(180deg, rgba(0, 68, 211, 1) 0%, rgba(38, 100, 218, 1) 100%);
      }
    }
  }
  .submenu__title {
    span {
      font-weight: bold;
    }
  }
  .submenu__title:hover,
  .submenu__title.is-active:hover,
  .submenu__title.is-active,
  .submenu__title span {
    @include themify {
      @if themed('classic-2020') {
        color: #fff !important;
      } @else {
        color: #1f1f1f !important;
      }
    }
  }
  .side-menu {
    height: 100%;
    width: 80px;
    padding: 20px 0 0;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 1px 0px 5px rgba(57, 66, 60, 0.2);
    z-index: 999;
    .svg-icon {
      font-size: 24px !important;
    }
    .application-icons {
      font-size: 18px !important;
    }
    &::v-deep .el-menu-item {
      height: 56px;
      width: 56px;
      text-align: center;
      padding: 0 !important;
      // overflow: hidden;
      margin: 0 auto;
      border-radius: 8px;
      flex-shrink: 0;
      margin-bottom: 8px !important;
      @include themify {
        @if themed('high-contrast') {
          .svg-icon {
            color: themed('menu-text-color');
          }
        }
        @if themed('classic-2020') and not themed('high-contrast') {
          &:not(.expandBtn) {
            color: themed('menu-text-color');
          }
        }
      }
    }
    .menu-list {
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      .menu-wrapper {
        width: 100%;
        height: 100%;
        // overflow: auto;
        &::-webkit-scrollbar-thumb {
          background-color: #a5d3fa;
          border-radius: 80px;
        }
        &::-webkit-scrollbar {
          width: 3px;
        }
      }
      .icon-menu-item {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .icon-menu-title {
          height: 14px;
          line-height: 14px;
          font-size: 14px !important;
          margin-top: 4px;
        }
      }
    }
    .applicationBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64px;
      width: 64px;
      flex-shrink: 0;
      margin-top: 0 !important;
      user-select: none;
    }
    .expandBtn {
      flex-shrink: 0;
      margin-top: 0 !important;
      user-select: none;
      .icon-menu-item2 {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        width: 64px;
        cursor: pointer;

        @include themify {
          @if themed('classic-2020') {
            color: #fff;
          } @else {
            color: #8c8c8c;
          }
        }
      }
      .divider {
        display: inline-block;
        position: absolute;
        top: 0px;
        left: 16px;
        width: 32px;
        height: 1px;
        background: rgba(5, 23, 54, 1);
        opacity: 0.07;
      }
    }
  }
  .sub-menu {
    height: 100%;
    border-image-width: 0 0 !important;
    opacity: 1;
    // border-right: 1px solid #ebecf0;
    animation: hidden 0.2s;
    width: 0px;
    overflow: hidden;
    background-color: transparent;
    .svg-icon {
      font-size: 20px !important;
      vertical-align: middle;
      margin-right: 5px;
    }
    ::v-deep {
      .el-menu-item-group__title {
        display: none;
      }
    }
    .sub-main-menu {
      border: none;
      overflow-x: hidden;
      background-color: transparent;
      .top-line {
        border-top: solid 1px #f1f1f1;
        position: relative;
      }
      ::v-deep .el-submenu > .el-menu {
        background-color: rgba(#000, 0.01);
      }
      ::v-deep .no-children > .el-submenu__title {
        display: none !important;
      }
    }
    .sub-main-menu::-webkit-scrollbar {
      width: 0;
    }
  }
}
.isExpend ::v-deep {
  .sub-menu {
    position: relative;
    animation: show 0.2s;
    width: 256px;
    @include themify {
      @if themed('classic-2020') {
        background: linear-gradient(180deg, rgba(0, 68, 211, 1) 0%, rgba(38, 100, 218, 1) 100%) !important;
      } @else {
        // background: themed('navbar-background-img') no-repeat 0 0/ 100% 100%;
        background: #fff;
      }
    }
    .el-submenu .el-menu-item {
      @include themify {
        @if themed('classic-2020') {
          color: rgba(233, 240, 252, 1);
          background: transparent;
        } @else {
          color: #1f1f1f;
        }
      }
    }
    .el-submenu__title {
      @include themify {
        @if themed('classic-2020') {
          color: rgba(233, 240, 252, 1) !important;
        } @else {
          color: #1f1f1f;
        }
      }
    }
    .sub-main-menu {
      position: relative;
      z-index: 1;
      height: calc(100% - 72px);
    }
    .bottom-bg-1 {
      @include themify {
        @if themed('classic-2020') {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 72px;
          z-index: 0;
          background-image: url(~@/assets/images/sidebar/buildings.png);
          background-size: 100% 100%;
        } @else {
          display: none;
        }
      }
    }
    .bottom-bg-2 {
      @include themify {
        @if themed('classic-2020') {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 88px;
          z-index: 0;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          mix-blend-mode: screen;
          img {
            width: 221px;
            height: 88px;
            margin: 0 auto;
            mix-blend-mode: screen;
            animation-name: breathe;
            animation-duration: 1s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-direction: alternate;
          }
          @keyframes breathe {
            0% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        } @else {
          display: none;
        }
      }
    }
    .bottom-bg {
      @include themify {
        @if themed('classic-2020') {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 128px;
          z-index: 0;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          background-image: url(~@/assets/images/sidebar/bottom-bg.png);
          background-size: 100% 100%;
          mix-blend-mode: overlay;
        } @else {
          display: none;
        }
      }
    }
    .top-icon {
      width: 240px;
      height: 44px;
      text-align: center;
      padding-top: 16px;
      margin: 8px 8px 20px;
      background-image: url(~@/assets/images/sidebar/top-icon.png);
      background-size: 100% 100%;
      color: #fff;
      // @include themify {
      //   @if themed('classic-2020') {
      //     background-image: url(~@/assets/images/sidebar/top-icon.png);
      //     background-size: 100% 100%;
      //     color: #fff;
      //   } @else {
      //     background: #fff;
      //     color: #000;
      //   }
      // }
    }
    .menu-tabs {
      width: 100%;
      display: flex;

      li {
        width: 33%;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        border-radius: 2px;
        @include themify($themes) {
          @if themed('classic-2020') {
            color: rgba(255, 255, 255, 0.7);
            background: rgba(255, 255, 255, 0.1);
          } @else {
            background: themed('primary-color');
            opacity: 0.7;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      li:nth-of-type(2) {
        margin: 0 1px;
      }
      .tab-active {
        color: #fff;
        // background: rgba(255, 255, 255, 0.3);
        @include themify($themes) {
          @if themed('classic-2020') {
            color: rgba(255, 255, 255, 1);
            background: rgba(255, 255, 255, 0.3);
          } @else {
            opacity: 1;
            background: themed('primary-color');
          }
        }
      }
    }
  }
}
@keyframes show {
  0% {
    width: 0;
  }
  100% {
    width: 176px;
  }
}
@keyframes hidden {
  0% {
    width: 176px;
  }
  100% {
    width: 0;
    display: none !important;
  }
}
.badge-item ::v-deep .el-badge__content {
  right: -3px;
  font-size: 12px !important;
  line-height: 14px;
  border-radius: 8px;
  padding: 0 4px;
  top: 16px;
  height: 16px;
  border: none;
}
.menu-tag-active::after {
  content: '';
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f56c6c;
  top: 4px;
  right: 12px;
}
.el-submenu.is-opened {
  ::v-deep {
    .el-menu {
      background-color: rgba($color: #ffffff, $alpha: 0.1) !important;
    }
  }
}
.el-submenu ::v-deep {
  .el-submenu__icon-arrow {
    @include themify {
      @if themed('classic-2020') {
        color: #fff;
      }
    }
  }
  &.third-menu {
    .el-submenu__title {
      border-radius: 0;
      padding-left: 30px !important;
    }
    .el-menu {
      .el-menu-item {
        padding-left: 46px !important;
      }
      background-color: transparent !important;
    }
  }
}
.el-submenu {
  ::v-deep .el-submenu__title {
    padding: 0 !important;
    border-radius: none !important;
    span {
      font-weight: 600 !important;
    }
    &:hover {
      background: none !important;
    }
  }
  ::v-deep .el-menu-item {
    padding: 0 20px 0 30px !important;
    height: 48px;
    background: rgba(#fff, 0.4);
    line-height: 48px;
    margin: 0 0 0 4px;
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      background: #d9d9d9;
      margin: 0 12px 0 0;
      vertical-align: middle;
    }
  }
  ::v-deep .el-submenu__title {
    @include sidebar-height;
  }
}
.icc_submenu_icon {
  @include themify($themes) {
    color: themed('primary-color');
  }
}
.dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  margin: 0 12px;
  background: rgba(0, 0, 0, 0.2);
}
/* ipad适配 */
@media only screen and (min-device-width: $--min-device-width) and (max-device-width: $--max-device-width) and (orientation: $--orientation) {
  .full-page {
    position: relative;
  }
  .sub-menu {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 22;
    animation: 0s !important;
  }
  .full-bg {
    width: calc(100% - 80px);
    // height: calc(100% - 52px);
    box-shadow: 1px 0 5px 0 rgb(57 66 60 / 20%);
    z-index: 999;
    position: absolute;
    left: 80px;
    top: 52px;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.2);
  }
  .el-hover-overflow {
    overflow-y: auto !important;
  }
}
.pointRed {
  position: relative;
  &:before {
    content: '';
    width: 6px;
    height: 6px;
    background: #f56c6c;
    border-radius: 50%;
    position: absolute;
    right: -8px;
    top: 2px;
  }
}
</style>
