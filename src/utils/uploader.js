/* eslint-disable */
import SparkMD5 from 'spark-md5'
export const type = data =>
  Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()
export const isFunction = data => type(data) === 'function'
export const isArray = data => type(data) === 'array'

const defaultOptions = {
  chunkSize: 2 * 1024 * 1024,
  beforeUpload: (...args) => Promise.resolve(...args),
  chunkUploadFilter: () => false,
  fileUploadFilter: () => false,
  success: (...args) => args,
  error: (...args) => args,
  chunkProgress: (...args) => args,
  uploadProgress: (...args) => args
}
export class Uploader {
  constructor(options) {
    const params = Object.assign({}, defaultOptions, options)
    const {
      files,
      chunkSize,
      beforeUpload,
      chunkUploadFilter,
      fileUploadFilter,
      upload,
      success,
      error,
      chunkProgress,
      uploadProgress
    } = params
    // 文件为空
    if (!files || !isArray(files) || !files.length) return
    // 文件上传函数有问题
    if (!upload || !isFunction(upload)) return
    this.files = files
    this.chunkSize = chunkSize
    this.beforeUpload = beforeUpload
    this.chunkUploadFilter = chunkUploadFilter // 切片上传的拦截函数，返回true，停止当前切片上传
    this.fileUploadFilter = fileUploadFilter // 文件上传的拦截函数，返回true，停止上传
    this.upload = upload // 文件上传函数
    this.success = success
    this.error = error
    this.chunkProgress = chunkProgress
    this.uploadProgress = uploadProgress
    // Object.entries(params).forEach(([key,val])=>{
    //   this[key] = val
    // })
    this.beforeUploadData = {}
    return this.init()
  }

  init() {
    return this.uploadFiles(this.files)
  }
  chunkFile(file) {
    return new Promise((resolve, reject) => {
      const self = this
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      const fileSize = file.size
      const fileType = file.type
      const webkitRelativePath = file.webkitRelativePath
      const chunksTotal = Math.ceil(fileSize / this.chunkSize)
      let currentChunk = 0
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      const fileChunks = []

      fileReader.onload = function(e) {
        spark.append(e.target.result)
        currentChunk++
        // self.chunkProgress(currentChunk,chunksTotal)
        self.chunkProgress(file, currentChunk, chunksTotal)
        // 如果存在 onSliceProgress 函数，返回当前切片百分比的数值
        if (currentChunk < chunksTotal) {
          loadNext()
        } else {
          resolve({ fileChunks, fileHash: spark.end() })
        }
      }
      fileReader.onerror = function() {
        reject()
      }

      function loadNext() {
        const start = currentChunk * self.chunkSize
        const currentEnd = start + self.chunkSize
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
  uploadFile(file) {
    return new Promise(async (resolve, reject) => {
      try {
        const { fileChunks, fileHash } = await this.chunkFile(file)

        // 一个文件的多个chunk上传，只需要关注一个data就可以了
        let data = null
        for (let idx = 0, len = fileChunks.length; idx < len; idx++) {
          const item = fileChunks[idx]

          data = await this.upload({ ...item, fileHash }, this.beforeUploadData)
          // 上传每一个文件chunk的拦截器
          if (this.chunkUploadFilter(data)) break
        }
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }
  uploadFiles(files) {
    return new Promise(async (resolve, reject) => {
      try {
        // 多个文件上传，返回多个文件上传的结果
        this.beforeUploadData = (await this.beforeUpload()) || {}
        let res = []
        for (let idx = 0, len = files.length; idx < len; idx++) {
          const file = files[idx]
          const data = await this.uploadFile(file)
          // 上传文件的拦截器
          res.push(data)
          if (this.fileUploadFilter(data)) break
        }
        this.success(res)
        resolve(res)
      } catch (error) {
        this.error()
        reject(error)
      }
    })
  }
}
