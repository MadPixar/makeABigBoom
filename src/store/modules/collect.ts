import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ICollect {
  listData: Array<object>
  pageType: number
}
@Module({ dynamic: true, store, name: 'Collect' })
class Collect extends VuexModule implements ICollect {
  public listData: Array<object> = []
  public pageType = 0

  @Mutation
  public SET_LISTDATA(listData: Array<object>) {
    this.listData = listData
  }

  @Action
  public SetListData(listData: Array<object>) {
    this.SET_LISTDATA(listData)
  }
  @Mutation
  public SET_PAGETYPE(pageType: number) {
    this.pageType = pageType
  }

  @Action
  public SetPageType(pageType: number) {
    this.SET_PAGETYPE(pageType)
  }
}
export const CollectModule = getModule(Collect)
