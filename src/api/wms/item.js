import request from '@/utils/request'

// 查询sku信息列表
export function listSku(query) {
  return request({
    url: '/wms/sku/list',
    method: 'get',
    params: query
  })
}

// 查询物料列表
export function listItem(query) {
  return request({
    url: '/wms/item/list',
    method: 'get',
    params: query
  })
}

// 查询物料详细
export function getItem(id) {
  return request({
    url: '/wms/item/' + id,
    method: 'get'
  })
}

// 新增物料
export function addItem(data) {
  return request({
    url: '/wms/item',
    method: 'post',
    data: data
  })
}

// 修改物料
export function updateItem(data) {
  return request({
    url: '/wms/item',
    method: 'put',
    data: data
  })
}

// 删除物料
export function delItem(id) {
  return request({
    url: '/wms/item/' + id,
    method: 'delete'
  })
}
