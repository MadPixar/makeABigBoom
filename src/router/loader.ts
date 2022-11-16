/*
 * @Descripttion:
 * @version:
 * @Author: liuC
 * @Date: 2022-05-17 18:14:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-19 08:41:01
 */
//moudles下面的一级组件
// const modules = require.context('../modules/', true, /^\.\/\w+\/index\.ts$/)
// //moudles下面的大行政的组件
// const xingzheng = require.context('../modules/xingzheng', true, /^\.\/\w+\/index\.ts$/)
// //moudles下面的大地矿的组件
// const files3 = require.context('../modules/dikuang', true, /^\.\/\w+\/index\.ts$/)
// //moudles下面的大规划的组件
// const files4 = require.context('../modules/guihua', true, /^\.\/\w+\/index\.ts$/)
// //moudles下面的大监测的组件
// const files5 = require.context('../modules/jiance', true, /^\.\/\w+\/index\.ts$/)
// //moudles下面的驾驶舱的组件
// const files6 = require.context('../modules/jiashicang', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大土地的组件
// const files7 = require.context('../modules/tudi', true, /^\.\/\w+\/index\.ts$/)
// //moudles下面的大执法的组件
// const files8 = require.context('../modules/zhifa', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的大资产的组件
// const files9 = require.context('../modules/zichan', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的批后监管的组件
const files11 = require.context('../modules/phjg', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的建设用地指标库的组件
// const tudi_zbk = require.context('../modules/zbk', true, /^\.\/\w+\/index\.ts$/)
//moudles下面的土地资系统的组件
// const tudi_sub = require.context('../modules/tudi-sub', true, /^\.\/\w+\/index\.ts$/)
// //督察系统
// const ducha = require.context('../modules/ducha', true, /^\.\/\w+\/index\.ts$/)
// // 执法系统
// const zhifa = require.context('../modules/zhifa-new', true, /^\.\/\w+\/index\.ts$/)
// const stxf = require.context('../modules/stxf', true, /^\.\/\w+\/index\.ts$/)

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

export default Object.assign(
  {},
  // dealFiles(modules),
  // dealFiles(xingzheng),
  // dealFiles(files3),
  // dealFiles(files4),
  // dealFiles(files5),
  // dealFiles(files6),
  // dealFiles(files7),
  // dealFiles(files8),
  // dealFiles(files9),
  dealFiles(files11)
  // dealFiles(tudi_zbk),
  // dealFiles(tudi_sub),
  // dealFiles(ducha),
  // dealFiles(zhifa)
  // dealFiles(stxf)
)
