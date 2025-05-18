import {
  LatLngObj,
  LbsMakerOptions,
  LBSMapData,
  LbsMapDrawContext,
  LbsMapProps,
} from "../ti-lbs-map-types";
import { LbsMapApi } from "../use-lbs-map";

export type LbsMapDrawingSetup = LbsMakerOptions & {
  _dc: LbsMapDrawContext;
  props: LbsMapProps;
  api: LbsMapApi;
  // 通知改动前，需要转换为什么值的形式
  // 默认为 LatLngObj ，不转换
  convert?: (lal: LatLngObj) => LBSMapData;

  showMarker?: boolean;
  autoFitBounds?: boolean;
};
