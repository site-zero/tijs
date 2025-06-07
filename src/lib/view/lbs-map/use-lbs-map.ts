import L from "leaflet";
import _ from "lodash";
import { IconInput, LogicType } from "../../../_type";
import { Icons, Num } from "../../../core";
import { useKeep } from "../../_features";
import { translateCoordsForLatlngObj } from "./gis/use-lbs-coords";
import { tidyLatLngData } from "./gis/use-lbs-support";
import {
  getLbsMapStdTileLayer,
  isLbsMapStdTileType,
  LatLngObj,
  LbsMapData,
  LbsMapDrawContext,
  LbsMapEditMarkerIconOptions,
  LbsMapEmitter,
  LbsMapProps,
  LbsMapTileLayer,
  LbsMapValueCoords,
} from "./ti-lbs-map-types";

export type LbsMapApi = ReturnType<typeof useLbsMap>;

export type LbsMapIconOptions = {
  // 整体大小，默认 32
  size?: number;
  className?: any;
  color?: LogicType;
  // 图标大小: [24, 41]
  iconSize?: [number, number];
  // 锚点位置: [12, 41]
  iconAnchor?: [number, number];
  // 显示阴影
  shadow?: boolean | string;
  // 阴影大小: [41, 41]
  shadowSize?: [number, number];
  // 阴影锚点: [12, 41]
  shadowAnchor?: [number, number];
};

/**
 * 该函数用于初始化 LBS 地图相关功能，处理地图的图标、坐标转换、事件响应等操作。
 *
 * @param props - LBS 地图的属性配置
 * @param _dc - LBS 地图的绘制上下文
 * @param emit - 用于触发事件函数
 * @returns 返回一个包含各种地图操作方法的接口对象
 */
