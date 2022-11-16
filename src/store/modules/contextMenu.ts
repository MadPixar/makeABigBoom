import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IContextMenu {
  menusList: IMenu[]
  visible: boolean
  position: { x: number; y: number }
  relatedItem: {}
}

export interface IMenu {
  icon?: string
  text: string
  hide?:boolean
  handler: Function
}

@Module({ dynamic: true, store, name: 'contextmenu' })
class ContextMenu extends VuexModule implements IContextMenu {
  menusList: IMenu[] = []
  visible = false
  position = { x: 0, y: 0 }
  relatedItem = {}

  @Mutation
  SET_VISIBLE(visible: boolean) {
    this.visible = visible
  }
  @Mutation
  SET_POSITION(position: { x: number; y: number } = { x: 0, y: 0 }) {
    this.position = position
  }
  @Mutation
  SET_MENU_LIST(menus: IMenu[]) {
    this.menusList = menus
  }
  @Mutation
  SET_RELATED_DATA(data: any) {
    this.relatedItem = data
  }

  @Action
  setOption(options: any) {
    this.SET_VISIBLE(options.visible ?? false)
    this.SET_POSITION(options.position ?? { x: 0, y: 0 })
    this.SET_MENU_LIST(options.menus ?? [])
    this.SET_RELATED_DATA(options.data ?? [])
  }
}

export const ContextMenuModule = getModule(ContextMenu)
