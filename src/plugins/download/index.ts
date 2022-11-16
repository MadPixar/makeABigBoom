import vue from 'vue'
import Download from '@/components/Download/index.vue'
export default {
  /**
   * @param {Object} Vue - Vue类
   * @param {Object} [downloadOptions] - 插件安装配 置
   */
  install(Vue: typeof vue) {
    const downloadComp: any = new Download()
    downloadComp.filename = ''
    const ele = downloadComp.$mount().$el
    document.body.appendChild(ele)
    function download(filename: string, data: Blob) {
      if (!filename) return
      downloadComp.filename = filename
      downloadComp.data = data
    }

    Vue.prototype.$download = download
  }
}
