import request from '@/utils/request'

// 查询入库单列表
export function listReceiptorder(query) {
  return request({
    url: '/wms/receiptorder/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详情列表
export function listReceiptorderdetail(query) {
  return request({
    url: '/wms/receiptorderdetail/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详细
export function getReceiptorder(id) {
  return request({
    url: '/wms/receiptorder/' + id,
    method: 'get'
  })
}

// 新增入库单
export function addReceiptorder(data) {
  return request({
    url: '/wms/receiptorder',
    method: 'post',
    data: data
  })
}

// 修改入库单
export function updateReceiptorder(data) {
  return request({
    url: '/wms/receiptorder',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delReceiptorder(id) {
  return request({
    url: '/wms/receiptorder/' + id,
    method: 'delete'
  })
}

// 完成入库单
export function completeReceiptorder(data) {
  return request({
    url: '/wms/receiptorder/warehousing',
    method: 'post',
    data:data
  })
}