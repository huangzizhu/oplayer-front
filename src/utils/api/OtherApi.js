import request from "@/utils/request";

export const getCaptcha = (uuid) => request.post('/tool/captcha', { uuid },
    {
    responseType: 'blob',
    params: {
        uuid: uuid,
        t: Date.now() // 添加时间戳防止缓存
    }
});

export const sendEmail = (data) => request.post('/tool/sendEmail',data );