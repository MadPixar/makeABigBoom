/*
 * @Descripttion: 
 * @version: 
 * @Author: liuC
 * @Date: 2022-08-09 15:07:16
 * @LastEditors: liuC
 * @LastEditTime: 2022-08-09 15:07:36
 */
export function setParam(key: any, params: any) {
    if (!key) { return }
    if (typeof (params) === 'object' && params !== null && sessionStorage) {
        sessionStorage.setItem(key, JSON.stringify(params))
    } else if (typeof (params) === 'undefined') {
        console.warn('参数为空')
    } else if (typeof (params) === 'number' || typeof (params) === 'string') {
        const param = { param: params }
        sessionStorage.setItem(key, JSON.stringify(param))
    } else {
        console.warn('参数格式不对')
    }
}
export function getParam(key: any) {
    const keyPath = key || window.location.pathname
    if (sessionStorage && sessionStorage.getItem(keyPath)) {
        return JSON.parse((sessionStorage.getItem(keyPath) as any))
    } else {
        return {}
    }
}
