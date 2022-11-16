/**
 *  @desc socket需要调用的函数
 */
import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
export enum EMsgFunc {
  office_query, //内部通知
  receipt_query, //在办收文
  process_query, //综合:在办事务列表
  supervise_query, //督办:在办事务列表
  op_query, // 在办案卷列表
  post_query, // 在办发文
  attend_query, // 我的会议列表
  meeting_query, // 会议办理列表
  update_dashboard_notice_number, // 首页私有通知 多个执行函数
  update_dashboard_todo_number // 首页私有通知 多个执行函数
}
type MsgInstance = {
  [key in EMsgFunc]: string | any[]
}

export enum AllModules {
  process = 'process',
  supervise = 'supervise',
  doc = 'doc',
  office = 'office',
  meeting = 'meeting',
  op = 'op',
  archive = 'archive',
  tz = 'tz'
}
export interface IGlobalFuncClass {
  functionList: MsgInstance
  [propName: string]: any
}

@Module({ dynamic: true, store, name: 'GlobFuncClass' })
class GlobFuncClass extends VuexModule implements IGlobalFuncClass {
  public functionList: any = {
    office_query: '',
    receipt_query: '',
    process_query: '',
    supervise_query: '',
    op_query: '',
    post_query: '',
    meeting_query: '',
    update_dashboard_notice_number: '',
    update_dashboard_todo_number: ''
  }
  /**
   * 箱子列的路由与Vue组件的name对应关系，用来判断哪些页面是存在router-views中的
   * 当socket推消息提示要刷新列表时，而不会去刷新所有functionList中的方法，
   * 只刷新打开了的页面的列表，其格式为：comName{router.path:Vue文件中定义的name}
   */
  public nameWithRoute: { [props: string]: string } = {}

  @Mutation
  public SET_FUNCTION_LIST({ func, fn }: { func: string; fn: (([propsName]: any) => void) | string }) {
    this.functionList[func] = fn
  }
  // 设置单个name
  @Mutation
  public SET_NAME_WITH_ROUTE({ path, name }: { path: string; name: string }) {
    this.nameWithRoute[path] = name
  }
  // 更新name
  @Mutation
  public UPDATE_NAME_WITH_ROUTE(nameWithRoute: { [props: string]: string }) {
    this.nameWithRoute = nameWithRoute
  }
  // 根据name判断该vue组件是否打开过
  isVisitedPage = (name: string) => {
    return Object.values(this.nameWithRoute).includes(name)
  }
}

export const GlobFunc = getModule(GlobFuncClass)
