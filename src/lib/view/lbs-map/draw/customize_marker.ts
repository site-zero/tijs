import _ from "lodash";
import { Vars } from "../../../..";
import { I18n, Util } from "../../../../core";
import { LBSMakerOptions, LatLngObj ,LBSMapDrawContext} from "../ti-lbs-map-types";
import { Icon } from "../__support";

export function __customize_marker_behaviors(_dc: LBSMapDrawContext, $marker: any, obj: LatLngObj, options: LBSMakerOptions = {}) {
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
            $marker.setIcon(Icon(_dc, icon, markerIconOptions))
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