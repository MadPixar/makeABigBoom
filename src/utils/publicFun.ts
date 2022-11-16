import Vue from 'vue'
import { request } from '@/utils'
import Message from '@/utils/message'
import dayjs from 'dayjs'
// 导出数据 url 参数  文件名
const exportFun = (res: any, fileName?: string) => {
  try {
    const blob = new Blob([res.data], { type: res.headers['content-type'] })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName ? fileName + '.xlsx' : decodeURI(res.headers['content-disposition'].split('=')[1])
    link.click()
    window.URL.revokeObjectURL(link.href)
  } catch {
    Message.warning({ message: '操作失败' })
  }
}
// get 导出
Vue.prototype.$getExport = function(url: string, params: any, fileName?: string) {
  const baseUrl = process.env.VUE_APP_BASIC_URL
  request
    .get(baseUrl + url, {
      params: params,
      responseType: 'arraybuffer',
      timeout: 60 * 1000
    })
    .then((res: any) => {
      exportFun(res, fileName)
    })
    .catch(() => {})
}
// post 导出
Vue.prototype.$postExport = function(url: string, params: any, fileName?: string) {
  const baseUrl = process.env.VUE_APP_BASIC_URL
  request
    .post(baseUrl + url, params, {
      responseType: 'arraybuffer',
      timeout: 60 * 1000
    })
    .then((res: any) => {
      exportFun(res, fileName)
    })
    .catch(() => {})
}

//获取本周1 本月2 本季度3 本年4
export const PublicFun = {
  getQueryTime(type: number) {
    let startTime: any = ''
    let endTime: any = ''
    if (type === 1) {
      //本周
      startTime = dayjs()
        .startOf('week')
        .add(1, 'day')
        .format('YYYY-MM-DD')
      endTime = dayjs()
        .endOf('week')
        .add(1, 'day')
        .format('YYYY-MM-DD')
    } else if (type === 2) {
      // 本月
      startTime = dayjs()
        .startOf('month')
        .format('YYYY-MM-DD')
      endTime = dayjs()
        .endOf('month')
        .format('YYYY-MM-DD')
    } else if (type === 3) {
      // 本季度
      const curMonth = dayjs().month() + 1
      if (curMonth < 3) {
        startTime = dayjs()
          .month(0)
          .format('YYYY-MM-DD')
        endTime = dayjs()
          .month(2)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else if (curMonth < 6) {
        startTime = dayjs()
          .month(3)
          .format('YYYY-MM-DD')
        endTime = dayjs()
          .month(5)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else if (curMonth < 9) {
        startTime = dayjs()
          .month(6)
          .format('YYYY-MM-DD')
        endTime = dayjs()
          .month(8)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else if (curMonth < 12) {
        startTime = dayjs()
          .month(9)
          .format('YYYY-MM-DD')
        endTime = dayjs()
          .month(11)
          .endOf('month')
          .format('YYYY-MM-DD')
      }
    } else if (type === 4) {
      // 本年
      startTime = dayjs()
        .startOf('year')
        .format('YYYY-MM-DD')
      endTime = dayjs()
        .endOf('year')
        .format('YYYY-MM-DD')
    }
    return {
      startTime: startTime,
      endTime: endTime
    }
  }
}
