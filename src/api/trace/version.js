import request from '@/utils/request'

// 查询溯源版本列表
export function listVersion(query) {
  return request({
    url: '/trace/version/list',
    method: 'get',
    params: query
  })
}

// 查询溯源版本详细
export function getVersion(versionId) {
  return request({
    url: '/trace/version/' + versionId,
    method: 'get'
  })
}

// 新增溯源版本
export function addVersion(data) {
  return request({
    url: '/trace/version',
    method: 'post',
    data: data
  })
}

// 修改溯源版本
export function updateVersion(data) {
  return request({
    url: '/trace/version',
    method: 'put',
    data: data
  })
}

// 删除溯源版本
export function delVersion(versionId) {
  return request({
    url: '/trace/version/' + versionId,
    method: 'delete'
  })
}
