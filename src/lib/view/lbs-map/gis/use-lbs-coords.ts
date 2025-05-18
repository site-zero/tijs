import { LatLngObj, LatLngTuple, LbsMapValueCoords } from "../ti-lbs-map-types";

const pi = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

/**
 * 84 to 火星坐标系 (GCJ-02) World Geodetic System ==> Mars Geodetic System
 * @param lat
 * @param lng
 * @return Object({lat,lng})
 */
export function WGS84_TO_GCJ02(lat: number, lng: number) {
    if (outOfChina(lat, lng)) {
        return { lat: lat, lng: lng };
    }
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLon = transformLng(lng - 105.0, lat - 35.0);
    let radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    let mgLat = lat + dLat;
    let mgLon = lng + dLon;
    return { lat: mgLat, lng: mgLon };
}

export function WGS84_TO_BD09(lat: number, lng: number) {
    let gcj02 = WGS84_TO_GCJ02(lat, lng);
    let bd09 = GCJ02_TO_BD09(gcj02.lat, gcj02.lng);
    return bd09;
}

export function GCJ02_TO_WGS84(lat: number, lng: number) {
    let gps = transform(lat, lng);
    let longitude = lng * 2 - gps.lng;
    let latitude = lat * 2 - gps.lat;
    return { lat: latitude, lng: longitude };
}

export function GCJ02_TO_BD09(gg_lat: number, gg_lng: number) {
    let x = gg_lng, y = gg_lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi);
    let bd_lon = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;
    return { lat: bd_lat, lng: bd_lon };
}

export function BD09_TO_GCJ02(bd_lat: number, bd_lng: number) {
    let x = bd_lng - 0.0065, y = bd_lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
    let gg_lon = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return { lat: gg_lat, lng: gg_lon };
}

export function BD09_TO_WGS84(bd_lat: number, bd_lng: number) {
    let gcj02 = BD09_TO_GCJ02(bd_lat, bd_lng);
    let map84 = GCJ02_TO_WGS84(gcj02.lat, gcj02.lng);
    return map84;
}

export function SAME_COORDS(lat: number, lng: number) {
    return { lat, lng };
}

//---------------------------------------------
// 准备转换映射
//---------------------------------------------
type COORDS_TRANS = (lat: number, lng: number) => LatLngObj
const COORDS_TO: Map<LbsMapValueCoords, Map<LbsMapValueCoords, COORDS_TRANS>> =
    new Map<LbsMapValueCoords, Map<LbsMapValueCoords, COORDS_TRANS>>();

//---------------------------------------------
const WGS84_TO = new Map<LbsMapValueCoords, COORDS_TRANS>();
WGS84_TO.set('WGS84', SAME_COORDS);
WGS84_TO.set('BD09', WGS84_TO_BD09);
WGS84_TO.set('GCJ02', WGS84_TO_GCJ02);
//---------------------------------------------
const GCJ02_TO = new Map<LbsMapValueCoords, COORDS_TRANS>();
GCJ02_TO.set('WGS84', GCJ02_TO_WGS84);
GCJ02_TO.set('BD09', GCJ02_TO_BD09);
GCJ02_TO.set('GCJ02', SAME_COORDS);
//---------------------------------------------
const BD09_TO = new Map<LbsMapValueCoords, COORDS_TRANS>();
BD09_TO.set('WGS84', BD09_TO_WGS84);
BD09_TO.set('BD09', SAME_COORDS);
BD09_TO.set('GCJ02', SAME_COORDS);
//---------------------------------------------
// 汇集转换函数
//---------------------------------------------
COORDS_TO.set('WGS84', WGS84_TO);
COORDS_TO.set('GCJ02', GCJ02_TO);
COORDS_TO.set('BD09', BD09_TO);

/**
 * 将源坐标转换为目标坐标
 * 
 * @param from 源坐标系
 * @param to 目标坐标系
 * @param lal 源坐标
 * @returns 目标坐标
 */
export function translateCoordsForLatlngObj(from: LbsMapValueCoords, to: LbsMapValueCoords, lal: LatLngObj): LatLngObj {
    let trans = COORDS_TO.get(from)?.get(to);
    let { lat, lng } = lal;
    if (!trans) {
        return { lat, lng };
    }
    return trans(lat, lng);
}

export function translateCoordsForLatlngTuple(from: LbsMapValueCoords, to: LbsMapValueCoords, lal: LatLngTuple): LatLngTuple {
    let trans = COORDS_TO.get(from)?.get(to);
    let [lat, lng] = lal;
    if (!trans) {
        return [lat, lng];
    }
    let re = trans(lat, lng);
    return [re.lat, re.lng]
}

/**
 * is or not outOfChina
 * @param lat
 * @param lon
 * @return Boolean
 */
export function outOfChina(lat: number, lon: number) {
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
}

export function transform(lat: number, lon: number) {
    if (outOfChina(lat, lon)) {
        return { lat: lat, lng: lon };
    }
    let dLat = transformLat(lon - 105.0, lat - 35.0);
    let dLon = transformLng(lon - 105.0, lat - 35.0);
    let radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    let mgLat = lat + dLat;
    let mgLon = lon + dLon;
    return { lat: mgLat, lng: mgLon };
}

export function transformLat(x: number, y: number) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
        + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

export function transformLng(x: number, y: number) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
        * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
        * pi)) * 2.0 / 3.0;
    return ret;
}