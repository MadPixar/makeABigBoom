import Vue from 'vue'
import Vuex from 'vuex'
import { IUserState } from './modules/user'
import { IPermissionState } from './modules/permission'
import { SidebarState } from './modules/sidebar'
import { ITopSearch } from './modules/topSearch'
import { IAppState } from './modules/app'
import { IGlobalFuncClass } from './modules/globalFunc'
// import {IOneMap} from '@/modules/onemap/store/index'

Vue.use(Vuex)

export interface IRootState {
  user: IUserState
  permission: IPermissionState
  sidebar: SidebarState
  app: IAppState
  GlobFunc: IGlobalFuncClass
  TopSearch: ITopSearch
  //OneMapDemo:IOneMap
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
