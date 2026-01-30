import request from '@/utils/request'

// 查询所有溯源数据
export function selectRecord(baseId) {
    return request({
      url: '/trace/statistics/selectRecord/'+baseId,
      method: 'get'
    })
}
//按月分组溯源记录
export function selectRecordGroupByMonth(baseId) {
    return request({
      url: '/trace/statistics/selectRecordGroupByMonth/'+baseId,
      method: 'get'
    })
}

// 朔源扫码TOps
export function selectRecordGroupBySellpro(baseId) {
    return request({
      url: '/trace/statistics/selectRecordGroupBySellpro/'+baseId,
      method: 'get'
    })
  }

  //溯源报表上面的六个数据
export function selectTraceInfo(baseId) {
    return request({
      url: '/trace/statistics/selectTraceInfo/'+baseId,
      method: 'get'
    })
}

// 朔源统计分析
export function selectRecordStatistics(baseId) {
    return request({
      url: '/trace/statistics/selectRecordStatistics/'+baseId,
      method: 'get'
    })
  }

  // 按城市分组查询溯源次数
  export function selectRecordGroupByCity(baseId) {
    return request({
      url: '/trace/statistics/selectRecordGroupByCity/'+baseId,
      method: 'get'
    })
  }
