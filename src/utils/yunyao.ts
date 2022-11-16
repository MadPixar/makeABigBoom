import { fromExtent } from 'ol/geom/Polygon'
import { getCenter } from 'ol/extent'
import axios from 'axios'
import { toolsFunc } from '@/utils/tools'

const request = axios.create({ timeout: 60000 })

const baseURL = '/api/yunyao'
const baseHGIS = '/api/higis'
export const getTimeLine = async (data: any) => {
  return request({
    url: 'https://img.net/v1/metadata/search/timeline',
    method: 'post',
    data,
    baseURL
  })
}

export async function addCloudImageLayer(olMap: any, row: any, splitResolution: any) {
  const map = olMap.map
  const layerCacheIds = olMap.layerCacheIds
  const oExtent = map.getView().calculateExtent(map.getSize())
  const zoom = map.getView().getZoom()
  const appid = row.appid

  if (!appid) return
  // 如果加载过，则不重复加载
  const olLayer = olMap.getLayerById(appid)
  if (olLayer) {
    // olMap.map.removeLayer(olLayer)
    // olMap.map.addLayer(olLayer)
    olLayer.setZIndex(0)
    return
  }

  let url = `https://higis.img.net/service/wmts?layer=${appid}&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}`
  let option = {
    url: url,
    projection: 'EPSG:3857',
    maxResolution: splitResolution,
    zIndex: -999,
    layerId: appid,
    extent: row.geom.bbox,
    type: 'tileXYZ'
  }
  const layer = await olMap.createLayerByOptions(option)
  olMap.map.addLayer(layer)
  layerCacheIds.push(appid)
}


//时间戳转换方法  date:时间戳数字
function formatDate(date: string | number) {
  if (typeof date === 'string') date = parseInt(date)
  return toolsFunc.parseTime(date, 'yy-MM-dd hh:mm:ss')
}

export const initMonitorCloudImageListener = (olMap: any, splitResolution: number, cb: Function) => {
  const map = olMap?.map
  olMap.layerCacheIds = []
  olMap.layerCacheOptions = []
  olMap.cloudImgListener = map.on('moveend', async (e: any) => {
    const oResolution = e.map.getView().getResolution()
    if (oResolution < splitResolution) {
      const oExtent = map.getView().calculateExtent(map.getSize())
      const polygon = fromExtent(oExtent)
      const center = getCenter(oExtent)
      let data: any = await getTimeLine({
          queryGeometry: {
            type: 'Polygon',
            coordinates: polygon.getCoordinates()
          }
        }
      )
      data = data?.data?.result
      //按照分辨率进行排序
      if (data && data?.length > 0) {
        data = data.filter(function(item: any) {
          item.date = formatDate(item.imagedate)
          return ((item.resolution == 0.5) && item.appid !== 4016)
        })
        // 按照时间进行排序
        data.sort((a: any, b: any) => {
          return parseInt(a.imagedate) - (b.imagedate)
        })
        addCloudImageLayer(olMap, data[data.length - 1], splitResolution)
        if (typeof cb === 'function') {
          cb(data)
        }
      }
    } else {
      //清除所有图层，并移除
      olMap.layerCacheIds.forEach((item: any) => {
        olMap.removeLayerById(item)
      })
      olMap.layerCacheIds = []
      cb([])
    }
  })
}
