import request from '@/utils/request'

// 查询物料类型列表
export function listCategory(query) {
  return request({
    url: '/wms/category/list',
    method: 'get',
    params: query
  })
}

// 查询物料类型详细
export function getCategory(id) {
  return request({
    url: '/wms/category/' + id,
    method: 'get'
  })
}

// 新增物料类型
export function addCategory(data) {
  return request({
    url: '/wms/category',
    method: 'post',
    data: data
  })
}

// 修改物料类型
export function updateCategory(data) {
  return request({
    url: '/wms/category',
    method: 'put',
    data: data
  })
}

// 删除物料类型
export function delCategory(id) {
  return request({
    url: '/wms/category/' + id,
    method: 'delete'
  })
}
