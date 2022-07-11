export interface InitData {
  scenicBO: ScenicBO;
  pointBOS: PointBos[];
  pointTypeBOS: PointTypeBos[];
}
interface PointTypeBos {
  icon: string;
  iconIn: string;
  name: string;
  pic: string;
  picIn: string;
  url: string;
  id: number;
  isDetails: number;
  sort: number;
  color?: string;
}
interface ScenicBO {
  address: string;
  name: string;
  tousuTel: string;
  zhongshanUrl: string;
  aggregateZoom: number;
  id: number;
  isValid: number;
  latitude: number;
  longitude: number;
  maxZoom: number;
  minZoom: number;
  showZoom: number;
}
export interface PointBos {
  address: string;
  name: string;
  pic: string;
  pointInfo: string;
  synopsis: string;
  id: number;
  isValid: number;
  latitude: number;
  longitude: number;
  maxZoom: number;
  minZoom: number;
  pointTypeId: number;
  showZoom: number;
  sort: number;
  isDetails?: number;
  waterBOS?: [];
}

export function initDataFn(res?: InitData) {
  const obj = res ? res : {
    scenicBO: {
      address: '',
      name: '',
      tousuTel: '',
      zhongshanUrl: '',
      aggregateZoom: 0,
      id: 0,
      isValid: 0,
      latitude: 0,
      longitude: 0,
      maxZoom: 0,
      minZoom: 0,
      showZoom: 0,
    },
    pointBOS: [],
    pointTypeBOS: [],
  }
  return obj;
}

// marker点样式
export const box_style =
  "width: 19.2vw;height: 17.6vw;display: flex;flex-direction: column;justify-content: space-between;align-items: center";
export const img_style =
  "margin: 0 auto 1.067vw;";
export const text_style =
  "white-space:nowrap;font-size: 3.733vw;line-height: 6.667vw;text-align: center;padding: 0 10px;background: white;height: 30px;line-height:30px;border-radius: 8px";
export const infoWindowStyle: string = `width: 62.933vw;height: 18.133vw;position:relative;display: flex;flex-direction: row;background: red;background: white;padding: 2.133vw;border-radius: 1.067vw;`;

export interface StreetData {
  id: number | string;
  name: string;
  sort: number;
}

export interface ScenicData {
  address: string;
  name: string;
  synopsis: string;
  pic: string;
  distance: number;
  id: number;
  latitude: number;
  longitude: number;
  pointTypeId: number;
  streetId: number;
}

export interface ScenicDetailData {
  address: string;
  name: string;
  pointInfo: string;
  synopsis: string;
  img: any[],
  id: number;
  latitude: number;
  longitude: number;
}
export function initScenicDetail(res?: ScenicDetailData) {
  const obj = res ? res : {
    address: '',
    name: '',
    pointInfo: '',
    synopsis: '',
    img: [],
    id: 0,
    latitude: 0,
    longitude: 0,
  }
  return obj;
}