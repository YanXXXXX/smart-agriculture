import request from '@/utils/request'

// 查询溯源码模版列表
export function listTraceCodeTemplate(query) {
  return request({
    url: '/trace/traceCodeTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询溯源码模版详细
export function getTraceCodeTemplate(templateId) {
  return request({
    url: '/trace/traceCodeTemplate/' + templateId,
    method: 'get'
  })
}

// 新增溯源码模版
export function addTraceCodeTemplate(data) {
  return request({
    url: '/trace/traceCodeTemplate',
    method: 'post',
    data: data
  })
}

// 修改溯源码模版
export function updateTraceCodeTemplate(data) {
  return request({
    url: '/trace/traceCodeTemplate',
    method: 'put',
    data: data
  })
}

// 删除溯源码模版
export function delTraceCodeTemplate(templateId) {
  return request({
    url: '/trace/traceCodeTemplate/' + templateId,
    method: 'delete'
  })
}
