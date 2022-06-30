import { post, get } from "@/util/index";
import { InitData, StreetData, PointBos, ScenicDetailData } from "@/views/Index/Index";
import { AxiosResponse } from "axios";
// 初始化函数
export const initData = (): Promise<AxiosResponse<InitData>> => post('/api/init', {});

// 获取所有街道
export const getStrreet = (): Promise<AxiosResponse<StreetData[]>> => post('/api/getAllStreet', {});

// 获取对应景点
export const getScenic = (pointTypeId: number,
  lng1: number,
  lat1: number,
  streetId: number | string = ''): Promise<AxiosResponse<PointBos[]>> => post('/api/selectByStreet', {
    pointTypeId,
    lng1,
    lat1,
    streetId,
  });


// 获取景点详情
export const getScenicDetail = (pointId: number): Promise<AxiosResponse<ScenicDetailData>> => post('/api/point/selectByid', {
  pointId,
})