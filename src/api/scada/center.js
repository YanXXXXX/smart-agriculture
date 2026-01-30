import request from '@/utils/request';

// 查询组态中心列表
export function listCenter(query) {
    return request({
        url: '/scada/center/list',
        method: 'get',
        params: query,
    });
}

// 查询组态中心详细
export function getCenter(id) {
    return request({
        url: '/scada/center/' + id,
        method: 'get',
    });
}
//根据产品ID查询组态信息
export function getScadaByProductId(productId) {
    return request({
        url: '/scada/center/getScadaByProductId/' + productId,
        method: 'get',
    });
}

// 新增组态中心
export function addCenter(data) {
    return request({
        url: '/scada/center',
        method: 'post',
        data: data,
    });
}
//新增产品组态
export function addProductCenter(data){
    return request({
        url: '/scada/center/addProductScada',
        method: 'post',
        data: data,
    });
}
// 修改组态中心
export function updateCenter(data) {
    return request({
        url: '/scada/center',
        method: 'put',
        data: data,
    });
}

// 删除组态中心
export function delCenter(id) {
    return request({
        url: '/scada/center/' + id,
        method: 'delete',
    });
}
