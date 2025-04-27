import {request,uapiRequest} from "@/utils/request";

export const getCaptcha = (uuid) => request.post('/tool/captcha', { uuid },
    {
    responseType: 'blob',
    params: {
        uuid: uuid,
        t: Date.now() // 添加时间戳防止缓存
    }
});

export const sendEmail = (data) => request.post('/tool/sendEmail',data );
export const getIp = () => uapiRequest.get('https://qifu-api.baidubce.com/ip/local/geo/v1/district');
export const getWeather = (city) => uapiRequest.get(`https://uapis.cn/api/weather?name=${city}`)
export const getSays = () => uapiRequest.get(`https://uapis.cn/api/say`)