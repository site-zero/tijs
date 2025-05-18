import L from "leaflet";
import _ from "lodash";
import { IconInput, LogicType } from "../../../_type";
import { Icons, Num } from "../../../core";
import { translateCoordsForLatlngObj } from "./gis/use-lbs-coords";
import {
  getLBSMapStdTileLayer,
  isLBSMapStdTileType,
  LatLngObj,
  LBSMapData,
  LBSMapDrawContext,
  LBSMapEditMarkerIconOptions,
  LbsMapEmitter,
  LbsMapProps,
  LBSMapTileLayer,
  LBSMapValueCoords,
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

export function useLbsMap(
  props: LbsMapProps,
  _dc: LBSMapDrawContext,
  emit: LbsMapEmitter
) {
  // 初始化设置基础瓦片层坐标系
  _dc.baseTileCoords = getBaseTileCoords(props);
  //--------------------------------------------
  // 帮助方法
  //--------------------------------------------
  function Icon(
    urlOrIcon: IconInput,
    options: LBSMapEditMarkerIconOptions = {}
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
  function updateGeoInfo() { }

  //--------------------------------------
  function GeoStr(v?: number) {
    if (_.isUndefined(v)) return "";

    let p = props.latlngPrecise;
    let s = "" + Num.precise(v, p);
    let ss = s.split(".");
    ss[1] = _.padEnd(ss[1], p, "0");
    return ss.join(".");
  }
  //--------------------------------------
  function GeoPointStr(obj: LatLngObj) {
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
  function OnMapMove(evt: L.LeafletEvent) {
    let { $map } = _dc;
    if (!$map) {
      return;
    }
    //console.log("map move", evt)
    let now = Date.now();
    let bou = $map.getBounds();
    _dc.geo = {
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
    if (props.keepZoomBy) {
      Ti.Storage.local.set(this.keepZoomBy, this.geo.zoom);
    }
    // If cooling, notify
    if (!this.__check_cooling && this.cooling > 0) {
      this.__check_cooling = true;
      window.setTimeout(() => {
        this.checkMoveCooling();
      }, this.cooling + 10);
    }
    // lastMove for cooling
    this.lastMove = now;
  }
  //--------------------------------------
  function OnMapPointerClick(evt: L.LeafletMouseEvent) { }
  //--------------------------------------
  function OnMapPointerMove(evt: L.LeafletMouseEvent) { }

  //--------------------------------------
  // 通知改动
  //--------------------------------------
  function notifyChange(change: LBSMapData) {
    if (!_.isEqual(change, props.value)) {
      emit("change", change);
    }
  }

  //--------------------------------------
  // 返回特性
  //--------------------------------------
  return {
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
    notifyChange,
  };
}

export function getBaseTileCoords(props: LbsMapProps): LBSMapValueCoords {
  if (_.isEmpty(props.tileLayer)) {
    return "WGS84";
  }
  let tl = _.first(_.concat(props.tileLayer ?? []));
  if (!tl) {
    return "WGS84";
  }
  let tile: LBSMapTileLayer;
  if (isLBSMapStdTileType(tl)) {
    tile = getLBSMapStdTileLayer(tl);
  } else {
    tile = tl;
  }
  return tile.coords ?? "WGS84";
}
