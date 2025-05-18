import { LatLngObj, LBSMakerOptions, LBSMapData, LBSMapDrawContext, LbsMapProps } from "../ti-lbs-map-types";
import { LbsMapApi } from "../use-lbs-map";

export type DrawPointSetup = LBSMakerOptions & {
    _dc: LBSMapDrawContext,
    props: LbsMapProps,
    api: LbsMapApi,
    // 通知改动前，需要转换为什么值的形式
    // 默认为 LatLngObj ，不转换
    convert?: (lal: LatLngObj) => LBSMapData;
}

export type DrawPolylineSetup = DrawPointSetup & {
    showMarker?: boolean;
    autoFitBounds?: boolean;
}