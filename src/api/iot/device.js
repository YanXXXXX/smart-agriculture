import request from '@/utils/request'

// 查询设备列表
export function listDevice(query) {
    return request({
        url: '/iot/device/list',
        method: 'get',
        params: query
    })
}
//摄像头列表
export function listCamera(query){
    return request({
        url:'/iot/device/list',
        method:'get',
        params:{
            isCamera:1,
            ...query
        }
    })
}

// 查询设备详细
export function getDevice(deviceId) {
    return request({
        url: '/iot/device/' + deviceId,
        method: 'get'
    })
}

// 根据设备编号查询设备详细
export function getDeviceBySerialNumber(serialNumber) {
    return request({
        url: '/iot/device/getDeviceBySerialNumber/' + serialNumber,
        method: 'get'
    })
}

// 查询设备运行状态详细
export function getDeviceRunningStatus(deviceId) {
    return request({
        url: '/iot/device/runningStatus/' + deviceId,
        method: 'get'
    })
}


// 查询设备运行状态单层模型
export function getDeviceRunningStatusSingle(deviceId,removeNotRecord) {
    return request({
        url: '/iot/device/runningStatusSingle/' + deviceId+'/'+removeNotRecord,
        method: 'get'
    })
}

// 新增设备
export function addDevice(data) {
    return request({
        url: '/iot/device',
        method: 'post',
        data: data
    })
}

// 修改设备
export function updateDevice(data) {
    return request({
        url: '/iot/device',
        method: 'put',
        data: data
    })
}

// 删除设备
export function delDevice(deviceId) {
    return request({
        url: '/iot/device/' + deviceId,
        method: 'delete'
    })
}

// 生成设备编号
export function generatorDeviceNum() {
    return request({
        url: '/iot/device/generator',
        method: 'get'
    })
}

// 生成设备编号
export function importDevice(data) {
    return request({
        url: '/iot/device/import',
        method: 'post',
        data: data
    })
}
