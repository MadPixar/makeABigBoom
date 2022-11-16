import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface Itz {
  userNameTree: any
}
@Module({ dynamic: true, store, name: 'tz' })
class Tz extends VuexModule implements Itz {
  public userNameTree = ''

  @Mutation
  public SET_USERNAMETREE(userNameTree: any) {
    this.userNameTree = userNameTree
  }

  @Action
  public SetUsernameTree(name: any) {
    this.SET_USERNAMETREE(name)
  }
}
export const TzModule = getModule(Tz)
