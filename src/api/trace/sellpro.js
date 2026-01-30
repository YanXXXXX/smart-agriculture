import request from '@/utils/request'

// 查询溯源产品列表
export function listSellpro(query) {
  return request({
    url: '/trace/sellpro/list',
    method: 'get',
    params: query
  })
}

// 查询溯源产品详细
export function getSellpro(sellproId) {
  return request({
    url: '/trace/sellpro/' + sellproId,
    method: 'get'
  })
}

// 新增溯源产品
export function addSellpro(data) {
  return request({
    url: '/trace/sellpro',
    method: 'post',
    data: data
  })
}

// 修改溯源产品
export function updateSellpro(data) {
  return request({
    url: '/trace/sellpro',
    method: 'put',
    data: data
  })
}

// 删除溯源产品
export function delSellpro(sellproId) {
  return request({
    url: '/trace/sellpro/' + sellproId,
    method: 'delete'
  })
}

// 生成溯源码
export function generateCode(data){
    return request({
        url:'/trace/sellpro/generateCode',
        method:'post',
        data,
        timeout:60000
    })
}
