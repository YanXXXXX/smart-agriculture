import request from '@/utils/request'

// 查询萤石云设备通道列表
export function listYsChannel(query) {
  return request({
    url: '/iot/channel/list',
    method: 'get',
    params: query
  })
}

// 查询萤石云设备通道详细
export function getYsChannel(channelId) {
  return request({
    url: '/iot/channel/' + channelId,
    method: 'get'
  })
}

// 新增萤石云设备通道
export function addYsChannel(data) {
  return request({
    url: '/iot/channel',
    method: 'post',
    data: data
  })
}

// 修改萤石云设备通道
export function updateYsChannel(data) {
  return request({
    url: '/iot/channel',
    method: 'put',
    data: data
  })
}

// 删除萤石云设备通道
export function delYsChannel(channelId) {
  return request({
    url: '/iot/channel/' + channelId,
    method: 'delete'
  })
}
