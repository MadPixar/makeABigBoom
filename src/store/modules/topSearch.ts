import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ITopSearch {
  searchText: string
  SET_SEARCH_TEXT: (str: string) => void
}

@Module({ dynamic: true, store, name: 'topSearch' })
class TopSearch extends VuexModule implements ITopSearch {
  public searchText = ''
  @Mutation
  SET_SEARCH_TEXT(str: string) {
    this.searchText = str
  }
}

export const TopSearchModule = getModule(TopSearch)
