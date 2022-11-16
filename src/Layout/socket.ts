import { Vue, Component } from 'vue-property-decorator'

/* -------------------------------------------------------------------------- */
/*                                socketjs 消息推送                            */
/* -------------------------------------------------------------------------- */
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { EMsgFunc, GlobFunc } from '@/store/modules/globalFunc'
import lodashGet from 'lodash.get'
import { UserModule } from '@/store/modules/user'
import { Login } from '@/api/login'
import { get, log, throttle } from '@/utils/util'
import PubSub from 'pubsub-js'

let count = 0
let pre = new Date().getTime()

const moduleMap: any = {
  office_detail: 'office',
  op_detail: 'op',
  receipt_detail: 'doc',
  post_detail: 'doc',
  meeting_detail: 'meeting',
  process_detail: 'process',
  supervise_detail: 'supervise'
  // attend_detail: 'attend
}

@Component({
  name: 'Socket'
})
export default class Socket extends Vue {
  private stomp: any = null
  get userId() {
    return lodashGet(UserModule, 'userInfo.user.userId', '')
  }
  get userName() {
    return UserModule.userInfo.user.userName
  }
  created() {
    this.initSocket()
  }
  initSocket() {
    if (count > 20) {
      log('超过最大连接数量')
      return
    }
    if (this.stomp && this.stomp.disconnect) {
      this.stomp.disconnect()
    }
    this.stomp = null
    const url = process.env.VUE_APP_WS_BASE_URL
    // const url = 'http://10.14.3.244:19161/ws'
    const socket = new SockJS(url, null, { timeout: 30000 })
    this.stomp = Stomp.over(socket)
    this.stomp.connect(
      { userId: this.userId, userName: this.userName, clientId: localStorage.getItem('client_uid') },
      () => {
        // this.stomp.subscribe('/user/topic/todo', this.socketTodo)
        this.stomp.subscribe('/user/topic/loginout', this.socketLoginOut)
        this.stomp.subscribe('/user/topic/push', this.onMessage)
      },
      () => {
        count++
        this.initSocket()
      }
    )
  }
  socketTodo({ body }: { body: any }) {
    // const res = JSON.parse(body)
    const { title, content, params } = body
    const { menuId, messageCount, clickEventName, gridId, optionType } = JSON.parse(content)
    const res_params = JSON.parse(params)
    this.resetMenuCount(menuId, messageCount, optionType)
    this.resetTableData(gridId, res_params, optionType)
    this.showMessage(this, title, clickEventName, res_params)
  }
  socketLoginOut(res: any) {
    if (!res.body) return
    const loginUserInfo = JSON.parse(res.body)
    if (loginUserInfo.eventName !== 'loginOut') return
    const { loginIp, loginDateTime } = loginUserInfo
    this.$alert(
      `<div class="ws-msg-inline"> <div >您的账号在</div> <div><span style="margin-right:10px;">地点:</span >${loginIp}</div><div><span style="margin-right:10px;">时间:</span>${loginDateTime}</div> <div>已登录,即将退出</div> </div>`,
      '提示',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: () => {
          Login.logOut()
            .then(() => {
              UserModule.LogOut()
              window.location.reload()
            })
            .catch(() => {
              this.$message.warning('退出失败')
            })
          if (this.stomp !== null) {
            this.stomp.disconnect()
          }
        }
      }
    )
  }
  resetMenuCount(menuId: number, count: number, optionType: number) {
    if (optionType !== 3) {
      UserModule.UPDATE_MENU_COUNT({ menuId: String(menuId), count: String(count) })
    }
  }
  resetTableData(clickEventName: any, params: any, optionType: number) {
    const fn = GlobFunc.functionList[clickEventName]
    log(`刷新表格数据${clickEventName}---${fn}---`)
    // 通知 --> 首页刷新 否则执行 待办
    if (clickEventName === EMsgFunc[EMsgFunc.office_query]) {
      const notice = (GlobFunc.functionList as any)['update_dashboard_notice_number']
      if (typeof notice === 'function') {
        notice()
      } else {
        log(`首页通知函数没有执行`)
      }
    }
    const todo = (GlobFunc.functionList as any)['update_dashboard_todo_number']
    if (typeof todo === 'function') {
      todo()
    } else {
      log(`首页待办函数没有执行`)
    }
    if (typeof fn === 'function') {
      fn(params, optionType)
    } else {
      log(`无表格刷新函数${clickEventName}`)
    }
  }
  showMessage = throttle(
    function(context: any, title: string, clickEventName: any, params: any) {
      const cur = new Date().getTime()
      if (cur - pre < 1000) {
        pre = cur
        log('消息间隔小于1s,过滤掉')
        return
      }
      if (!title) {
        log('消息推送:显示弹框:标题无效')
        return
      }
      const notice = context.$notify({
        title: '消息',
        message: title,
        position: 'bottom-right',
        type: 'success',
        customClass: 'ws-msg-notify',
        duration: 3000,
        onClick: function() {
          const moduleKey = get(params, 'eparams.businessKey', '')
          if (!moduleKey) {
            log(`跳转详情页面失败${JSON.stringify(params, null, 2)}`)
            return
          }
          context.$opener(moduleMap[clickEventName], { moduleKey })
          notice.close()
        }
      })
    },
    1000,
    { leading: true, trailing: false }
  )
  goDetail(clickEventName: any, data: any) {
    const fn = (GlobFunc.functionList as any)[clickEventName]
    const { todoId } = data
    if (typeof fn === 'function') {
      fn({ msgId: todoId })
    } else {
      log('找不到跳转详情的事件', clickEventName)
    }
  }
  // 收到聊天消息
  onMessage({ body }: { body: any }) {
    if (!body) return
    const bodyJson = JSON.parse(body)
    const content = JSON.parse(bodyJson.content)
    if (bodyJson.id) {
      const msg = { msgId: bodyJson.id, body: '' }
      this.stomp.send('/app/topic/push', {}, JSON.stringify(msg))
    }
    if (content && (content.messageType === 'CHAT' || content.messageType === 'NOTIFY')) {
      if (content.messageType === 'NOTIFY') return
      PubSub.publish('receive-chat-message', content)
    } else {
      this.socketTodo({ body: bodyJson })
    }
  }
}
