import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import Cookies from 'js-cookie'
interface ISetting {
  theme: string
  showRightPanel: boolean
  loading: boolean
  loadingText: string
  typeNum: number
  templateItem: any
}

@Module({ dynamic: true, store, name: 'Setting' })
class Setting extends VuexModule implements ISetting {
  primaryColor = Cookies.get('primaryColor') || '#1491ED'
  // theme = Cookies.get('theme') || 'default-blue'
  theme = Cookies.get('theme') || 'simple-white'
  // theme = Cookies.get('theme') || 'classic-2020'
  fontSize = Cookies.get('fontSize') || 'standardFontSize'
  showRightPanel = false
  loading = false
  loadingText = '加载中...'
  typeNum = 1
  templateItem = []

  @Mutation
  private CHANGE_SETTING(payload: { key: string; value: any; type: number }) {
    const { key, value, type } = payload
    this.typeNum = type
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      ;(this as any)[key] = value
    }
  }

  @Mutation
  public SET_TEMPLATE(data: any) {
    this.templateItem = data
  }

  @Action
  public SetTemplateItem(data: any) {
    this.SET_TEMPLATE(data)
  }

  @Action
  public ChangeSetting(payload: { key: string; value: any; type: number }) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule(Setting)