export function useLbsMap(
  props: LbsMapProps,
  _dc: LbsMapDrawContext,
  emit: LbsMapEmitter
) {
  //--------------------------------------------
  // 初始化设置基础瓦片层坐标系
  _dc.baseTileCoords = getBaseTileCoords(props);
  //--------------------------------------------
  // 持久化
  //--------------------------------------------
  const _keep = useKeep(props.keepZoomBy);
  function loadLocalZoom() {
    _dc.geo.value.zoom = _keep.loadNumber(props.zoom);
  }
  //--------------------------------------------
  // 帮助方法
  //--------------------------------------------
  function Icon(
    urlOrIcon: IconInput,
    options: LbsMapEditMarkerIconOptions = {}
  ) {
    if (!urlOrIcon) return new L.Icon.Default();

    let {
      size = 32,
      className,
      color = "primary",
      iconSize = [24, 41],
      iconAnchor = [12, 41],
      shadow = true,
      shadowSize = [41, 41],
      shadowAnchor = [12, 41],
    } = options;

    // Eval the icon
    let icon = Icons.parseIcon(urlOrIcon);

    // Font icon
    if ("font" == icon.type) {
      let html = Icons.fontIconHtml(icon);
      let ansz = size / 2;
      return L.divIcon({
        className: `ti-gsi-mark-icon 
                        is-size-${size} 
                        is-color-${color}
                        ${shadow ? "has-shadow" : ""}`,
        html,
        iconSize: [size, size],
        iconAnchor: [ansz, ansz],
      });
    }

    // Image Icon
    if ("image" == icon.type && icon.src) {
      let shadowUrl: string | undefined = undefined;
      if (shadow) {
        if (_.isBoolean(shadow)) {
          let [_, nmPath, suffix] = /^([^.]+)\.(\w+)$/.exec(icon.src) || [];
          shadowUrl = `${nmPath}-shadow.${suffix}`;
        } else {
          shadowUrl = shadow;
        }
        shadowUrl = GetIconSrc(shadowUrl);
      }
      return L.icon({
        iconUrl: GetIconSrc(icon.src),
        className,
        iconSize,
        iconAnchor,
        shadowUrl,
        shadowSize,
        shadowAnchor,
      });
    }

    // Keep original input
    throw `Invalid icon type: ${urlOrIcon}`;
  }

  //--------------------------------------
  function GetIconSrc(src: string) {
    if (/^(https?:\/\/|\/)/.test(src)) {
      return src;
    }
    return `${props.imageIconBase}${src}`;
  }

  //--------------------------------------
  function updateGeoInfo() {}

  //--------------------------------------
  function GeoStr(v?: number) {
    if (_.isUndefined(v)) return "";

    let p = props.displayPrecision ?? 6;
    let s = "" + Num.precise(v, p);
    let ss = s.split(".");
    ss[1] = _.padEnd(ss[1], p, "0");
    return ss.join(".");
  }
  //--------------------------------------
  function GeoPointStr(obj?: LatLngObj) {
    if (!obj) {
      return "";
    }
    let ss = [GeoStr(obj.lat), GeoStr(obj.lng)];
    return ss.join(", ");
  }
  //--------------------------------------
  // 数据转换方法
  //--------------------------------------
  const _val_coords = props.valueCoords ?? "WGS84";
  //--------------------------------------
  function trans_obj_from_tiles_to_value(obj: LatLngObj) {
    return translateCoordsForLatlngObj(_dc.baseTileCoords, _val_coords, obj);
  }
  function trans_obj_from_value_to_tiles(obj: LatLngObj) {
    return translateCoordsForLatlngObj(_val_coords, _dc.baseTileCoords, obj);
  }
  //--------------------------------------

  //--------------------------------------
  // 响应事件
  //--------------------------------------
  function OnMapMove(_evt: L.LeafletEvent) {
    let { $map } = _dc;
    if (!$map) {
      return;
    }
    //console.log("map move", $map.getZoom());
    let now = Date.now();
    let bou = $map.getBounds();
    _dc.geo.value = {
      zoom: $map.getZoom(),
      center: bou.getCenter(),
      SW: bou.getSouthWest(),
      SE: bou.getSouthEast(),
      NE: bou.getNorthEast(),
      NW: bou.getNorthWest(),
      W: bou.getWest(),
      E: bou.getEast(),
      S: bou.getSouth(),
      N: bou.getNorth(),
    };
    // Keep zoom in local
    if (_keep.enabled) {
      _keep.save(_dc.geo.value.zoom);
    }
    // If cooling, notify
    if (!_dc.is_check_cooling && _dc.cooling > 0) {
      _dc.is_check_cooling = true;
      window.setTimeout(() => {
        checkMoveCooling();
      }, _dc.cooling + 10);
    }
    // lastMove for cooling
    _dc.lastMove = now;
  }
  //--------------------------------------
  function OnMapPointerClick(evt: L.LeafletMouseEvent) {
    _dc.pointerClick.value = evt.latlng;
  }
  //--------------------------------------
  function OnMapPointerMove(evt: L.LeafletMouseEvent) {
    _dc.pointerHover.value = evt.latlng;
  }

  //--------------------------------------
  // 通知改动
  //--------------------------------------
  function checkMoveCooling() {
    let now = Date.now();
    let isCooling = now - _dc.lastMove > _dc.cooling;
    if (isCooling || !_dc.lastMove) {
      _dc.is_check_cooling = false;
      //console.log("notify map move", this.geo)
      emit("map:move", _dc.geo.value);
    } else {
      window.setTimeout(() => {
        checkMoveCooling();
      }, _dc.cooling / 2);
    }
  }
  //--------------------------------------
  function notifyChange(change: LbsMapData) {
    let delta = tidyLatLngData(change, props.valuePrecision);
    if (!_.isEqual(delta, props.value)) {
      emit("change", delta);
    }
  }

  //--------------------------------------
  // 返回特性
  //--------------------------------------
  return {
    loadLocalZoom,
    Icon,
    GetIconSrc,
    updateGeoInfo,
    GeoStr,
    GeoPointStr,
    // 数据转换方法
    trans_obj_from_tiles_to_value,
    trans_obj_from_value_to_tiles,
    // 响应事件
    OnMapMove,
    OnMapPointerClick,
    OnMapPointerMove,
    // 通知改动
    checkMoveCooling,
    notifyChange,
  };
}

export function getBaseTileCoords(props: LbsMapProps): LbsMapValueCoords {
  if (_.isEmpty(props.tileLayer)) {
    return "WGS84";
  }
  let tl = _.first(_.concat(props.tileLayer ?? []));
  if (!tl) {
    return "WGS84";
  }
  let tile: LbsMapTileLayer;
  if (isLbsMapStdTileType(tl)) {
    tile = getLbsMapStdTileLayer(tl);
  } else {
    tile = tl;
  }
  return tile.coords ?? "WGS84";
}
