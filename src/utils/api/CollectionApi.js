import {request} from '@/utils/request';

//获取收藏列表歌曲 默认10个，第一页
export const getCollectionList = (uid, pageSize = 10, page = 1 ) => request.post('/collection/music/get',{
    "page": page,
    "pageSize": pageSize,
    "userId": uid,
});
//修改收藏列表信息
export const updateCollection = (uid, description, coverUrl) => request.put('/collection', {
    "userId": uid,
    "description": description,
    "coverUrl": coverUrl,
})

//获取收藏信息
export const getCollectionInfo = (uid) => request.get(`/collection/${uid}`)
//添加收藏歌曲
export const addMusicToCollection = (uid, songId) => request.post('/collection/music', {
    "songId": songId,
    "userId": uid,
})
//删除收藏歌曲
export const deleteMusicFromCollection = (uid, songId) => request.delete('/collection/music', {
    "songId": songId,
    "userId": uid,
})