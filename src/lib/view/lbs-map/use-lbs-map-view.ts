import _ from "lodash";
import { getLBSMapStdTileLayer, isLatLngObj, isLatLngTuple, isLBSMapStdTileType, LatLngObj, LBSMapData, LBSMapDrawContext, LbsMapProps, LBSMapTileLayer, LBSMapValueCoords } from "./ti-lbs-map-types";
import { getBounds, getLatlngObjBounds, getLatlngTupleBounds, latlngObjToTuple, latlngTupleToObj, translateCoordsForLatlngObj } from "./gis";
import L, { LatLngTuple } from 'leaflet'
import { useLLTileLayer } from "./use-lbs-map-tiles";

export function initMap(getMainElement: () => HTMLElement | null, props: LbsMapProps, _dc: LBSMapDrawContext, mapData: LBSMapData | null) {
    let $main = getMainElement();
    if (!$main) {
        return;
    }
    // 注销已经存在的 Map
    if (_dc.$live) {
        _dc.$live.off()
        _dc.$live.remove();
        _dc.$live = undefined;
    }
    if (_dc.$map) {
        _dc.$map.off();
        _dc.$map.remove();
        _dc.$map = undefined;
    }
    // Create Map
    _dc.$map = L.map($main, {
        ...props.mapOptions,
        attributionControl: false,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom
    });

    L.control.scale({
        metric: true,
        imperial: false,
        updateWhenIdle: true
    }).addTo(_dc.$map);

    // Create the main bg-layer
    useLLTileLayer(props);

    // Events
    _dc.$map.on("move", (evt) => { this.OnMapMove(evt) })
    _dc.$map.on("click", (evt) => { this.OnMapPointerClick(evt) })
    _dc.$map.on("mousemove", (evt) => { this.OnMapPointerMove(evt) })

    // Prepare live layer for the presentation of value data 
    _dc.$live = L.layerGroup().addTo(_dc.$map)


    // Init map view
    initMapView(props, _dc, mapData);

    // Then Render the data
    redrawMap(props, _dc, mapData);
}

export function initMapView(props: LbsMapProps, _dc: LBSMapDrawContext, mapData: LBSMapData | null) {
    //console.log("initMapView")
    // Get current zoom, keep the last user zoom state
    let zoom = _dc.geo.zoom || props.zoom

    let fromCoords = props.valueCoords ?? 'WGS84'
    let toCoords = _dc.baseTileCoords;

    // Default view
    if (mapData && _dc.$map) {
        // 采用北京作为默认的位置
        let lal: LatLngObj = {
            lat: 39.97773512677837,
            lng: 116.3385673945887
        }
        if (props.defaultLocation) {
            if (isLatLngObj(props.defaultLocation)) {
                lal = props.defaultLocation
            } else if (isLatLngTuple(props.defaultLocation)) {
                lal = latlngTupleToObj(props.defaultLocation);
            } else {
                throw 'Invalid defaultLocation: ' + props.defaultLocation
            }
        }
        let dftCenter = translateCoordsForLatlngObj(fromCoords, toCoords, lal);
        _dc.$map.setView(dftCenter, zoom)
        return
    }

    // Auto fit the data
    //..................................
    if ("obj" == props.valueType) {
        let lal = mapData as LatLngObj;
        _dc.$map!.setView(lal, zoom)
    }
    //..................................
    else if ("obj-list" == props.valueType) {
        let list = mapData as LatLngObj[];
        if (list.length > 1) {
            let gr = getLatlngObjBounds(list)
            let SW = latlngObjToTuple(gr.SW)
            let NE = latlngObjToTuple(gr.NE)
            _dc.$map!.fitBounds([SW, NE])

        } else if (list.length == 1) {
            let latlng = list[0]
            _dc.$map!.setView(latlng, zoom)
        }
    }
    //..................................
    else if ("tuple" == props.valueType) {
        let lal = latlngTupleToObj(mapData as LatLngTuple)
        _dc.$map!.setView(lal, zoom)
    }
    //..................................
    else if ("tuple-list" == props.valueType) {
        let list = mapData as LatLngTuple[];
        if (list.length > 1) {
            let gr = getLatlngTupleBounds(list)
            let SW = latlngObjToTuple(gr.SW)
            let NE = latlngObjToTuple(gr.NE)
            _dc.$map!.fitBounds([SW, NE])
        } else if (list.length == 1) {
            let latlng = list[0]
            _dc.$map!.setView(latlng, zoom)
        }
    }
    //..................................
    else if ("geojson" == props.valueType) {
        throw "Not implement geojson get center"
    }
    //..................................
}

function redrawMap(props: LbsMapProps, _dc: LBSMapDrawContext, mapData: LBSMapData | null) {
    let { $map, $live } = _dc;
    if (!$map || !$live) {
        return;
    }

    $map.invalidateSize()
    // Prepare the function name

    // Clear live layer
    //$live.clearLayers()

    // Draw data
    if (mapData) {
        let func = this[this.RedrawFuncName]
        if (_.isFunction(func)) {
            func(this.MapData, {
                autoFitBounds: this.autoFitBounds,
                showMarker: this.showMarker,
                markerIcon: this.markerIcon,
                markerIconOptions: this.markerIconOptions,
                markerPopup: this.markerPopup,
                markerPopupOptions: this.markerPopupOptions
            })
        } else {
            throw `Invalid RedrawFuncName="${this.RedrawFuncName}"`
        }
    }
}
