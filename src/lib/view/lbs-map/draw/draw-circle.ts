import L from "leaflet";
import { isLatLngObj, LbsMapValue } from "../ti-lbs-map-types";
import { draw_obj_as_point, draw_tuple_as_point } from "./draw-point";
import { LbsMapDrawingSetup } from "./draw-types";

//--------------------------------------
export function draw_point_as_circle(
  latlng: LbsMapValue,
  setup: LbsMapDrawingSetup,
  autoFitBounds?: boolean
) {
  let { _dc, props, api } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live || !props.circleRadius) {
    return;
  }

  let $circle = L.circle(latlng, {
    radius: props.circleRadius,
    color: "#08F",
    ...(props.polylineOptions ?? {}),
    ...(props.circleOptions ?? {}),
  }).addTo($live);

  if (props.showMarker) {
    if (isLatLngObj(latlng)) {
      draw_obj_as_point(latlng, setup);
    } else {
      draw_tuple_as_point(latlng, setup);
    }
  }

  let afb = autoFitBounds ?? props.autoFitBounds;
  if (afb) {
    $map.fitBounds($circle.getBounds(), props.fitBoundsOptions);
  }

  return $circle;
}

//--------------------------------------
export function draw_list_as_circle(
  latlngs: LbsMapValue[],
  setup: LbsMapDrawingSetup
) {
  let { _dc, props, api } = setup;
  // 防空
  let { $map, $live } = _dc;
  if (!$map || !$live || !props.circleRadius) {
    return;
  }
  for (let lal of latlngs) {
    draw_point_as_circle(lal, setup, false);
  }
}
