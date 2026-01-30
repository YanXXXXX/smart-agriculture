import request from '@/utils/request';

// 查询组件管理列表
export function listDeviceBind(query) {
    return request({
        url: '/scada/center/listDeviceBind',
        method: 'get',
        params: query,
    });
}

// 保存组态关联设备
export function saveDeviceBind(data) {
    return request({
        url: '/scada/center/saveDeviceBind',
        method: 'post',
        data: data,
    });
}

// 移除组态关联设备
export function removeDeviceBind(ids) {
    return request({
        url: '/scada/center/removeDeviceBind/' + ids,
        method: 'delete',
    });
}

// 查询设备统计信息
export function getDeviceStatistic() {
    return request({
        url: '/scada/center/statistic',
        method: 'get',
    });
}
// 选择变量
export function listDeviceThingsModel(query) {
    return request({
        url: '/scada/center/listDeviceThingsModel',
        method: 'get',
        params: query,
    });
}

// 获取组态详情
export function getByGuid(guid) {
    return request({
        url: '/scada/center/getByGuid?guid=' + guid,
        method: 'get',
    });
}
//保存组态详细数据
export function saveDetailData(data) {
    return request({
        url: '/scada/center/save',
        method: 'post',
        data: data,
    });
}

// 删除收藏图库管理
export function delFavoritesGallery(id) {
    return request({
        url: '/scada/center/deleteGalleryFavorites/' + id,
        method: 'delete',
    });
}

// 查询图库管理列表
export function getFavoriteGallerys(query) {
    return request({
        url: '/scada/center/listGalleryFavorites',
        method: 'get',
        params: query,
    });
}

// 获取物模历史数据
export function getThingsModelHistory(data) {
    return request({
        url: '/scada/center/listThingsModelHistory',
        method: 'post',
        data: data,
    });
}

// 获取设备状态
export function getDeviceStatus(query) {
    return request({
        url: '/scada/center/getDeviceStatus',
        method: 'get',
        params: query,
    });
}
