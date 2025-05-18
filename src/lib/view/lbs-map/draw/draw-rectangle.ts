import L from "leaflet";
import { LatLngObj, LatLngTuple } from "../ti-lbs-map-types";
import { draw_obj_list_as_point, draw_tuple_list_as_point } from "./draw-point";
import { LbsMapDrawingSetup } from "./draw-types";

//--------------------------------------
export function draw_obj_list_as_rectangle(
  latlngs: LatLngObj[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props, api } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  let [SW, NE] = latlngs;
  let swTuple: LatLngTuple = [SW.lat, SW.lng];
  let neTuple: LatLngTuple = [NE.lat, NE.lng];
  let $rect = L.rectangle([swTuple, neTuple], {
    color: "#08F",
    ...(props.polylineOptions ?? {}),
    ...(props.polygonOptions ?? {}),
    ...(props.rectangleOptions ?? {}),
  }).addTo($live);

  if (setup.showMarker) {
    draw_obj_list_as_point(latlngs, setup);
  }

  if (setup.autoFitBounds) {
    $map.fitBounds($rect.getBounds(), props.fitBoundsOptions);
  }

  return $rect;
}
//--------------------------------------
export function draw_tuple_list_as_rectangle(
  latlngs: LatLngTuple[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props, api } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  let [SW, NE] = latlngs;
  let $rect = L.rectangle([SW, NE], {
    color: "#08F",
    ...(props.polylineOptions ?? {}),
    ...(props.polygonOptions ?? {}),
    ...(props.rectangleOptions ?? {}),
  }).addTo($live);

  if (setup.showMarker) {
    draw_tuple_list_as_point(latlngs, setup);
  }

  if (setup.autoFitBounds) {
    $map.fitBounds($rect.getBounds(), props.fitBoundsOptions);
  }

  return $rect;
}
//--------------------------------------
