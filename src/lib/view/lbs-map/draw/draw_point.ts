import L, { LatLngTuple } from 'leaflet';
import _ from 'lodash';
import { LatLngObj, LBSMapDrawContext, LbsMapProps } from "../ti-lbs-map-types";
import { LbsMapApi } from "../use-lbs-map";
import { DrawPointSetup } from "./draw-types";
import { __customize_marker_behaviors } from './customize_marker';

function draw_obj_as_point(_dc: LBSMapDrawContext, props: LbsMapProps, api: LbsMapApi, latlng: LatLngObj, setup: DrawPointSetup = {}) {
    // 防空
    let { $map, $live } = _dc;
    if (!$map || !$live) {
        return;
    }

    // 绘制点
    let convert = setup.convert ?? ((lal: LatLngObj) => lal);
    let $marker = L.marker(latlng, {
        autoPan: true
    }).addTo($live);

    // Save old data
    const oldLatLng = latlng

    // Can edit by drag
    if ("drag" == props.editPoint) {
        $marker.dragging?.enable()
        $marker.on("dragend", ({ target }) => {
            let newLatlng = target.getLatLng()
            newLatlng = api.trans_obj_from_tiles_to_value(newLatlng)
            let newData = convert(newLatlng)
            api.notifyChange(newData)
        })
    }
    // Can edit by move map
    else if ("pin" == props.editPoint) {
        $map.on("move", () => {
            let newLatlng: LatLngObj = { ...$map.getCenter() };
            newLatlng = api.trans_obj_from_value_to_tiles(newLatlng);
            $marker.setLatLng(newLatlng)
        })
        $map.on("moveend", () => {
            let newLatlng: LatLngObj = { ...$map.getCenter() };
            let newData = convert(newLatlng)
            api.notifyChange(newData)
        })
    }

    // Customized Icon
    __customize_marker_behaviors(_dc, api, $marker, latlng, setup)

    return $marker
}
//--------------------------------------
function draw_tuple_as_point(_dc: LBSMapDrawContext, props: LbsMapProps, api: LbsMapApi, lalTuple: LatLngTuple, setup: DrawPointSetup = {}) {
    setup.convert = ({ lat, lng }) => [lat, lng] as LatLngTuple
    let [lat, lng] = lalTuple;
    return draw_obj_as_point(_dc, props, api, { lat, lng }, setup);
}