import Platform from '@/platform-config'
import Prjform from '@/prj-config'
// 根据每个页面的systemId来筛选数据.
//top:如果在上面的配置文件中,未找到匹配的,则默认显示 'op/views/handle/components/top/default-top';
//content:根据systemId筛选出符合要求的contents数组,如果没有,案卷详情页面就没有单选框.默认显示表单页面.
export const getOptions = (sysCode: any) => {
  const routeObj = Platform.op.page_ext.find((item: any) => item.systemCode === sysCode)
  if (routeObj) {
    if (routeObj.mode === 'standalone') {
      return {
        aloneFlag: true,
        path: routeObj.route
      }
    } else {
      return {
        aloneFlag: false,
        top: routeObj.area[0].top || 'op/views/handle/components/top/default-top',
        content: routeObj.area[1] ? routeObj.area[1].content : []
      }
    }
  } else {
    return {
      aloneFlag: false,
      top: { name: 'top', route: 'op/views/handle/components/top/default-top' },
      content: []
    }
  }
}
export const getPrjOptions = (sysCode: any) => {
  const routeObj = Prjform.op.page_ext.find((item: any) => item.systemCode === sysCode)
  return routeObj ? routeObj.area || [] : []
}
