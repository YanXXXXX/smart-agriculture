import request from '@/utils/request'

// 查询溯源码查询记录列表
export function listRecord(query) {
  return request({
    url: '/trace/record/list',
    method: 'get',
    params: query
  })
}

// 查询溯源码查询记录详细
export function getRecord(recordId) {
  return request({
    url: '/trace/record/' + recordId,
    method: 'get'
  })
}

// 新增溯源码查询记录
export function addRecord(data) {
  return request({
    url: '/trace/record/add',
    method: 'post',
    data: data
  })
}

// 修改溯源码查询记录
export function updateRecord(data) {
  return request({
    url: '/trace/record',
    method: 'put',
    data: data
  })
}

// 删除溯源码查询记录
export function delRecord(recordId) {
  return request({
    url: '/trace/record/' + recordId,
    method: 'delete'
  })
}


