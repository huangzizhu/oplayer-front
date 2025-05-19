import { request } from '@/utils/request';

//查询音乐 name, artist不能同时为null
export const getAllMusic = (name, artist, pageSize = 10, page = 1) => request.post('/music/all', {
    "name": name,
    "artist": artist,
    "pageSize": pageSize,
    "page": page
})

//根据id获取音乐
export const getMusicById = (id) => request.get('/music/' + id)

//模糊查询 调用后最好异步
export const fuzzySearch = (str) => request.get('/music/search?name=' + str)

//根据标签分类获取歌曲
export const getMusicByTag = (tagId, pageSize = 10, page = 1) => request.post('/music/search/tag', {
    "tagId": tagId,
    "page": page,
    "pageSize": pageSize
})

//流媒体获取
export const getMusicStream = (md5) => request.get('/music/stream/' + md5);


//随机获取歌曲
export const getRandomMusic = (count = 5) => request.post('/music/recommend',{"count": count});
//每日推荐
export const getDailyMusic = (userId) => request.post('/music/recommend/daily',{"userId": userId});