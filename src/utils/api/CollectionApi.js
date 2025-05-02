import {request} from '@/utils/request';

export const getCollectionList = (uid) => request.post('/collection/music/get',{
    "page": 1,
    "pageSize": 10,
    "userId": uid,
});