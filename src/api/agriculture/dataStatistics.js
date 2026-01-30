import request from '@/utils/request'


export function selectBaseInfo(baseId) {
    return request({
      url: '/agriculture/statistics/selectBaseInfo/'+baseId,
      method: 'get'
    })
}
export function selectDeviceInfo(baseId) {
    return request({
      url: '/agriculture/statistics/selectDeviceInfo/'+baseId,
      method: 'get'
    })
}
export function selectDeviceLog(baseId) {
    return request({
      url: '/agriculture/statistics/selectDeviceLog/'+baseId,
      method: 'get'
    })
}

export function selectTaskInfo(baseId) {
    return request({
      url: '/agriculture/statistics/selectTaskInfo/'+baseId,
      method: 'get'
    })
}
export function selectBatchInfo(baseId) {
    return request({
      url: '/agriculture/statistics/selectBatchInfo/'+baseId,
      method: 'get'
    })
}


