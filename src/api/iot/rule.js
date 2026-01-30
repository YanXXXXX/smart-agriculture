import request from '@/utils/request'

// 查询规则引擎列表
export function listRule(query) {
  return request({
    url: '/iot/rule/list',
    method: 'get',
    params: query
  })
}

// 查询规则引擎详细
export function getRule(ruleId) {
  return request({
    url: '/iot/rule/' + ruleId,
    method: 'get'
  })
}

// 新增规则引擎
export function addRule(data) {
  return request({
    url: '/iot/rule',
    method: 'post',
    data: data
  })
}

// 修改规则引擎
export function updateRule(data) {
  return request({
    url: '/iot/rule',
    method: 'put',
    data: data
  })
}

// 删除规则引擎
export function delRule(ruleId) {
  return request({
    url: '/iot/rule/' + ruleId,
    method: 'delete'
  })
}
//测试规则
export function testRule(data){
    return request({
        url: '/iot/rule/testRule',
        method: 'post',
        data: data
      })
}

// 复制一份规则
export function copyOne(ruleId) {
    return request({
      url: '/iot/rule/copyOne/' + ruleId,
      method: 'get'
    })
  }
