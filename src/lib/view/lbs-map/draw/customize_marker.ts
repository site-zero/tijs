import _ from "lodash";
import { Vars } from "../../../..";
import { I18n, Util } from "../../../../core";
import { LatLngObj, LBSMakerOptions } from "../ti-lbs-map-types";
import { LbsMapApi } from "../use-lbs-map";


export function __customize_marker_behaviors(
    _api: LbsMapApi,
    $marker: any, obj: LatLngObj, options: LBSMakerOptions = {}) {
    let {
        markerIcon,
        markerIconOptions = {},
        markerPopup,
        markerPopupOptions = {}
    } = options;

    // Customized Icon
    if (markerIcon) {
        let icon = Util.explainObj(obj, markerIcon, {
            evalFunc: true
        })
        //console.log({icon})
        if (icon) {
            let ii = _api.Icon(icon, markerIconOptions);
            $marker.setIcon(ii)
        }
    }
    // Customized popup
    if (markerPopup) {
        let popup = Util.explainObj(obj, markerPopup, {
            evalFunc: true
        })
        // Eval the html
        let html;
        // For Array
        if (_.isArray(popup)) {
            let list = _.map(popup, li => `<li>${li}</li>`)
            html = `<ul>${list.join("")}</ul>`
        }
        // For Object pair
        else if (_.isPlainObject(popup)) {
            let rows = _.map(popup as Vars, (v, k) => {
                let text = I18n.text(k)
                return `<tr><td>${text}</td><td>${v}</td></tr>`
            })
            html = `<table>${rows.join("")}</table>`
        }
        // For HTML
        else {
            html = popup
        }

        // HTML
        $marker.bindPopup(html, markerPopupOptions).openPopup();
    }
}