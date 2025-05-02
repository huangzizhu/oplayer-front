import {request} from '@/utils/request';

export const getAllPlayLists = (uid) => request.post('/list/all', {
    "page": 1,
    "pageSize": 10,
    "userId": uid,
})