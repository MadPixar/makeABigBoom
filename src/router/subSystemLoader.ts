/*
 * @Descripttion: 
 * @version: 
 * @Author: liuC
 * @Date: 2022-05-17 18:14:26
 * @LastEditors: liuC
 * @LastEditTime: 2022-05-18 14:40:43
 */
//moudles下面的一级组件
const files1 = require.context('../modules/', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大行政的组件
const files2 = require.context('../modules/xingzheng', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大地矿的组件
const files3 = require.context('../modules/dikuang', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大规划的组件
const files4 = require.context('../modules/guihua', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大监测的组件
const files5 = require.context('../modules/jiance', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的驾驶舱的组件
const files6 = require.context('../modules/jiashicang', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大土地的组件
const files7 = require.context('../modules/tudi', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大执法的组件
const files8 = require.context('../modules/zhifa', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大资产的组件
const files9 = require.context('../modules/zichan', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的子系统的组件
// const files10 = require.context('../modules/subsystem', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的批后监管的组件
const files11 = require.context('../modules/phjg', true, /^\.\/\w+\/index\.ts$/)
//督察系统
const files12 = require.context('../modules/ducha', true, /^\.\/\w+\/index\.ts$/)
// 执法系统
const files13 = require.context('../modules/zhifa-new', true, /^\.\/\w+\/index\.ts$/)

interface Module {
  [prop: string]: Object
}
const dealFiles = (data: any) => {
  return data.keys().reduce((modules: Module, modulePath: string) => {
    const moduleName = modulePath.replace(/^\.\/(\w+)\/index\.ts$/, '$1')
    modules[moduleName] = data(modulePath)
    return modules
  }, {})
}

export default {
  ...dealFiles(files1),
  ...dealFiles(files2),
  ...dealFiles(files3),
  ...dealFiles(files4),
  ...dealFiles(files5),
  ...dealFiles(files6),
  ...dealFiles(files7),
  ...dealFiles(files8),
  ...dealFiles(files9),
  // ...dealFiles(files10)
  ...dealFiles(files11),
  ...dealFiles(files12),
  ...dealFiles(files13)
}
