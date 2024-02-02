import { TiComSet } from "../";
import { TiUnkownInfo } from "../tile/unknown/ti-unknown-index";
import { TiIconInfo } from "./icon/ti-icon-index";
import { TiLabelInfo } from "./label/ti-label-index";
import { TiRoadblockInfo } from "./roadblock/ti-roadblock-index";
import { TiLoadingInfo } from "./loading/ti-loading-index";

export default {
  "TiIcon": TiIconInfo,
  "TiLabel": TiLabelInfo,
  "TiUnknown": TiUnkownInfo,
  "TiRoadblock": TiRoadblockInfo,
  "TiLoading": TiLoadingInfo
} as TiComSet;

export { TiUnknown } from "../tile/unknown/ti-unknown-index";
export { TiIcon } from "./icon/ti-icon-index";
export { TiLabel } from "./label/ti-label-index";
export { TiRoadblock } from "./roadblock/ti-roadblock-index";
export { TiLoading } from "./loading/ti-loading-index";

