import request from '@/utils/request'

// 查询App升级列表
export function listUpgrade(query) {
  return request({
    url: '/system/upgrade/list',
    method: 'get',
    params: query
  })
}

// 查询App升级详细
export function getUpgrade(recordId) {
  return request({
    url: '/system/upgrade/' + recordId,
    method: 'get'
  })
}

// 新增App升级
export function addUpgrade(data) {
  return request({
    url: '/system/upgrade',
    method: 'post',
    data: data
  })
}

// 修改App升级
export function updateUpgrade(data) {
  return request({
    url: '/system/upgrade',
    method: 'put',
    data: data
  })
}

// 删除App升级
export function delUpgrade(recordId) {
  return request({
    url: '/system/upgrade/' + recordId,
    method: 'delete'
  })
}

