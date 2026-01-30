import request from '@/utils/request'

// 查询库存详情列表
export function listInventorydetail(query) {
  return request({
    url: '/wms/inventorydetail/list',
    method: 'get',
    params: query
  })
}