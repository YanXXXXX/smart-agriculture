import request from '@/utils/request'

// 查询库存列表
export function listInventory(query) {
  return request({
    url: '/wms/inventory/boardList/warehouse',
    method: 'get',
    params: query
  })
}

export function listItem(query) {
  return request({
    url: '/wms/inventory/boardList/item',
    method: 'get',
    params: query
  })
}
