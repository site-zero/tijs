import L from "leaflet";
import { LngLatObj, LngLatTuple } from "../ti-lbs-map-types";
import { draw_obj_list_as_point, draw_tuple_list_as_point } from "./draw-point";
import { LbsMapDrawingSetup } from "./draw-types";

//--------------------------------------
export function draw_obj_list_as_polyline(
  latlngs: LngLatObj[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  let $polyline = L.polyline(latlngs, {
    color: "#08F",
    ...(props.polylineOptions || {}),
  }).addTo($live);

  if (setup.showMarker) {
    draw_obj_list_as_point(latlngs, setup);
  }

  if (setup.autoFitBounds) {
    $map.fitBounds($polyline.getBounds(), props.fitBoundsOptions);
  }

  return $polyline;
}
//--------------------------------------
export function draw_tuple_list_as_polyline(
  latlngs: LngLatTuple[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  let $polyline = L.polyline(latlngs, {
    color: "#08F",
    ...(props.polylineOptions || {}),
  }).addTo($live);

  if (setup.showMarker) {
    draw_tuple_list_as_point(latlngs, setup);
  }

  if (setup.autoFitBounds) {
    $map.fitBounds($polyline.getBounds(), props.fitBoundsOptions);
  }

  return $polyline;
}
