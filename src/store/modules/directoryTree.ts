import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators"
import store from "@/store"

export interface ITree {
  tree: object[]
}
@Module({ dynamic: true, store, name: "directoryTree" })
class DirectoryTree extends VuexModule implements ITree {
  public tree: object[] = []

  @Mutation
  public RESTORE_TREE(tree: object[]) {
    this.tree = tree
  }

  @Action
  public restoreTree(tree: object[]) {
    this.RESTORE_TREE(tree)
  }
}
export const directoryTreeModule = getModule(DirectoryTree)
