import request from '@/utils/request'

// 查询出库单列表
export function listShipmentorder(query) {
  return request({
    url: '/wms/shipmentorder/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详情列表
export function listShipmentorderdetail(query) {
  return request({
    url: '/wms/shipmentorderdetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详情列表
export function getGoodList(query) {
  return request({
    url: '/wms/inventorydetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详细
export function getShipmentorder(id) {
  return request({
    url: '/wms/shipmentorder/' + id,
    method: 'get'
  })
}

// 新增出库单
export function addShipmentorder(data) {
  return request({
    url: '/wms/shipmentorder',
    method: 'post',
    data: data
  })
}

// 修改出库单
export function updateShipmentorder(data) {
  return request({
    url: '/wms/shipmentorder',
    method: 'put',
    data: data
  })
}

// 删除出库单
export function delShipmentorder(id) {
  return request({
    url: '/wms/shipmentorder/' + id,
    method: 'delete'
  })
}

export function completeShipmentorder(data) {
  return request({
    url: '/wms/shipmentorder/shipment',
    method: 'post',
    data:data
  })
}
