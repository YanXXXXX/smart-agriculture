import request from '@/utils/request'

// 查询溯源模版列表
export function listTraceTemplate(query) {
  return request({
    url: '/trace/traceTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询溯源模版详细
export function getTraceTemplate(templateId) {
  return request({
    url: '/trace/traceTemplate/' + templateId,
    method: 'get'
  })
}

// 新增溯源模版
export function addTraceTemplate(data) {
  return request({
    url: '/trace/traceTemplate',
    method: 'post',
    data: data
  })
}

// 修改溯源模版
export function updateTraceTemplate(data) {
  return request({
    url: '/trace/traceTemplate',
    method: 'put',
    data: data
  })
}

// 删除溯源模版
export function delTraceTemplate(templateId) {
  return request({
    url: '/trace/traceTemplate/' + templateId,
    method: 'delete'
  })
}

// 更具溯源码查询溯源页面模版
export function getTraceTemplateByTraceCode(traceCode) {
    return request({
      url: '/trace/traceTemplate/getTraceTemplateByTraceCode/' + traceCode,
      method: 'get'
    })
  }


