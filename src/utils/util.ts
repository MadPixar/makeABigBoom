import _get from 'lodash.get'
import _cloneDeep from 'lodash.clonedeep'
import _debounce from 'lodash.debounce'
import _throttle from 'lodash.throttle'
import Vue from 'vue'
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
import dayjs from 'dayjs'
import SparkMD5 from 'spark-md5'
import { GlobFunc } from '@/store/modules/globalFunc'

const Buffer = require('buffer/').Buffer

const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCyUq0IkCuKHrVAPG+1o0yUmtSi
3P6CqavMO7y0Gah6hy0sotoGSq+4T4hDu4IHQFQMZ++3VnMwtlu6DV/g4laKFli0
MDmbijvOM8ILURDFQGCXRHByU31+DYTIVcrndrWKTmgk/ZKJ+1GMwemDOl3esyQ7
SMcMm6ydesc2SGxxaQIDAQAB`

const privateKey = `MIICXAIBAAKBgQCyUq0IkCuKHrVAPG+1o0yUmtSi3P6CqavMO7y0Gah6hy0sotoG
Sq+4T4hDu4IHQFQMZ++3VnMwtlu6DV/g4laKFli0MDmbijvOM8ILURDFQGCXRHBy
U31+DYTIVcrndrWKTmgk/ZKJ+1GMwemDOl3esyQ7SMcMm6ydesc2SGxxaQIDAQAB
AoGAV4DIVd5g7xrYeBfv/SKPrpA3bV+iKD3YBpT9qSa6DL4ORcv3zoSRq5CjXhFB
4gsH8zqBX+a1CZ9CbY6okLKgIbrN2lJlSYSOC/cFmVsItxg/5yIzOK2GFQOxBeXv
kTZVOKWPfHPWjO3jy7QhVV1R8I7B60Bt3FNTYBJceH++zYECQQDacXaTKs9u3qY2
/13J33Mnwy236bL1/P16ggnks+lCYN6yde3PFUCaZw9RTs7ceaxX8v2wlzGf+rVp
uM30Kf65AkEA0PtdGmHZbQysBM3RyGuEu5rkzLl6/K5ThRqAS30qBP6WE/Dct2zL
YItFNz++m03G7rIUkk+s3ejKZm+KwaAwMQJBAMAJxdOFbE0s4fUxtTM3BRasyPGJ
O3J0Uic0URxFakiXvtAnSsSmC2ByQA4b+VHsia3cClkH4nGhR4FFHZKMpMkCQGIR
MvWIaWGVCrwOYZ1tZxIqc6fmemJM5ACYGRBTof5KAd9Fri2dLisV79snXKjAbNPi
WWj3XqWb8i7ztOd75mECQHIGEDu7/lJ2mSEodWBlrw8a05NaueJqRm/xizg+5fjw
AcsWhmDAQvBEvnhPiZWdzXOyBFy47ZcS+hGkvq3r+oY=`

export interface ITree {
  id: string
  label: string
  children?: ITree[]
  [propName: string]: any
}
/**
 * lodash.get方法
 */
export const get = _get

/**
 * lodash.cloneDeep方法
 */
export const cloneDeep = _cloneDeep

/**
 *  递归遍历树结构数组
 * @param data 每一个节点,包含id,label,其它可选
 * @param cb 递归遍历回调函数,参数为当前节点
 */
export const recursionTree = (data: ITree[], cb: (node: ITree) => void) =>
  data &&
  data.map(item => {
    cb(item)
    item.children && recursionTree(item.children, cb)
    return item
  })

const _guid = (): (() => string) => {
  let _index = 0
  return () => Math.random().toString(32) + _index++
}

/**
 * 返回字符串类型的唯一id
 */
export const guid = _guid()

/**
 * console.log添加红色信息
 * @param args 字符串
 */
export const log = (...args: any[]) => {
  const [info, ...other] = args
}

export const isProduction = (process.env.NODE_ENV || '').toLowerCase() === 'production'

export const bus = new Vue()
/**
 * lodash节流函数
 */
export const debounce = _debounce
/**
 * lodash防抖函数
 */
export const throttle = _throttle
/**
 * 对象重新赋值,浅
 */
export const reWrite = (origin: any, target: any) => {
  for (const i in target) {
    origin[i] = target[i]
  }
}
/**
 * 获取basic auth
 */
const ENCODING = 'base64'
const base64 = (str: string) => {
  return new Buffer(str).toString(ENCODING)
}
export const getBasicToken = ({ username: user, password: pass }: any) => {
  return base64([user, pass].join(':'))
}

// 加密
export const encrypt = (txt: string) => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export const decrypt = (txt: string) => {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

/**根据dayJs编辑时间工具
 * 如下格式不满足你的要求，请直接在formatMap中加入你的的方法名及对应的时间格式即可
 */
export const formatMap = {
  dateTime: 'YYYY-MM-DD HH:mm',
  date: 'YYYY-MM-DD',
  yearMonth: 'YYYY-MM',
  time: 'HH:mm',
  zhDate: 'YYYY年MM月DD日',
  zhYearMonth: 'YYYY年MM月',
  startOfDay: 'YYYY-MM-DD 00:00:00',
  endOfDay: 'YYYY-MM-DD 23:59:59',
  halfOfDay: 'YYYY-MM-DD 12:00',
  onWork: 'YYYY-MM-DD 9:00',
  offWork: 'YYYY-MM-DD 17:30'
}
export const format: any = (time: any) => {
  if (time !== undefined && dayjs(time).isValid()) {
    return dayjs(time).format(formatMap.dateTime)
  } else {
    return ''
  }
}
Object.entries(formatMap).forEach(item => {
  const funName = item[0]
  format[funName] = (time: any) => {
    if (dayjs(time).isValid() && time !== undefined) {
      return dayjs(time).format(item[1])
    } else {
      return ''
    }
  }
})

export const type = (data: any) =>
  Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()

export const filterObjectValid = (data: any) => {
  if (type(data) !== 'object') return data
  const res: any = {}
  for (const i in data) {
    if (!Object.prototype.hasOwnProperty.call(data, i)) continue
    if (type(data[i]) === 'object') {
      res[i] = filterObjectValid(data[i])
      continue
    }
    if (data[i] !== null && data[i] !== undefined) {
      res[i] = data[i]
    }
  }
  return res
}

/** 定义一工具,引入所有自定义组件 */
export const getCustomComs = () => {
  const path = require('path')
  const modules: { [props: string]: any } = {}
  const files = require.context('@/components/FormCustomComponents', false, /\.vue$/)
  files.keys().forEach(key => {
    const name = path.basename(key, '.vue')
    modules[name] = files(key).default.options || files(key).options
  })
  return modules
}
export const chunkFile = (file: any, chunkSize = 2 * 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice || (File.prototype as any).mozSlice || (File.prototype as any).webkitSlice
    const fileSize = file.size
    const fileType = file.type
    const webkitRelativePath = file.webkitRelativePath
    const chunksTotal = Math.ceil(fileSize / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    const fileChunks: any[] = []

    fileReader.onload = function (e: any) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunksTotal) {
        loadNext()
      } else {
        resolve({ fileChunks, fileHash: spark.end() })
      }
    }
    fileReader.onerror = function () {
      reject()
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const currentEnd = start + chunkSize
      const end = currentEnd >= fileSize ? fileSize : currentEnd
      const currentBlob = blobSlice.call(file, start, end)
      const targetFile = new File([currentBlob], file.name, {
        type: fileType
      })
      fileChunks.push({
        file: targetFile,
        chunkTotals: chunksTotal,
        chunkIndex: currentChunk,
        fileSize,
        webkitRelativePath
      })
      fileReader.readAsArrayBuffer(currentBlob)
    }
    loadNext()
  })
}

export const on = (function () {
  if (!document.addEventListener === false) {
    return function (element: any, event: any, handler: any, useCapture = false) {
      if (element && event && handler) {
        element.addEventListener(event, handler, useCapture)
      }
    }
  } else {
    return function (element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = (function () {
  if (!document.removeEventListener === false) {
    return function (element: any, event: any, handler: any, useCapture = false) {
      if (element && event) {
        element.removeEventListener(event, handler, useCapture)
      }
    }
  } else {
    return function (element: any, event: any, handler: any) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export function scrollTop(el: any, from = 0, to: any, duration = 500, endCallback: any) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  function scroll(start: any, end: any, step: any) {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

export function findComponentsDownward(context: any, componentName: any) {
  return context.$children.reduce((components: any, child: any) => {
    if (child.$options.name === componentName) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}

export const sharpMatcherRegx = /#([^#]+)$/

// 将关闭的页面的name和path从GlobFunc的nameWithRoute移除
export function removeVisitedPage({ path, removeAll = false }: { path?: any; removeAll?: boolean }) {
  if (removeAll) return GlobFunc.UPDATE_NAME_WITH_ROUTE({})
  const nameWithRoute = GlobFunc.nameWithRoute
  delete nameWithRoute[path]
  GlobFunc.UPDATE_NAME_WITH_ROUTE(nameWithRoute)
}
// 根据name判断某vue组件是否打开过
export function isVisitedPage(name: string) {
  return Object.values(GlobFunc.nameWithRoute).includes(name)
}

export const splitStringToArray = (str: string) => {
  const strs = []
  const dateStatus = str.substring(0, 2)
  const blStatus = str.substring(2, 4)
  const numStatus = str.substring(4)
  strs[0] = dateStatus
  strs[1] = blStatus
  strs[2] = numStatus
  return strs
}
