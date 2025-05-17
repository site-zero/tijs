import { LatLngObj, LBSMakerOptions, LBSMapData } from "../ti-lbs-map-types";

export type DrawPointSetup = LBSMakerOptions & {
    convert?: (lal: LatLngObj) => LBSMapData;
}