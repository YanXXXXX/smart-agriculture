import request from '@/utils/request';

const controller = '/trace/traceWebSite'

// 新增溯源记录接口
export function addRecord(data) {
    return request({
      url: controller+'/addRecord',
      method: 'post',
      data: data
    })
}

// 获取溯源码详情
export function getTraceTemplateByTemplateId(templateId) {
    return request({
      url: controller+'/getTraceTemplateByTemplateId/' + templateId,
      method: 'get'
    })
}

// 根据溯源码获取溯源页面模版
export function getTraceTemplateByTraceCode(traceCode) {
    return request({
      url: controller+'/getTraceTemplateByTraceCode/' + traceCode,
      method: 'get'
    })
}

// 根据traceCode获取溯源码信息
export function getCodeByTraceCode(traceCode) {
    return request({
      url: controller+'/getCodeByTraceCode/' + traceCode,
      method: 'get'
    })
}
//根据溯源记录实体查询溯源记录列表
export function getRecordList(query){
    return request({
        url:controller+'/getRecordList',
        method:'get',
        params:query
    });
}

//修改溯源码状态
export function updateCodeStatus(data){
    return request({
        url:controller+'/updateTraceCodeStatus',
        method:'post',
        data
    });
}



