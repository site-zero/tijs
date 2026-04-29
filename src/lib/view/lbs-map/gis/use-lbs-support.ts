import _ from "lodash";
import { Num } from "../../../../core";
import {
  isLngLatObj,
  isLngLatTuple,
  LbsMapBound,
  LbsMapBoundInput,
  LbsMapData,
  LbsMapValue,
  LngLatObj,
  LngLatTuple,
} from "../ti-lbs-map-types";

export function getLngToWest(lng: number, west: number) {
  let re = lng - west;
  if (west < 0 && lng > 0) {
    return 360 - re;
  }
  return re;
}

export function getLatToSouth(lat: number, south: number) {
  return lat - south;
}

export function normlizedLat(lat: number) {
  return lat;
}

export function normlizedLng(lng: number) {
  if (lng > 360) {
    lng = lng % 360;
  }
  if (lng > 180) {
    return lng - 360;
  }
  if (lng < -360) {
    lng = lng % 360;
  }
  if (lng < -180) {
    return lng + 360;
  }
  return lng;
}

/*
CROSS MODE:
      lng:180        360:0                 180
      +----------------+------------------NE  lat:90
      |                |           lng_min|lat_max
      |                |                  |
      +----------------+------------------+-- lat:0
      |                |                  |
lat_min|lng_max         |                  |
      SW---------------+------------------+   lat:-90
 
SIDE MODE:
      lng:0           180                360
      +----------------+------------------NE  lat:90
      |                |           lng_max|lat_max
      |                |                  |
      +----------------+------------------+-- lat:0
      |                |                  |
lat_min|lng_min         |                  |
      SW---------------+------------------+   lat:-90
 
@return [SW, NE]
*/
export function getBounds(
  lalList: LngLatObj[] = []
): undefined | [LngLatObj, LngLatObj] {
  let lng_max: number | undefined = undefined;
  let lng_min: number | undefined = undefined;
  let lat_max: number | undefined = undefined;
  let lat_min: number | undefined = undefined;
  for (let lal of lalList) {
    lng_max = _.isUndefined(lng_max) ? lal.lng : Math.max(lng_max, lal.lng);
    lng_min = _.isUndefined(lng_min) ? lal.lng : Math.min(lng_min, lal.lng);
    lat_max = _.isUndefined(lat_max) ? lal.lat : Math.max(lat_max, lal.lat);
    lat_min = _.isUndefined(lat_min) ? lal.lat : Math.min(lat_min, lal.lat);
  }
  if (
    _.isUndefined(lng_max) ||
    _.isUndefined(lng_min) ||
    _.isUndefined(lat_max) ||
    _.isUndefined(lat_min)
  ) {
    return;
  }

  // Cross mode
  if (lng_max - lng_min > 180) {
    return [
      { lat: lat_min, lng: lng_max },
      { lat: lat_max, lng: lng_min },
    ];
  }
  // Side mode
  return [
    { lat: lat_min, lng: lng_min },
    { lat: lat_max, lng: lng_max },
  ];
}

export function getCenter(lalList: LngLatObj[] = []) {
  let bounds = getBounds(lalList);
  if (!bounds) {
    return;
  }
  let [sw, ne] = bounds;
  return {
    lat: (ne.lat + sw.lat) / 2,
    lng: (ne.lng + sw.lng) / 2,
  };
}

//------------------------------------------------
export function isInBounds(lat: number, lng: number, bounds: LbsMapBound) {
  let { N, S, E, W } = bounds;
  if (lat > N || lat < S) return false;
  if (lng > E || lng < W) return false;

  return true;
}
//------------------------------------------------
export function isLatLngObjInBounds(lal: LngLatObj, bounds: LbsMapBound) {
  let { lat, lng } = lal;
  return isInBounds(lat, lng, bounds);
}
//------------------------------------------------
export function isLatLngTupleInBounds(lal: LngLatTuple, bounds: LbsMapBound) {
  let [lat, lng] = lal;
  return isInBounds(lat, lng, bounds);
}
//------------------------------------------------
function __build_bounds(bounds: LbsMapBoundInput) {
  let { N, S, E, W } = bounds;
  return {
    N,
    S,
    E,
    W,
    // Corner
    NE: { lat: N, lng: E },
    NW: { lat: N, lng: W },
    SE: { lat: S, lng: E },
    SW: { lat: S, lng: W },
    // Center
    lat: (N + S) / 2,
    lng: (W + E) / 2,
  };
}
//------------------------------------------------
export function getLatlngTupleBounds(latlngPairs: LngLatTuple[]) {
  let bo = {
    N: -90,
    S: 90,
    W: 180,
    E: -180,
  };
  _.forEach(latlngPairs, ([lat, lng]) => {
    if (!_.isNumber(lng) || !_.isNumber(lat)) return;
    bo.N = Math.max(lat, bo.N);
    bo.S = Math.min(lat, bo.S);
    bo.E = Math.max(lng, bo.E);
    bo.W = Math.min(lng, bo.W);
  });
  return __build_bounds(bo);
}
//------------------------------------------------
export function getLatlngObjBounds(latlngObjs: LngLatObj[]) {
  let bo = {
    N: -90,
    S: 90,
    W: 180,
    E: -180,
  };
  _.forEach(latlngObjs, ({ lat, lng }) => {
    if (!_.isNumber(lng) || !_.isNumber(lat)) return;
    bo.N = Math.max(lat, bo.N);
    bo.S = Math.min(lat, bo.S);
    bo.E = Math.max(lng, bo.E);
    bo.W = Math.min(lng, bo.W);
  });
  return __build_bounds(bo);
}
//------------------------------------------------
export function lnglatTupleToObj(lal: LngLatTuple): LngLatObj {
  let [lng, lat, alt] = lal;
  return { lng, lat, alt };
}
//------------------------------------------------
export function lnglatObjToTuple(lal: LngLatObj): LngLatTuple {
  let { lng, lat, alt } = lal;
  return [lng, lat, alt];
}
//------------------------------------------------
export function tidyLatLng(
  lal: LbsMapValue,
  precision: number = 6
): LbsMapValue {
  if (isLngLatTuple(lal)) {
    let [lng, lat] = lal;
    return [Num.precise(lng, precision), Num.precise(lat, precision)];
  }
  let { lng, lat } = lal;
  return {
    lng: Num.precise(lng, precision),
    lat: Num.precise(lat, precision),
  };
}
//------------------------------------------------
export function tidyLatLngData(
  lalData: LbsMapData,
  precision: number = 6
): LbsMapData {
  // 经纬度对象或者元组
  if (isLngLatTuple(lalData) || isLngLatObj(lalData)) {
    return tidyLatLng(lalData, precision);
  }
  // 经纬度点集
  if (_.isArray(lalData)) {
    let re: LbsMapValue[] = [];
    for (let lal of lalData) {
      re.push(tidyLatLng(lal, precision));
    }
    return re;
  }
  // 那么就是 GeoJson 了, 这个暂时不做处理
  return lalData;
}
//------------------------------------------------
