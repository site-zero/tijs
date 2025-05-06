import _ from 'lodash'
import { latlngObjToTuple, translateCoordsForLatlngObj, translateCoordsForLatlngTuple } from "./gis"
import { GeoJson, LatLngObj, LatLngTuple, LbsMapProps, LBSMapValue, LBSMapValueCoords, LBSMapValueType } from "./ti-lbs-map-types"

export function getMapData(props: LbsMapProps, baseTileCoords: LBSMapValueCoords) {
  let val = props.value
  if (_.isEmpty(val)) {
    val = undefined
  }
  // Guard
  if (val && !props.defaultLocation) {
    return null
  }

  return evalMapData(
    baseTileCoords, props.valueCoords ?? 'WGS84',
    val, props.valueType, props.defaultLocation)
  //   return this.evalMapData({
  //     val,
  //     valType: this.valueType,
  //     dftLo: this.defaultLocation
  //   }) 
}

function evalMapData(
  baseTileCoords: LBSMapValueCoords,
  valueCoords: LBSMapValueCoords,
  // LBSMapValue | LBSMapValue[] | GeoJson
  value: any,
  valType: LBSMapValueType = 'obj',
  // SAME as value
  dftLo?: any): LBSMapValue | LBSMapValue[] | GeoJson {

  // 处理对象
  if ('obj' == valType) {
    let lal: LatLngObj = value || dftLo;
    return translateCoordsForLatlngObj(
      valueCoords, baseTileCoords, lal);
  }

  // 处理对象列表
  if ('obj-list' == valType) {
    let re: LatLngObj[] = []
    for (let lal of value) {
      let { lat, lng } = translateCoordsForLatlngObj(
        valueCoords, baseTileCoords,
        lal as LatLngObj);
      re.push({ lat, lng })
    }
    return re;
  }

  // 元组
  if ('tuple' == valType) {
    let lal: LatLngTuple = value || dftLo;
    return translateCoordsForLatlngTuple(
      valueCoords, baseTileCoords, lal)
  }

  // 处理元组列表
  if ('tuple-list' == valType) {
    let re: LatLngTuple[] = []
    for (let lal of value) {
      let [lat, lng] = translateCoordsForLatlngTuple(
        valueCoords, baseTileCoords,
        lal as LatLngTuple);
      re.push([lat, lng])
    }
    return re;
  }

  // Geo Json
  if ('geojson' == valType) {
    if (!value) {
      return {
        type: "Point",
        coordinates: latlngObjToTuple(dftLo)
      }
    }
    return value as GeoJson
  }

  throw `Invalid valType: '${valType}'`
}