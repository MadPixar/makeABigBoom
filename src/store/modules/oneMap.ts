import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { OneMapApi } from '@/modules/onemap/api/onemap'
import store from '@/store'

export interface IOneMap {
  olMap: any
  initData: any
  currentXzqCode: string
  selectXzqCode: string
  icMapParams: any
}

@Module({ dynamic: true, store, name: 'OneMapModule' })
class OneMap extends VuexModule implements IOneMap {
  public olMap: any = null

  public initData: any = null

  public currentXzqCode = '430000'

  public selectXzqCode = ''

  public treeList = ''

  /* 独立坐标底图参数*/
  public icMapParams: any = {}


  @Mutation
  private setMap(data: any) {
    this.olMap = data
  }

  @Mutation
  private setIcMapParams(data: any) {
    this.icMapParams = data
  }

  @Mutation
  private setCurrentXzqCode(code: string) {
    this.currentXzqCode = code
  }

  @Mutation
  private setSelectXzqCode(code: string) {
    this.selectXzqCode = code
  }

  @Mutation
  private setTreeList(treeList: any) {
    this.treeList = treeList
  }

  @Mutation
  private setInitData(data: any) {
    this.initData = data
  }

  @Action
  public getInitConfig() {
    
    OneMapApi.getInitConfig(this.currentXzqCode).then((res:any)=>{
      OneMapApi.getXzqByCode(this.currentXzqCode).then((res2: any) => {
        const initInfo = res.data
        const initConfig = initInfo.initConfig
        this.setInitData(initInfo)

        const icMapParams = {
          center: initConfig.center.split(',').map((item: any) => {
            return parseFloat(item)
          }),
          resolutions: initConfig.resolutions,
          resolution: parseFloat(initConfig.resolution),
          projection: initConfig.projectionCode,
          image: initConfig.baseImage.split(','),
          map: initConfig.baseMap.split(','),
          activeName: initConfig.baseLayer === 0 ? 'image' : 'map',
          mask: res2.data.wkt,
          coordPositionOptions: { data: [] }
        }

        this.setIcMapParams(icMapParams)

        const treeList: any = {}
        initInfo.treeList.forEach((item: any) => {
          treeList[item.nodeId] = item
        })
        this.setTreeList(treeList)
        this.setSelectXzqCode(this.currentXzqCode)

        if (initInfo.xzqList) {
          const regionNav = initInfo.xzqList.map((item: any) => {
            return {
              ...item,
              parentCode: item.pcode
            }
          })
          initInfo.xzqList = regionNav
        }
      })
    })
  }
}

export const OneMapModule = getModule(OneMap)
