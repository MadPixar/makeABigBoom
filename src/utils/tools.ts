/**
 * 通用方法封装处理
 */
import { SettingsModule } from '@/store/modules/settings'
import { fldDataTypeEnum } from '@/utils/constant'
import dayjs from 'dayjs'
import Vue from 'vue'
interface IloadingText {
  text: string | null
}
let idx = -1
export const toolsFunc = {
  // 设施农用地移动过来方法
  parseTime(time: any, pattern: string) {
    const date = new Date(time)
    const Y = date.getFullYear()
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    if (pattern === 'yy-MM-dd hh:mm:ss') {
      return Y + '-' + M + '-' + D + h + m + s
    } else if (pattern === 'yy-MM-dd hh:mm') {
      return Y + '-' + M + '-' + D + h + m
    } else if (pattern === 'yy-MM-dd') {
      return Y + '-' + M + '-' + D
    } else if (pattern === '年月') {
      return `${Y}年${M}月`
    }
  },
  numFormat(num: any) {
    return num
  },
  toThousands(num: any) {
    let result = ''
    let counter = 0
    num = (num || 0).toString()
    for (let i = num.length - 1; i >= 0; i--) {
      counter++
      result = num.charAt(i) + result

      if (!(counter % 3) && i !== 0) {
        if (/^\.\d{2}$/g.test(result)) {
        } else {
          result = ',' + result
        }
      }
    }
    return result
  },
  // 判断是不是网页图标
  /**
   * @param {string} path
   * @returns {Boolean}
   */

  isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
  },
  // table组件搜索高亮
  highLight(val: string, search: string) {
    val = val + ''
    if (search !== '' && val.indexOf(search) !== -1) {
      return val.replace(search, '<font color="#ff5252">' + search + '</font>')
    }
    return val
  },
  // 通过搜索字符串，筛选原始的table数据
  filterTableData(search: string, tableData: any) {
    if (search) {
      return tableData.filter((dataNews: any) => {
        return Object.keys(dataNews).some(key => {
          return (
            String(dataNews[key])
              .toLowerCase()
              .indexOf(search) > -1
          )
        })
      })
    }
    return tableData
  },
  hasClass(ele: HTMLElement, className: string) {
    return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  },
  // 给元素添加类名
  addClass(ele: HTMLElement, className: string) {
    if (!this.hasClass(ele, className)) ele.className += ' ' + className
  },

  // 去除类名
  removeClass(ele: HTMLElement, className: string) {
    if (this.hasClass(ele, className)) {
      const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
  },
  // 打开全局loading
  openLoading(params?: IloadingText) {
    idx++
    if (idx > 0) return
    const { text } = { ...params }
    if (text) {
      SettingsModule.ChangeSetting({ key: 'loadingText', value: text })
      SettingsModule.ChangeSetting({ key: 'loading', value: true })
    } else {
      SettingsModule.ChangeSetting({ key: 'loading', value: true })
    }
  },
  // 关闭全局loading
  closeLoading() {
    idx--
    if (idx <= -1) SettingsModule.ChangeSetting({ key: 'loading', value: false })
  },
  //format不同文件icon-class
  formatIconClass(label: string, prefix = 'icc-files-') {
    if (!label) return
    const suffix = label.replace(/.*\./g, '')
    const iconMap: any = {
      jpg: 'img',
      png: 'img',
      txt: 'text',
      doc: 'doc',
      docx: 'doc',
      zip: 'zip',
      rar: 'zip',
      xls: 'xls',
      xlsx: 'xls',
      ppt: 'ppt',
      pptx: 'ppt',
      pdf: 'pdf',
      dwg: 'dwg',
      mp3: 'mp3',
      iso: 'iso',
      mp4: 'vedio'
    }
    return prefix + (iconMap[suffix] || 'unkown')
  },
  //获取input类型
  getType(item: any, fieldName = 'fldDataType') {
    let type = ''
    switch (Number(item[fieldName])) {
      case fldDataTypeEnum.INT:
      case fldDataTypeEnum.NUMBERIC:
      case fldDataTypeEnum.BOOLEAN:
        type = 'number'
        break
      case fldDataTypeEnum.DATE:
        type = 'date'
        break
      case fldDataTypeEnum.DATETIME:
        type = 'datetime-local'
        break
      case fldDataTypeEnum.TIME:
        type = 'time'
        break
      case fldDataTypeEnum.IMAGE:
        type = 'image'
        break
      default:
        type = 'text'
        break
    }
    return type
  },
  //防抖
  debounce(fn: any, delay = 1000, immediate = false) {
    let timer: any = null
    return (...rest: any[]) => {
      if (timer) {
        clearTimeout(timer)
      }
      if (immediate) {
        const callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, delay)
        if (callNow) {
          fn.apply(this, rest)
        }
      } else {
        timer = setTimeout(() => {
          fn.apply(this, rest)
        }, delay)
      }
    }
  },
  //节流
  throttle(fn: any, delay = 1000, immediate = false) {
    let timer: any
    return (...rest: any[]) => {
      if (immediate) {
        fn.apply(this, rest)
        setTimeout(() => {
          timer = null
          fn.apply(this, rest)
        }, delay)
      }
      if (!timer) {
        setTimeout(() => {
          timer = null
          fn.apply(this, rest)
        }, delay)
      }
    }
  },
  // 生成随机hash
  createHash(hashLength: number) {
    if (!hashLength || typeof Number(hashLength) !== 'number') {
      return
    }
    const ar = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ]
    const hs: string[] = []
    const hl = Number(hashLength)
    const al = ar.length
    for (let i = 0; i < hl; i++) {
      hs.push(ar[Math.floor(Math.random() * al)])
    }
    return hs.join('')
  },
  // 判断当前电脑平台是否为windows
  isWin() {
    return window.navigator.userAgent.includes('Windows')
  },
  // 根据表单数据，将下拉框、时间类型数字转为可视化的值
  /**
   *
   * @param val 需转换的值
   * @param widget 表单字段的信息
   * @returns
   */
  transferContent(val: any, widget: { type: string; options: any;[props: string]: any }): string | string[] {
    if (val === undefined || val === null || val === 'null') {
      return ''
    } else if (val.includes('[') && widget.type !== 'blank') {
      const firstIndex = val.indexOf('[')
      const lastIndex = val.indexOf(']')
      return val.substring(firstIndex + 1, lastIndex)
    } else {
      switch (widget.type) {
        case 'select':
          const selectValue = JSON.parse(val)
          let sValue = ''
          selectValue.forEach((item: any) => {
            sValue += item.displayValue + '|'
          })
          if (sValue) sValue.slice(sValue.length - 1, 1)
          if (widget.options.multiple) return sValue.split('|')
          return sValue
        case 'date':
        case 'time':
        case 'dateTime':
          let value = ''
          if (val !== undefined && dayjs(val).isValid()) value = dayjs(val).format(widget.options.format)
          return value
        default:
          return val
      }
    }
  },
  // 处理各模块单个控件的历史记录
  getFieldHistoryLogs(
    formLogs: { [props: string]: any },
    widget: { type: string; options: any;[props: string]: any }
  ) {
    const curLogs: any[] = []
    // 将日志倒叙排列
    const times = Object.keys({ ...formLogs })
    times.sort((firstTime: string, secondTime: string) => {
      return new Date(secondTime).getTime() - new Date(firstTime).getTime()
    })
    times.forEach(time => {
      formLogs[time]?.forEach((item: any) => {
        if (item.fieldId === widget.model) {
          const log = {
            name: item.userName,
            value: toolsFunc.transferContent(item.fieldVal, widget),
            modifyTime: item.modifyTime
          }
          curLogs.push(log)
        }
      })
    })
    return curLogs
  },
  // 根据modelKey调整到详情页
  goModelDetails(source: string, params: { moduleKey: string;[props: string]: any }) {
    switch (source) {
      case 'message':
        Vue.prototype.$opener('message', { ...params })
        break
      case 'doc':
        Vue.prototype.$opener('doc', { ...params })
        break
      case 'op':
        Vue.prototype.$opener('op', { ...params })
        break
      case 'process':
        Vue.prototype.$opener('process', { ...params })
        break
      case 'supervise':
        Vue.prototype.$opener('supervise', { ...params })
        break
      case 'tz':
        Vue.prototype.$opener('tz', { ...params })
        break
      case 'meeting':
        Vue.prototype.$opener('meeting', { ...params })
        break
      default:
        break
    }
  },
  // 获取最近n年
  getLastYears(num: number) {
    const years: string[] = []
    let i = 0
    while (i < num) {
      years.push(String(dayjs().year() - i))
      i++
    }
    return years
  },
  // 是否为数字
  isNumber(num: string) {
    if (!/^[-0-9][0-9]*(.[0-9]+)$/.test(num)) {
      return false
    }
    return true
  },
  // 数字转化千分符
  toFormatterNumber(value: number | string, { len = 3, connectSep = '', isDecimal = true } = {}) {
    const newValue = isDecimal ? (+value).toFixed(4).toString() : value + ''
    if (+newValue < 1000) {
      return connectSep + newValue
    }
    if (!this.isNumber('' + newValue)) {
      return ''
    }
    const integer = newValue.split('.')[0]
    const decimal = newValue.indexOf('.') > -1 ? '.' + newValue.split('.')[1] : ''

    let price = (integer || 0).toString()
    let result = ''
    while (price.length > len) {
      result = ',' + price.slice(-len) + result
      price = price.slice(0, price.length - len)
    }
    return connectSep + price + result + decimal
  },
  // el-table 自定义合计列
  getTableColumnTotal(params: { columns: any[]; data: any[] }, prop: string[]) {
    const { data, columns } = params
    const sums: any[] = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '合计'
        return
      }
      const values = data.map(item => Number(item[column.property]))
      if (prop.includes(column.property)) {
        sums[index] = this.toFormatterNumber(values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0).toFixed(4))
        sums[index]
      } else {
        sums[index] = ''
      }
    })
    return sums
  }
}
