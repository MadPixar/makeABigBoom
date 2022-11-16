<template>
  <div class="aside el-flex el-flex-row fill-height">
    <div class="side-menu el-pt-5 fill-height el-flex el-flex-column">
      <ul class="el-clear menu-list el-hover-overflow el-flex-grow" v-if="menuList.length">
        <li
          class="el-menu-item el-flex el-flex-column el-flex-center el-flex-y-center"
          v-for="menu in menuList"
          :key="menu.id"
          @click="handleRoute(menu)"
          :class="{ 'is-active': menu.id === inRoute.id }"
        >
          <svg-icon :icon-class="menu.meta.icon"></svg-icon>
          <span class="icon-menu-title">{{ getTagName(menu) }}</span>
        </li>
      </ul>
      <div class="expandBtn el-menu-item" index="expandBtn">
        <div class="icon-menu-item">
          <svg-icon v-if="isExpend" icon-class="ic-outdent" @click="minSidebar(false)" />
          <svg-icon v-else icon-class="ic-indent" @click="minSidebar(true)" />
        </div>
      </div>
    </div>
    <div v-if="isExpend" class="sub-menu fill-height el-py-3">
      <el-menu :default-active="defaultActive" :default-openeds="openKeys" class="sub-main-menu">
        <!-- :title="sub.id" -->
        <el-submenu
          :index="sub.id"
          v-for="sub in subRoutes"
          :key="sub.id"
          :class="{ single: isSigleMenu(sub) }"
          @click.native="handleSub(sub)"
        >
          <template slot="title">
            <svg-icon :icon-class="sub.meta.icon || 'ic-submenu'"></svg-icon>
            <span class="el-pl-4 sub-title">{{ sub.name }}</span>
          </template>
          <el-menu-item-group v-if="sub.children && sub.children.length > 1">
            <!-- :title="`${item.id}-${index}`" -->
            <el-menu-item
              class="child-menu"
              v-for="(item, index) in sub.children"
              :key="item.id"
              :index="`${item.id}-${index}`"
              @click="handleOpen(item)"
            >
              <i class="menu-circle"></i>
              <span class="el-pl-4">{{ getTagName(item) }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import { AppModule } from '@/store/modules/app'
import { SubPermissionModule } from '@/store/modules/subPermission'
import { SubSystemModule } from '@/store/modules/subsystem'
import { TagsViewModule } from '@/store/modules/tags-view'
import { SidebarModule } from '@/store/modules/sidebar'
import { resetRouter } from '@/router/subsystemRouter'

interface ITree {
  id: string
  label?: string
  children?: ITree[]
  path?: string
  [propName: string]: any
}

@Component({
  name: 'SubSystemAside'
})
export default class SubSystemAside extends Vue {
  firstLevelPath = '/'

  inRoute: ITree = {
    id: ''
  }
  subRoutes: ITree[] = []

  firstLoad = true

  @Watch('subRoutes', { deep: true })
  subRoutesChange(value: any) {
    if (value[0] && value[0]?.children?.length) {
      if (this.symbol === 'subsystem-program' && this.firstLoad) {
        const tempTime = setTimeout(() => {
          this.handleOpen((this as any).subRoutes[0]?.children[0])
          clearTimeout(tempTime)
          this.firstLoad = false
        }, 400)
      }
    }
  }

  get isExpend() {
    return AppModule.collapse
  }

  get menuList() {
    return SubPermissionModule.sidebarRoutes
  }

  get openKeys() {
    return (
      this.subRoutes &&
      this.subRoutes.reduce((initData: any, cur: any) => {
        if (cur.children) {
          initData.push(cur.id)
        }
        return initData
      }, [])
    )
  }

  get defaultActive() {
    return this.menuList?.[0]?.id
  }

  get symbol() {
    return SubSystemModule.subsystem.symbol
  }

  async created() {
    await SubPermissionModule.GenerateSubRoutes(this.symbol)
    resetRouter(SubPermissionModule.dynamicRoutes)
    this.handleRoute(this.menuList?.[0])
  }

  minSidebar(status: boolean) {
    AppModule.setMinSidebar(status)
  }

  // 大菜单点击事件
  handleRoute(menu: ITree) {
    if (!menu) return
    this.inRoute = menu
    if (menu.name === '首页') {
      this.$router.push({ path: menu.children?.[0]?.path })
    } else if (menu.name !== '首页' && menu.children?.length === 1) {
      if (menu.children?.length === 1 && menu.children[0]?.children?.length === 1) {
        SidebarModule.SET_MENU_ITEM(menu.children[0]?.children[0])
        this.$router.push({ path: menu.children[0]?.children[0]?.path })
      }
    }
    this.minSidebar(menu.name !== '首页')
    this.subRoutes = menu.children as ITree[]
  }

  // 二级菜单点击事件
  handleSub(sub: { path: string; children: any[] }) {
    if (!sub.children) {
      this.$router.push({ path: sub.path })
    } else if (sub.children.length === 1) {
      SidebarModule.SET_MENU_ITEM(sub.children[0])
      this.$router.push({ path: sub.children[0].path })
    }
  }

  // 三级菜单点击事件
  handleOpen(menu: ITree) {
    if (window.innerWidth < this.$globalProps.maxDeviceWidth) {
      AppModule.setMinSidebar(false)
    }
    TagsViewModule.DEL_CACHE(menu.path)
    SidebarModule.SET_MENU_ITEM(menu)
    this.$router.push({ path: `${menu.path}` })
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

  isSigleMenu(menu: any) {
    return !menu.children || menu.children.length === 1
  }
}
</script>
<style scoped lang="scss">
.aside {
  .side-menu {
    position: relative;
    z-index: 2;
    width: 80px;
    box-shadow: 0px 4px 8px 0px rgba(58, 58, 68, 0.16), 0px 8px 16px 0px rgba(90, 91, 106, 0.16);
    .menu-list {
      overflow: auto;
      .el-menu-item {
        margin: 0 auto;
        height: 64px;
        width: 64px;
        text-align: center;
        overflow: hidden;
        border-radius: 8px;
        flex-shrink: 0;
        cursor: pointer;
        .svg-icon {
          font-size: 24px !important;
        }
        .icon-menu-title {
          color: #8c8c8c;
          text-shadow: 0px 4px 8px 0px rgba(58, 58, 68, 0.16), 0px 8px 16px 0px rgba(90, 91, 106, 0.16);
          line-height: 24px;
          font-size: 12px !important;
          font-family: PingFang SC, PingFang SC-Regular;
        }
      }
    }
    .expandBtn {
      flex-shrink: 0;
      margin-top: 0 !important;
      user-select: none;
      .icon-menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        .svg-icon {
          font-size: 24px !important;
        }
      }
    }
  }
  .sub-menu {
    flex: 1;
    width: calc(100% - 80px);
    .el-menu {
      padding-right: 8px;
    }
    .sub-main-menu {
      height: 100%;
      overflow-y: hidden !important;
      &:hover {
        overflow-y: auto !important;
        overflow-y: overlay !important;
        overflow-x: hidden !important;
      }
    }
    .sub-title {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: bold;
      color: #262626;
    }
    .child-menu {
      padding-left: 30px !important;
      height: 40px;
      line-height: 40px;
      .menu-circle {
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #d9d9d9;
        vertical-align: middle;
      }
    }
  }
}
::v-deep {
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item-group__title {
    display: none;
  }
  .single {
    .el-submenu__title {
      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }
}
</style>
