import request from '@/utils/request'

// 查询库存盘点单据列表
export function listCheckorder(query) {
  return request({
    url: '/wms/checkorder/list',
    method: 'get',
    params: query
  })
}

export function listInventory(query){
  return request({
    url: '/wms/inventorydetail/checkList',
    method: 'get',
    params: query
  })
}

// 查询库存盘点单据详细
export function getCheckorder(id) {
  return request({
    url: '/wms/checkorder/' + id,
    method: 'get'
  })
}

// 新增库存盘点单据
export function addCheckorder(data) {
  return request({
    url: '/wms/checkorder',
    method: 'post',
    data: data
  })
}

// 修改库存盘点单据
export function updateCheckorder(data) {
  return request({
    url: '/wms/checkorder',
    method: 'put',
    data: data
  })
}

// 删除库存盘点单据
export function delCheckorder(id) {
  return request({
    url: '/wms/checkorder/' + id,
    method: 'delete'
  })
}

// 完成盘库单
export function completeCheckorder(data) {
  return request({
    url: '/wms/checkorder/check',
    method: 'post',
    data:data
  })
}