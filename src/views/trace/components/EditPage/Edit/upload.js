import request from '@/utils/request'
// 文件上传接口

export default function upload(formData){
    return request({
        url:'/iot/tool/upload',
        method:'post',
        headers: {
            'Content-Type': 'multipart/form-data' // 覆盖默认设置
        },
        data:formData
    })
}
