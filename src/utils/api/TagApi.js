import {request} from '@/utils/request';

//获取所有标签类别
export const getAllTagCategories = () => request.get('/tag/category');
//获取所有标签
export const getAllTags = () => request.get('/tag/list');
//根据类别获取标签
export const getTagsByCategory = (categoryId) => request.get('/tag/category/' + categoryId);
//根据id获取标签
export const getTagById = (tagId) => request.get('/tag/' + tagId);
//根据歌曲ID获取标签列表
export const getTagsBySongId = (songId) => request.get('/tag/music/' + songId);