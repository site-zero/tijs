import L from "leaflet";
import _ from "lodash";
import { isLatLngObj, LbsMapValue } from "../ti-lbs-map-types";
import { draw_obj_as_point, draw_tuple_as_point } from "./draw-point";
import { LbsMapDrawingSetup } from "./draw-types";

//--------------------------------------
export function draw_list_as_cluster(
  latlngs: LbsMapValue[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props, api } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live || _.isEmpty(latlngs)) {
    return;
  }

  var $cluster = (L as any).markerClusterGroup();
  for (let lal of latlngs) {
    if (isLatLngObj(lal)) {
      draw_obj_as_point(lal, setup)?.addTo($cluster);
    } else {
      draw_tuple_as_point(lal, setup)?.addTo($cluster);
    }
  }
  $live.addLayer($cluster);

  return $cluster;
}
