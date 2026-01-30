import request from '@/utils/request'

// 查询产品布局列表
export function listLayout(query) {
  return request({
    url: '/iot/layout/list',
    method: 'get',
    params: query
  })
}


// 新增产品布局
export function addLayout(data) {
  return request({
    url: '/iot/layout',
    method: 'post',
    data: data
  })
}



// 删除产品布局
export function delLayout(productId) {
  return request({
    url: '/iot/layout/' + productId,
    method: 'delete'
  })
}
