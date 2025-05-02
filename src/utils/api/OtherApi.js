import {request} from "@/utils/request";

export const getCaptcha = (uuid) => request.post('/tool/captcha', { uuid },
    {
    responseType: 'blob',
    params: {
        uuid: uuid,
        t: Date.now() // 添加时间戳防止缓存
    }
});

export const sendEmail = (data) => request.post('/tool/sendEmail',data );
export const getWeather = (ip) => request.get(`/weather/${ip}`);
export const getSays = () => request.get('/tool/says');
export const getIp = () => request.get('https://qifu-api.baidubce.com/ip/local/geo/v1/district');