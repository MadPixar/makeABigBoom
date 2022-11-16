import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface SidebarState {
  barColor: string
  barImage: string
  drawer: boolean
  menuItem: any
}

@Module({ dynamic: true, store, name: 'sidebar' })
class Sidebar extends VuexModule implements SidebarState {
  public barColor = 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)'
  public barImage = 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg'
  public drawer = true
  public menuItem = {}

  @Mutation
  SET_BAR_IMAGE(imgUrl: string) {
    this.barImage = imgUrl
  }
  @Mutation
  SET_DRAWER(playload: boolean) {
    this.drawer = playload
  }
  @Mutation
  SET_MENU_ITEM(item: any) {
    this.menuItem = item
  }
}

export const SidebarModule = getModule(Sidebar)
