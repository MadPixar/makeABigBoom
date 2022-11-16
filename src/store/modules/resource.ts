import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IResource {
  userNameTree: string
  userNumTree: number
}
@Module({ dynamic: true, store, name: 'resource' })
class Resource extends VuexModule implements IResource {
  public userNameTree = ''
  public userNumTree = 0
  public tab = 'ResZone'

  @Mutation
  public SET_USERNAMETREE(userNameTree: string) {
    this.userNameTree = userNameTree
  }

  @Mutation
  private SET_USERNUMETREE(userNumTree: number) {
    this.userNumTree = userNumTree
  }
  @Mutation
  private SET_TAB(data: any) {
    this.tab = data
  }

  @Action
  public SetUsernameTree(name: string) {
    this.SET_USERNAMETREE(name)
  }

  @Action
  public SetUsernumTree(num: number) {
    this.SET_USERNUMETREE(num)
  }
  @Action
  public setTab(num: number) {
    this.SET_TAB(num)
  }
}
export const ResourceModule = getModule(Resource)
