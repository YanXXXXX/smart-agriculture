import request from '@/utils/request'

// 配置种植单元
export function cfgUnit(data) {
  return request({
    url: '/agriculture/unit/cfg',
    method: 'POST',
    data
  })
}
//获取种植单元
export function getUnit(landId) {
    return request({
      url: '/agriculture/unit/getUnit/'+landId,
      method: 'GET',
    })
}

//获取设备
export function selectDeviceList(landId) {
    return request({
      url: '/agriculture/unit/selectDeviceList/'+landId,
      method: 'GET',
    })
}

//获取监控
export function selectCameraList(landId) {
    return request({
      url: '/agriculture/unit/selectCameraList/'+landId,
      method: 'GET',
    })
}

//获取种植批次
export function selectBatchList(landId) {
    return request({
      url: '/agriculture/unit/selectBatchList/'+landId,
      method: 'GET',
    })
}

//获取场景
export function selectSceneList(landId) {
    return request({
      url: '/agriculture/unit/selectSceneList/'+landId,
      method: 'GET',
    })
}

//获取告警日志
export function selectAlertLogList(query) {
    return request({
      url: '/agriculture/unit/selectAlertLogList/',
      method: 'GET',
      params: query
    })
}

