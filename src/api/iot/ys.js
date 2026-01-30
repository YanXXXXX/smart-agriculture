import request from '@/utils/request'

// 查询萤石系统配置详细
export function getYs(productId) {
  return request({
    url: '/iot/ys/' + productId,
    method: 'get'
  })
}

// 新增萤石系统配置
export function addYs(data) {
  return request({
    url: '/iot/ys',
    method: 'post',
    data: data
  })
}

// 修改萤石系统配置
export function updateYs(data) {
  return request({
    url: '/iot/ys',
    method: 'put',
    data: data
  })
}

//获取萤石云设备列表
export function getDeviceList(data){
    return request({
        url:"/iot/ys/getDeviceList",
        method:'post',
        data:data
    })
}
