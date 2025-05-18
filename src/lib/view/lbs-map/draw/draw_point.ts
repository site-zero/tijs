import L, { LatLngTuple } from 'leaflet';
import _ from 'lodash';
import { LatLngObj, LBSMapDrawContext, LbsMapProps } from "../ti-lbs-map-types";
import { LbsMapApi } from "../use-lbs-map";
import { DrawPointSetup } from "./draw-types";
import { __customize_marker_behaviors } from './customize_marker';

export function draw_obj_as_point(latlng: LatLngObj, setup: DrawPointSetup) {
    let { _dc, props, api } = setup;
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
    __customize_marker_behaviors($marker, latlng, setup)

    return $marker
}
//-------------------------------------------------------
export function draw_tuple_as_point(lalTuple: LatLngTuple, setup: DrawPointSetup) {
    setup.convert = ({ lat, lng }) => [lat, lng] as LatLngTuple
    let [lat, lng] = lalTuple;
    return draw_obj_as_point({ lat, lng }, setup);
}
//-------------------------------------------------------
export function draw_obj_list_as_point(list: LatLngObj[], setup: DrawPointSetup) {
    let { _dc, props, api } = setup;
    // 防空
    let { $map, $live } = _dc;
    if (!$map || !$live) {
        return;
    }

    // 准备转换函数
    let convert = setup.convert ?? ((lal: LatLngObj) => lal);
    _.forEach(list, (latlng, index) => {
        let $marker = L.marker(latlng, {
            autoPan: true
        }).addTo($live)

        // Add customized value
        const targetIndex = index;
        const oldLatLng = latlng;

        // Can edit by drag
        if ("drag" == props.editPoint) {
            $marker.dragging?.enable()
            $marker.on("dragend", ({ target }) => {
                let newLatlng = target.getLatLng()
                newLatlng = api.trans_obj_from_tiles_to_value(newLatlng)
                newLatlng = convert(newLatlng)

                let list = _.cloneDeep(props.value) as LatLngObj[]
                list[targetIndex] = newLatlng
                api.notifyChange(list);
            })
        }

        // Customized Icon
        __customize_marker_behaviors($marker, latlng, setup)
    })
}
//-------------------------------------------------------
export function draw_tuple_list_as_point(list: LatLngTuple[], setup: DrawPointSetup) {
    setup.convert = ({ lat, lng }) => [lat, lng]
    let objs = _.map(list, ([lat, lng]) => ({ lat, lng }))
    draw_obj_list_as_point(objs, setup)
}
//-------------------------------------------------------