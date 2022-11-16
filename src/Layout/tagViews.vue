<template>
  <div id="tags-view-container" class="tags-view-container" ref="tagViews" v-if="!isTablet">
    <ul ref="scrollPane" class="tags-view-wrapper">
      <li
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.params.tagName ? tag.params.tagName : tag.fullPath"
        :class="isActive(tag) ? 'active' : ''"
        :style="{ color: isActive(tag) ? them : '' }"
        class="tags-view-item"
        @click="goTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <div class="center-content" :class="navColor">
          <span class="tag-name">{{ getTagName(tag) }}</span>
          <i
            dense
            :class="isActive(tag) ? 'active' : ''"
            small
            class="el-icon-close el-ml-1"
            v-if="!isHome(tag)"
            @click.prevent.stop="closeSelectedTag(tag)"
          ></i>
        </div>
      </li>
    </ul>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { TagsViewModule, ITagView } from '@/store/modules/tags-view'
import { SettingsModule } from '@/store/modules/settings'
import { SubSystemModule } from '@/store/modules/subsystem'
import { cloneDeep, get } from '@/utils/util'
import { AppModule } from '@/store/modules/app'
import { SidebarModule } from '@/store/modules/sidebar'

const getCacheInstance = (item: any): any => {
  const parent = get(item, '$vnode.parent', '')
  if (parent && parent.tag.includes('keep-alive')) return parent.componentInstance
  for (const i in item.$children) {
    const a = getCacheInstance(item.$children[i])
    if (a) return a
  }
}

@Component({
  name: 'TagsView'
})
export default class extends Vue {
  @Inject() appConfig!: any
  private visible = false
  private top = 0
  private left = 0
  private selectedTag: object = {}
  private affixTags: any[] = []
  /** 记录跳转前的路由,用作删除选中的tags时将要跳转目的路由*/
  private preRoute: Route = {
    fullPath: '',
    hash: '',
    matched: [],
    meta: {},
    params: {},
    path: '',
    query: {}
  }
  get subsystem() {
    return SubSystemModule.subsystem
  }
  get visitedViews() {
    return this.subsystem.isSubsystem
      ? TagsViewModule.visitedViews.filter((tag: { name: string }) => !['工作台', '子系统'].includes(tag.name))
      : TagsViewModule.visitedViews
  }
  get them() {
    return SettingsModule.theme
  }
  get navColor() {
    return SettingsModule.navColor
  }
  get isTablet() {
    return AppModule.isTablet
  }
  @Watch('$route', { immediate: true, deep: true })
  onRouteChange(currRoute: Route, oldRoute: Route) {
    this.preRoute = oldRoute
    if (this.isTablet) return
    this.addTags()
  }
  @Watch('visible')
  private onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }
  created() {
    TagsViewModule.setCacheInstanceFn(this.getCacheInstance)
  }

  getCacheInstance() {
    const { cache, keys } = getCacheInstance(this.$parent) || { cache: {}, keys: [] }
    return { cache, keys }
  }

  isHome(tag: any) {
    let flag = false
    if (this.subsystem.isSubsystem) {
      flag = tag.path.includes('/project/projectlibrary/mine') && tag.name === '我的项目'
    } else {
      flag = tag.path === '/index'
    }
    return flag
  }
  getTagName(tag: any) {
    return tag.params && tag.params.tagName
      ? tag.params.tagName
      : tag.meta && tag.meta.title
      ? tag.meta.title
      : tag.name
  }
  private isActive(route: Route) {
    return route.path === this.$route.path
  }

  private addTags() {
    const { name } = this.$route
    if (name) {
      const { name, path, fullPath, meta, query, params } = this.$route
      TagsViewModule.addView(cloneDeep({ name, path, fullPath, meta, query, params }))
    }
  }

  private closeSelectedTag(view: Route) {
    TagsViewModule.delView(view)
    const { length }: any = this.visitedViews
    let lastRoute: any = ''
    if (length) lastRoute = this.visitedViews[length - 1]
    if (lastRoute?.query?.menuItem?.extraParams) {
      SidebarModule.SET_MENU_ITEM(lastRoute.query.menuItem)
    }
    if (this.isActive(view)) {
      const stroagedVisitedViews = TagsViewModule.visitedViews
      if (this.preRoute) {
        const tagFlag = stroagedVisitedViews.some((it: Route) => {
          return it.path === this.preRoute.path
        })
        if (this.preRoute.fullPath && tagFlag) {
          this.$router.push(this.preRoute.fullPath)
          return
        }
      }
      this.toLastView(stroagedVisitedViews)
    }
  }

  private closeOthersTags() {
    const selectPath = (this.selectedTag as any).fullPath
    this.closeAllTags()
    this.$router.push(selectPath)
  }

  private closeAllTags() {
    TagsViewModule.delAllViews()
    this.$router.push('/')
  }

  private toLastView(visitedViews: ITagView[]) {
    const latestView = visitedViews.slice(-1)?.[0]?.fullPath
    if (latestView) this.$router.push(latestView)
  }

  private openMenu(tag: Route, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right
    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }
    this.top = 30
    this.visible = true
    this.selectedTag = tag
  }

  private closeMenu() {
    this.visible = false
  }
  private goTag(route: Route) {
    if ((route as any)?.query?.menuItem?.extraParams) {
      SidebarModule.SET_MENU_ITEM(route.query.menuItem)
    }
    const params: any = {
      // name: route.name,
      path: route.path,
      query: route.query,
      params: route.params
    }
    this.$router.push(params)
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 36px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 101;
  .tags-view-wrapper {
    padding-top: 4px;
    height: 100%;
    // background: #f4f5fc;
    border-bottom: 1px solid #d9d9d9;
    white-space: nowrap;
    display: flex;
    padding: 4px 4px 0 4px;
    .tags-view-item {
      display: flex;
      cursor: pointer;
      &:hover {
        background: #fff;
        border-radius: 8px 8px 0px 0px;
      }
      &.active {
        .center-content {
          color: #262626;
          background-color: #fff;
        }
      }
      .center-content {
        background: rgba(#fff, 0.5);
        border-radius: 8px 8px 0px 0px;
        color: #777c88;
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px 16px;
        .tag-name {
          font-size: 12px !important;
          max-width: 200px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .el-icon-close {
          color: #595959;
          margin-top: 2px;
          &:hover {
            border-radius: 8px;
            background: rgba(#f56c6c, 0.1);
            color: #f56c6c;
          }
        }
        > button {
          font-size: 0.85em !important;
        }
      }
    }
  }
  .tags-view-wrapper:hover {
    overflow: auto;
  }

  .contextmenu {
    background-color: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
