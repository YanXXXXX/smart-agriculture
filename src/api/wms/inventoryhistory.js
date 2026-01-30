import request from '@/utils/request'

// 查询库存记录列表
export function listInventoryhistory(query) {
  return request({
    url: '/wms/inventoryhistory/list',
    method: 'get',
    params: query
  })
}