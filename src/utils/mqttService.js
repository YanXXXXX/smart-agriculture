import sysTopics from '@/utils/sysTopics'
import mqttTool from '@/utils/mqttTool'
import modal from '@/plugins/modal'
import {getLatestFirmware} from '@/api/iot/firmware'

export default{
    /**
     * mqtt发布
     * @param {*} model
     *{
         type:1属性 2功能
         id:
         value:
         name:
     }
     * @param {*} device
     * {
     *  productId:
     * serialNumber:
     * status:
     * }
     */
    mqttPublish:function(model,device) {
        let topic = "";
        let message = ""
        switch (model.type) {
            //属性
            case 1:
                if (device.status == 3) {
                    // 属性,在线模式
                    topic = "/" + device.productId + "/" + device.serialNumber + sysTopics.propertyOnlineSend;
                } else if (device.isShadow) {
                    // 属性,离线模式
                    topic = "/" + device.productId + "/" + device.serialNumber + sysTopics.propertyOfflineSend;
                }
                message = `[{"id":"${model.id}","value":"${model.value}","remark":"${model.name}"}]`;
                break;
            //功能
            case 2:
                if (device.status == 3) {
                    // 功能,在线模式
                    topic = "/" + device.productId + "/" + device.serialNumber + sysTopics.functionOnlineSend;
                } else if (device.isShadow) {
                    // 功能,离线模式
                    topic = "/" + device.productId + "/" + device.serialNumber + sysTopics.functionOfflineSend;
                }
                message = `[{"id":"${model.id}","value":"${model.value}","remark":"${model.name}"}]`;
                break;
            //ota
            case 3:
                topic = "/" + device.productId + "/" + device.serialNumber + sysTopics.otaSend;
                message = model.message;
                break;
            //实时监测
            case 4:
                topic = "/" + device.productId + "/" + device.serialNumber + sysTopics.monitorSend;
                message = model.message;
                break;
            default:
                break;
        }
        if (topic != "") {
            // 发布
            mqttTool.publish(topic, message, model.name).then(res => {
                modal.notifySuccess(res);
            }).catch(res => {
                modal.notifyError(res);
            });
        }
    },
    //isOpen true 发送监测命令，false，关闭监测命令
    monitor:function(device,isOpen){
        //监测间隔时间
        let intervalTime=1000;//毫秒

        if (device.status != 3) {
            modal.alertError("设备不在线，下发指令失败");
            return;
        }
        let name = isOpen?'实时监测开启':'实时监测关闭';
        let interval = isOpen?intervalTime:0;
        this.mqttPublish({name,type:4,message:`{"interval":${interval}}`},device);//毫秒
    },
    //ota升级
    ota:async function(device){
        const {data} = await getLatestFirmware(device.deviceId);
        if(data){
            this.mqttPublish({name:"ota升级",type:3,message:`[{"version":"${data.version}","downloadUrl":"${process.env.VUE_APP_BASE_API+data.filePath}"}]`},device);
        }else{
            modal.alertError("没有最新固件版本");
        }
    }
}
