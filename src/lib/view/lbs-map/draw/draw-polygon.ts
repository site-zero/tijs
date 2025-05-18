import L from "leaflet";
import { LatLngObj, LatLngTuple } from "../ti-lbs-map-types";
import { draw_obj_list_as_point, draw_tuple_list_as_point } from "./draw-point";
import { LbsMapDrawingSetup } from "./draw-types";

//--------------------------------------
export function draw_obj_list_as_polygon(
  latlngs: LatLngObj[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  let $polygon = L.polygon(latlngs, {
    color: "#08F",
    ...(props.polylineOptions || {}),
    ...(props.polygonOptions || {}),
  }).addTo($live);

  if (setup.showMarker) {
    draw_obj_list_as_point(latlngs, setup);
  }

  if (setup.autoFitBounds) {
    $map.fitBounds($polygon.getBounds(), props.fitBoundsOptions);
  }

  return $polygon;
}
//--------------------------------------
export function draw_tuple_list_as_polygon(
  latlngs: LatLngTuple[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  let $polygon = L.polyline(latlngs, {
    color: "#08F",
    ...(props.polylineOptions || {}),
    ...(props.polygonOptions || {}),
  }).addTo($live);

  if (setup.showMarker) {
    draw_tuple_list_as_point(latlngs, setup);
  }

  if (setup.autoFitBounds) {
    $map.fitBounds($polygon.getBounds(), props.fitBoundsOptions);
  }

  return $polygon;
}
