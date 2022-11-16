// import Cookies from 'js-cookie'
const tokenKey = 'business_access_token'
const tagViews = 'localTagViews'
const taskTypeKey = 'business_access_dc_task_type'
const expirseTime = 7 * 24 * 3600 * 1000
const mobileToken = 'token'

const cookies = {
  // 进行系统对接时  外部系统使用iframe内嵌方式 操作不了我们cookie
  getToken: () => sessionStorage.getItem(mobileToken) || sessionStorage.getItem(tokenKey),
  setToken: (token: string) => sessionStorage.setItem(tokenKey, token),
  removeToken: () => sessionStorage.removeItem(tokenKey),
  // getToken: () => Cookies.get(mobileToken) || Cookies.get(tokenKey),
  // setToken: (token: string) => Cookies.set(tokenKey, token),
  // removeToken: () => Cookies.remove(tokenKey),
  // 将tabgs-view本地缓存
  setTagViews: (route: string) => sessionStorage.setItem(tagViews, route),
  getTagViews: () => sessionStorage.getItem(tagViews),
  // 督察任务类型设置  {opTypeName，keyTypeCode}
  getTaskType: () => {
    return cookies.getLocalParams(taskTypeKey)
  },
  setTaskType: (taskType: any) => {
    cookies.setLocalParams(taskTypeKey, taskType)
  },
  removeTaskType: () => {
    cookies.removeLocalParams(taskTypeKey)
  },

  /**
   * 储存或者拉取数据,并让该数据localStorage中的数据x时间后过期过期
   * key:属性名
   * value:属性值
   * expirseTime:过期时间
   */
  setLocalParams: (key: string, value: any) => {
    const data = { value: value, expirse: new Date().getTime() + expirseTime }
    localStorage.setItem(key, JSON.stringify(data))
  },
  getLocalParams: (key: string) => {
    const data = localStorage.getItem(key) && JSON.parse(localStorage.getItem(key) as string)
    if (data !== null) {
      if (data.expirse !== null && data.expirse < new Date().getTime()) {
        localStorage.removeItem(key)
      } else {
        return data.value
      }
    }
    return null
  },
  removeLocalParams: (key: string) => localStorage.removeItem(key),
  setCookie(c_name: any, value: any, expire: any) {
    const date = new Date()
    date.setSeconds(date.getSeconds() + expire)
    document.cookie = c_name + '=' + escape(value) + '; expires='
  }
}
export { cookies }
