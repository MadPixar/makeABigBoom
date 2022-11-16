import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

interface ISubSystemClass {
  subsystem: any
}

@Module({ dynamic: true, store, name: 'SubSystem' })
class SubSystemClass extends VuexModule implements ISubSystemClass {
  subsystem = {
    isSubsystem: false,
    symbol: ''
  }

  get subsystemInfo() {
    return this.subsystem
  }

  @Mutation
  SET_SUBSYSTEM_INFO(info: any) {
    this.subsystem = info
  }

  @Action
  setInfo(info: any) {
    this.SET_SUBSYSTEM_INFO(info)
  }
}

export const SubSystemModule = getModule(SubSystemClass)
