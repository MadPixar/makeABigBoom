/*
 * @Descripttion: 
 * @version: 
 * @Author: liuC
 * @Date: 2022-08-10 19:23:25
 * @LastEditors: liuC
 * @LastEditTime: 2022-08-10 19:25:53
 */
import axios from 'axios'
import { cookies } from '@/utils'

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
}

const baseUrl = process.env.VUE_APP_BASE_API
export function downLoadZip(str, filename) {
  var url = baseUrl + str
  axios({
    method: 'get',
    url: url,
    responseType: 'blob',
    headers: { 'Authorization': 'Bearer ' + cookies.getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  }).catch(e=>{
    console.info('eeeee-->',e)
  })
  
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a')

  var blob = new Blob([res.data], { type: mimeType })
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var fileName = result[1]
  if (!!window.ActiveXObjec || 'ActiveXObject' in window) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  }else{
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;

  const url = window.URL || window.webkitURL || window.moxURL
  fileName = fileName.replace(/"/g, '')
  aLink.href = url.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  url.revokeObjectURL(aLink.href)
  // document.body.appendChild(aLink)
  }
}

/**
 * 新解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function newResolveBlob(blob, fileName) {
  const aLink = document.createElement('a')
  if (!!window.ActiveXObjec || 'ActiveXObject' in window) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    const url = window.URL || window.webkitURL || window.moxURL
    fileName = fileName.replace(/"/g, '')
    aLink.href = url.createObjectURL(blob)
    aLink.setAttribute('download', fileName) // 设置下载文件名称
    document.body.appendChild(aLink)
    aLink.click()
    url.revokeObjectURL(aLink.href)
  // document.body.appendChild(aLink)
  }
}
