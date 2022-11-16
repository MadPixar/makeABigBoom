

/* eslint-disable */
/** 改文件夹记录调取原生的方法或者提供给原生的方法 */

const creatBridge = ({ funName = '', params = {} }: { funName: string; params: { [props: string]: any } }) => {
  return (window as any).WebViewJavascriptBridge?.callHandler(funName, params, (...data: any) => {
    return new Promise((resolve) => {
      resolve(data)
    })
  })
}

/** 打开一个新的h5容器 */
export const startNewWebView = (params: { url: string }) => {
  // window.WebViewJavascriptBridge?.callHandler('openNewPage', params, () => {})
  return creatBridge({ funName: 'openNewPage', params })
}

/** 关闭当前h5容器 */
export const closeWebView = (params = {}) => {
  return creatBridge({ funName: 'finishPage', params })
}

/** 保存快捷入口 */
export const saveShortcut = (params = {}) => {
  return creatBridge({ funName: 'saveShortcut', params })
}

/** 点击附件下载后，调至原生文件管理中心 */
export const downloadFile = (params: { url: string; name: string; fileLinkId: any; signature: string }) => {
  return creatBridge({ funName: 'downloadFile', params })
}

/** 跳转至APP主页 */
export const goMainPage = (params = {}) => {
  return creatBridge({ funName: 'goMainPage', params })
}

/** 登录过期跳转到登录页面 */
export const loginExpired = (params = {}) => {
  return creatBridge({ funName: 'loginExpired', params })
}

//定义一个桥梁，提供h5的方法给原生调用
const methodsName: { [props: string]: Function } = {}
const connectWebViewJavascriptBridge = (callback: any) => {
  if ((window as any).WebViewJavascriptBridge) {
    callback((window as any).WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function () {
        callback((window as any).WebViewJavascriptBridge)
      },
      false
    )
  }
}
export const funForWebView = (funName: string, cb: (data: string, responseCallback: any) => void) => {
  if (methodsName.funName === undefined) methodsName[funName] = cb
  connectWebViewJavascriptBridge((bridge: { init: Function; [props: string]: any }) => {
    if (bridge.init) {
      bridge.init()
      for (const method in methodsName) {
        bridge.registerHandler(method, methodsName[method])
      }
    }
  })
}
