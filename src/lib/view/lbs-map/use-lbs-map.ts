import L, { LatLng } from "leaflet";
import _ from "lodash";
import { IconInput, LogicType } from "../../../_type";
import { Icons, Num } from "../../../core";
import { LatLngObj, LBSMapDrawContext, LBSMapEditMarkerIconOptions, LbsMapProps } from "./ti-lbs-map-types";

export type LbsMapApi = ReturnType<typeof useLbsMap>

export type LbsMapIconOptions = {
    // 整体大小，默认 32
    size?: number,
    className?: any,
    color?: LogicType,
    // 图标大小: [24, 41]
    iconSize?: [number, number],
    // 锚点位置: [12, 41]
    iconAnchor?: [number, number],
    // 显示阴影
    shadow?: boolean | string,
    // 阴影大小: [41, 41]
    shadowSize?: [number, number],
    // 阴影锚点: [12, 41]
    shadowAnchor?: [number, number],
};

export function useLbsMap(props: LbsMapProps, _dc: LBSMapDrawContext) {
    //--------------------------------------------
    // 帮助方法
    //--------------------------------------------
    function Icon(
        urlOrIcon: IconInput,
        options: LBSMapEditMarkerIconOptions = {}) {
        if (!urlOrIcon)
            return new L.Icon.Default()

        let {
            size = 32,
            className,
            color = "primary",
            iconSize = [24, 41],
            iconAnchor = [12, 41],
            shadow = true,
            shadowSize = [41, 41],
            shadowAnchor = [12, 41]
        } = options;

        // Eval the icon
        let icon = Icons.parseIcon(urlOrIcon)

        // Font icon
        if ("font" == icon.type) {
            let html = Icons.fontIconHtml(icon);
            let ansz = size / 2
            return L.divIcon({
                className: `ti-gsi-mark-icon 
                        is-size-${size} 
                        is-color-${color}
                        ${shadow ? 'has-shadow' : ''}`,
                html,
                iconSize: [size, size],
                iconAnchor: [ansz, ansz]
            })
        }

        // Image Icon
        if ("image" == icon.type && icon.src) {
            let shadowUrl: string | undefined = undefined;
            if (shadow) {
                if (_.isBoolean(shadow)) {
                    let [_, nmPath, suffix] = /^([^.]+)\.(\w+)$/.exec(icon.src) || [];
                    shadowUrl = `${nmPath}-shadow.${suffix}`
                } else {
                    shadowUrl = shadow;
                }
                shadowUrl = GetIconSrc(shadowUrl)
            }
            return L.icon({
                iconUrl: GetIconSrc(icon.src),
                className,
                iconSize, iconAnchor,
                shadowUrl, shadowSize, shadowAnchor
            })
        }

        // Keep original input
        throw `Invalid icon type: ${urlOrIcon}`
    }

    //--------------------------------------
    function GetIconSrc(src: string) {
        if (/^(https?:\/\/|\/)/.test(src)) {
            return src
        }
        return `${props.imageIconBase}${src}`
    }

    //--------------------------------------
    function updateGeoInfo() {

    }

    //--------------------------------------
    function GeoStr(v?: number) {
        if (_.isUndefined(v))
            return ""

        let p = props.latlngPrecise;
        let s = '' + Num.precise(v, p);
        let ss = s.split('.')
        ss[1] = _.padEnd(ss[1], p, '0')
        return ss.join('.')
    }
    //--------------------------------------
    function GeoPointStr(obj: LatLngObj) {
        let ss = [
            GeoStr(obj.lat),
            GeoStr(obj.lng)
        ]
        return ss.join(", ");
    }
    //--------------------------------------
    // 初始化地图组件
    //--------------------------------------
    
    //--------------------------------------
    // 返回特性
    //--------------------------------------
    return {
        Icon, GetIconSrc, updateGeoInfo,
        GeoStr, GeoPointStr
    }
}