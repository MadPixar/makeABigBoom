import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Route } from 'vue-router'
import store from '@/store'
import cloneDeep from 'lodash.clonedeep'
import { isFunction } from 'rxjs/internal-compatibility'
import { SubSystemModule } from '@/store/modules/subsystem'
import { removeVisitedPage } from '@/utils/util'

const { subsystem } = SubSystemModule
export interface ITagView extends Partial<Route> {
  title?: string
  fullPath: string
  keepAlive?: boolean
  name?: string
  meta?: Object
}

export interface ITagsViewState {
  visitedViews: ITagView[]
  cachedViews: (string | undefined)[]
}

export interface IKeepAlive {
  [props: string]: any
}

const defaultView = [
  {
    name: '工作台',
    path: '/index',
    hash: '',
    query: {},
    params: {},
    fullPath: '/index',
    matched: []
  }
]

@Module({ dynamic: true, store, name: 'tagsView' })
class TagsView extends VuexModule implements ITagsViewState {
  // public visitedViewsStroage: string | null = cookies.getTagViews()
  // public visitedViews: ITagView[] = this.visitedViewsStroage
  //   ? JSON.parse(this.visitedViewsStroage)
  //   : JSON.parse(JSON.stringify(defaultView))
  public visitedViews: ITagView[] = subsystem.isSubsystem ? [] : defaultView
  public cachedViews: (string | undefined)[] = []
  public cacheInstanceFn: any = null

  @Mutation
  public RESET_VIEW() {
    // cookies.setTagViews(JSON.stringify(defaultView))
  }
  @Mutation
  private ADD_VISITED_VIEW(view: ITagView) {
    const sameViews = this.visitedViews.find((item: ITagView) => {
      return item.path === view.path
    })
    if (sameViews) return
    // 将新的路由过滤
    const obj: any = {}
    const keyMap = ['name', 'path', 'hash', 'query', 'params', 'fullPath']
    for (const i of keyMap) obj[i] = cloneDeep((view as any)[i])
    obj['meta'] = view.meta
    // 添加储存
    if (this.visitedViews.length < 10) {
      this.visitedViews.push(obj)
      // cookies.setTagViews(JSON.stringify(this.visitedViews))
    } else {
      // 删除第二个，往后加一个
      this.visitedViews.splice(1, 1)
      this.visitedViews.push(obj)
      // cookies.setTagViews(JSON.stringify(this.visitedViews))
    }
  }

  @Mutation
  private DEL_VISITED_VIEW(view: ITagView) {
    // 特殊情况下fullPath不相等--所以取了path
    const { path } = view
    this.visitedViews.forEach((item, index) => {
      if (item.path === path) {
        this.visitedViews.splice(index, 1)
        // cookies.setTagViews(JSON.stringify(this.visitedViews))
      }
    })
    removeVisitedPage({ path })
  }

  @Mutation
  private DEL_ALL_VISITED_VIEWS() {
    this.visitedViews.splice(1, this.visitedViews.length)
    removeVisitedPage({ removeAll: true })
    // cookies.setTagViews(JSON.stringify(this.visitedViews))
  }
  @Mutation
  public DEL_CACHE(key: any) {
    if (!this.cacheInstanceFn) return
    const { cache, keys } = this.cacheInstanceFn()
    delete cache[key]
    const idxArr = keys.reduce((pre: any, cur: any, index: any) => {
      if (cur === key) {
        pre.push(index)
      }
      return pre
    }, [])
    idxArr.forEach((item: any) => {
      keys.splice(item, 1)
    })
  }
  @Mutation
  private DEL_ALL_CACHE() {
    if (!this.cacheInstanceFn) return
    const { cache, keys } = this.cacheInstanceFn()
    for (const i in keys) {
      delete cache[i]
      cache[i] = null
    }
  }
  @Mutation
  private SET_CACHE_INSTANCE_FN(cacheInstanceFn: any) {
    this.cacheInstanceFn = cacheInstanceFn
  }
  @Action
  public setCacheInstanceFn(cacheInstanceFn: any) {
    if (!isFunction(cacheInstanceFn)) return
    if (this.cacheInstanceFn) return
    this.SET_CACHE_INSTANCE_FN(cacheInstanceFn)
  }
  @Action
  public addView(view: ITagView) {
    this.ADD_VISITED_VIEW(view)
  }

  @Action
  public delView(view: ITagView) {
    // 存的是fullpath
    this.DEL_CACHE(view.fullPath)
    this.DEL_VISITED_VIEW(view)
  }

  @Action
  public delAllViews() {
    this.DEL_ALL_CACHE()
    this.DEL_ALL_VISITED_VIEWS()
  }
}

export const TagsViewModule = getModule(TagsView)
