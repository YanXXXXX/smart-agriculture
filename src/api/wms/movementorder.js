import request from '@/utils/request'

// 查询移库单列表
export function listMovementorder(query) {
  return request({
    url: '/wms/movementorder/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详情列表
export function listMovementorderdetail(query) {
  return request({
    url: '/wms/movementorderdetail/list',
    method: 'get',
    params: query
  })
}

// 查询移库单详细
export function getMovementorder(id) {
  return request({
    url: '/wms/movementorder/' + id,
    method: 'get'
  })
}

// 新增移库单
export function addMovementorder(data) {
  return request({
    url: '/wms/movementorder',
    method: 'post',
    data: data
  })
}

// 修改移库单
export function updateMovementorder(data) {
  return request({
    url: '/wms/movementorder',
    method: 'put',
    data: data
  })
}

// 删除移库单
export function delMovementorder(id) {
  return request({
    url: '/wms/movementorder/' + id,
    method: 'delete'
  })
}

// 完成入库单
export function completeMovementorder(data) {
  return request({
    url: '/wms/movementorder/move',
    method: 'post',
    data:data
  })
}
