import L from 'leaflet';
import { LatLngObj, LatLngTuple } from "../ti-lbs-map-types";
import { DrawPolylineSetup } from "./draw-types";
import { draw_obj_list_as_point, draw_tuple_list_as_point } from "./draw_point";

//--------------------------------------
export function draw_obj_list_as_polyline(latlngs: LatLngObj[], setup: DrawPolylineSetup) {
    let { _dc, props } = setup;
    // 防空
    let { $map, $live } = _dc;
    if (!$map || !$live) {
        return;
    }

    let $polyline = L.polyline(latlngs, {
        color: '#08F',
        ...(props.polylineOptions || {}),
    }).addTo($live);

    if (setup.showMarker) {
        draw_obj_list_as_point(latlngs, setup)
    }

    if (setup.autoFitBounds) {
        $map.fitBounds($polyline.getBounds(), props.fitBoundsOptions);
    }

    return $polyline
}
//--------------------------------------
export function draw_pair_list_as_polyline(latlngs: LatLngTuple[], setup: DrawPolylineSetup) {
    let { _dc, props } = setup;
    // 防空
    let { $map, $live } = _dc;
    if (!$map || !$live) {
        return;
    }

    let $polyline = L.polyline(latlngs, {
        color: '#08F',
        ...(props.polylineOptions || {}),
    }).addTo($live);

    if (setup.showMarker) {
        draw_tuple_list_as_point(latlngs, setup)
    }

    if (setup.autoFitBounds) {
        $map.fitBounds($polyline.getBounds(), props.fitBoundsOptions);
    }

    return $polyline
}