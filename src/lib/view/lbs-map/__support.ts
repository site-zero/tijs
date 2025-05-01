import L from "leaflet";
import _ from "lodash";
import { IconInput, LogicType } from "../../../_type";
import { Icons } from "../../../core";
import { LBSMapDrawContext, LBSMapEditMarkerIconOptions, LbsMapProps } from "./ti-lbs-map-types";


export type LBSMapIconOptions = Partial<{
    // 整体大小，默认 32
    size?: number,
    className: any,
    color: LogicType,
    // 图标大小: [24, 41]
    iconSize: [number, number],
    // 锚点位置: [12, 41]
    iconAnchor: [number, number],
    // 显示阴影
    shadow: boolean | string,
    // 阴影大小: [41, 41]
    shadowSize: [number, number],
    // 阴影锚点: [12, 41]
    shadowAnchor: [number, number],
}>;

export function Icon(
    _dc: LBSMapDrawContext,
    urlOrIcon: IconInput,
    options: LBSMapEditMarkerIconOptions = {}) {
    let { props } = _dc;
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
            shadowUrl = GetIconSrc(props, shadowUrl)
        }
        return L.icon({
            iconUrl: GetIconSrc(props, icon.src),
            className,
            iconSize, iconAnchor,
            shadowUrl, shadowSize, shadowAnchor
        })
    }

    // Keep original input
    throw `Invalid icon type: ${urlOrIcon}`
}

//--------------------------------------
function GetIconSrc(props: LbsMapProps, src: string) {
    if (/^(https?:\/\/|\/)/.test(src)) {
        return src
    }
    return `${props.imageIconBase}${src}`
}

//--------------------------------------
function updateGeoInfo(_dc:LBSMapDrawContext){

}