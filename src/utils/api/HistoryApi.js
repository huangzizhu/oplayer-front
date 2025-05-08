import {request} from '@/utils/request';

//获取播放历史
export const getHistory = (uid, pageSize=10, page=1) => request.post('/history/query', {
    "userId": uid,
    "page": page,
    "pageSize": pageSize
})

//添加播放历史
export const addHistory = (data) => request.post('/history/submit', data)