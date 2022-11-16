import { Message as _Message } from 'element-ui'
import Vue from 'vue'

export interface IMessage {
  (option: any): any
  success(option: any): any
  warning(option: any): any
  error(option: any): any
  info(option: any): any
  [propName: string]: any
}

const messageInstance = (fn: any) => {
  let res: any
  function message(list: any) {
    if (res) res.close()
    if (typeof list === 'string') list = { message: list }
    list = { ...list, showClose: true }
    res = fn.call(Vue.prototype, list)
    return res
  }
  ;['success', 'warning', 'info', 'error'].forEach(type => {
    ;(message as any)[type] = (options: any) => {
      if (!options) return
      if (typeof options === 'string') {
        options = {
          message: options
        }
      }
      options.type = type
      return message(options)
    }
  })
  return message
}

const Message = messageInstance(_Message) as IMessage

export default Message
