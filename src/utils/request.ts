import axios from 'axios'
import { UserModule } from '@/store/modules/user'
import { cookies } from '@/utils'
import { toolsFunc } from '@/utils/tools'
import QS from 'qs'
import Vue from 'vue'
interface IStatusStrategy {
  [prop: number]: () => void
}
interface ITypeStrategy {
  [prop: string]: (error: any) => void
}
let messageError: any

// 重复请求时的错误提示信息
const cancelMsg = '不能短时间内重复发起相同请求'

// const pending: { [props: string]: Function } = {}
// const cancelToken: any = axios.CancelToken
// const removePending = (config: any, url: string) => {
//   if (pending[url]) {
//     //当前请求在数组中存在时执行函数体
//     pending[url](cancelMsg) //执行取消操作
//     delete pending[url] //数组移除当前请求
//   }
// }

const type = (obj: any) =>
  Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase()
const request = axios.create({ timeout: 60000 })

const request_noLoading = axios.create({ timeout: 15000 })

const pdf_preview_request = axios.create({ timeout: 50000 })

const { openLoading, closeLoading } = toolsFunc

const statusStrategy: IStatusStrategy = {
  500() {
    messageError('服务器请求失败')
  },
  502() {
    messageError('网关不可用')
  },
  503() {
    messageError('服务不可用')
  },
  504() {
    messageError('网关超时')
  },
  401() {
    messageError('登录超时,请重新登录!', 3000)
    UserModule.setLoginExpired(true)
    const subsystem: { isSubsystem: boolean; symbol: string } = {
      isSubsystem: window.location.pathname.startsWith('/sub'),
      symbol: window.location.pathname.split('/')[2]
    }
    if (subsystem.isSubsystem) {
      const subRouter = require('@/router/subsystemRouter')
      UserModule.LogOut()
      subRouter.default.replace(`/subsystemLogin/${subsystem.symbol}`)
    }
  },
  404() {
    messageError('地址无效')
  }
}
const typeStrategy: ITypeStrategy = {
  arraybuffer(error) {
    const enc = new TextDecoder('utf-8')
    const err = JSON.parse(enc.decode(new Uint16Array(error.response.data))).error
    messageError(err, 5000)
  },
  blob(error) {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result)
        messageError(data.error || '系统错误，请联系管理员', 5000)
      } catch (error) {
        messageError(e.target.result || '系统错误，请联系管理员', 5000)
      }
    }
    reader.readAsText(error.response.data)
  }
}
const statusHandler = (error: any) => {
  const status = error?.response?.status
  if (!statusStrategy[status]) return
  statusStrategy[status]()
  return true
}
const typeHandler = (error: any) => {
  const errType = type(error?.response?.data)
  if (typeStrategy[errType]) {
    typeStrategy[errType](error)
  } else {
    const errMsg = error?.response?.data?.error_description || error?.response?.data?.error || error.message
    // 过滤掉因为重复请求发提示的错误信息
    if (errMsg !== cancelMsg) messageError(errMsg || '系统错误，请联系管理员', 5000)
  }
}
const request_config = async (config: any) => {
  // 设置cancelToken对象
  // const url = [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&') //生成url
  // removePending(config, url) //在一个axios发送前执行一下取消操作
  // config.cancelToken = new cancelToken((c: Function) => (pending[url] = c))

  if (!config.headers.Authorization && cookies.getToken() && !config.url.includes('oauth/captcha')) {
    // 表示非登录请求
    config.headers['Authorization'] = 'Bearer ' + cookies.getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Set-Cookie'] =
      'Apollo-Token=eyJpcCI6IjEwLjE0LjMuNTMiLCJicm93c2VyIjoiQ2hyb21lOTEuMCIsIkd1aWQiOiJlYjU4YWJiYi4zNjQxIn0.eyJ1c2VySW5mbyI6IntcIlVzZXJQaG9uZVwiOlwiMTM4MDAwMDAwMDBcIixcIlVzZXJOdW1cIjoxMDAwMDY1NCxcIlVzZXJOYW1lXCI6XCLmjIfmjKXkuK3lv4NcIixcIkRlcGFydENvZGVcIjoxMDcsXCJEZXBhcnROYW1lXCI6XCLlubPlj7DnrqHnkIZcIixcIlByb3h5VXNlck51bVwiOi0xLFwiUHJveHlVc2VyTmFtZVwiOlwiXCJ9Iiwicm9sZXMiOiJEZWZhdWx0IiwiZXhwVGltZSI6NjM3NjgwOTUzNTAwNjMyNzM1LCJ0aW1lb3V0Ijo2MCwiY2xpZW50SWQiOm51bGwsImFwcEd1aWQiOm51bGx9.2-BPMM4kwlNwn93olFg3jtqXWbkKlWom4IJ7-DV3O_8; path=/' // 让每个请求携带自定义token 请根据实际情况自行修改
    // 督察系统接口 每个请求携带WorkPlan----当前的任务类型
    if (config.url?.includes('/api/dcdb/') || config.baseURL === '/api/dcdb') {
      const taskType = cookies.getTaskType()
      config.headers['WorkPlan'] = taskType?.keyTypeCode
    }
  }
  if (config.method === 'get') {
    config.paramsSerializer = function(params: any) {
      return QS.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}

const response_res = (res: any) => {
  const code = res.status
  if (code !== 200) {
    Vue.prototype.$message.success(res.statusText)
    return res
  } else {
    return res
  }
}

const response_error = (error: any) => {
  messageError = Vue.prototype.$message.warning
  if (!error.message.includes('timeout')) statusHandler(error) || typeHandler(error)
  return Promise.reject(error)
}

request.interceptors.request.use(
  config => {
    openLoading()
    return request_config(config)
  },
  error => {
    closeLoading()
    Promise.reject(error)
  }
)

request.interceptors.response.use(
  (res: any) => {
    closeLoading()
    return response_res(res)
  },
  error => {
    closeLoading()
    return response_error(error)
  }
)

/** 文件过大时，转化成pdf速度慢，从而加长请求时长 */
pdf_preview_request.interceptors.request.use(
  config => {
    openLoading()
    return request_config(config)
  },
  error => {
    closeLoading()
    Promise.reject(error)
  }
)

pdf_preview_request.interceptors.response.use(
  (res: any) => {
    closeLoading()
    return response_res(res)
  },
  error => {
    closeLoading()
    return response_error(error)
  }
)

request_noLoading.interceptors.request.use(request_config, error => Promise.reject(error))
request_noLoading.interceptors.response.use(response_res, response_error)

export { request, request_noLoading, pdf_preview_request }
