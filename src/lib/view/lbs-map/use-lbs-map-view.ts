import L from "leaflet";
import _ from "lodash";
import { draw_map_data } from "./draw";
import {
  getLatlngObjBounds,
  getLatlngTupleBounds,
  latlngObjToTuple,
  latlngTupleToObj,
  translateCoordsForLatlngObj,
} from "./gis";
import {
  isLatLngObj,
  isLatLngTuple,
  LatLngObj,
  LatLngTuple,
  LbsMapDrawContext,
  LbsMapProps,
} from "./ti-lbs-map-types";
import { LbsMapApi } from "./use-lbs-map";
import { useTileLayer } from "./use-lbs-map-tiles";
import markerIcon  from './icon/marker-icon.png'
import markerShadow from './icon/marker-shadow.png'
import markerIcon2x from './icon/marker-icon-2x.png'

//console.log(markerIcon)

// 修复默认图标路径问题
function fixLeafletIcons() {
  // const iconRetinaUrl = new URL(
  //   "assets/img/marker-icon-2x.png",
  //   import.meta.url
  // ).href;
  // const iconUrl = new URL("assets/img/marker-icon.png", import.meta.url)
  //   .href;
  // const shadowUrl = new URL(
  //   "assets/img/marker-shadow.png",
  //   import.meta.url
  // ).href;

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl:markerIcon,
    shadowUrl:markerShadow,
  });
}

export function initMap(
  getMainElement: () => HTMLElement | null,
  props: LbsMapProps,
  _dc: LbsMapDrawContext,
  api: LbsMapApi
) {
  //console.log("initMap", props.valueCoords, props.tileLayer);
  let $main = getMainElement();
  if (!$main) {
    console.warn("Map main element is not found, cannot initialize map.");
    return;
  }

  fixLeafletIcons();

  // 注销已经存在的 Map
  if (_dc.$live) {
    _dc.$live.off();
    _dc.$live.remove();
    _dc.$live = undefined;
  }
  if (_dc.$map) {
    _dc.$map.off();
    _dc.$map.remove();
    _dc.$map = undefined;
  }
  // 回复本地 zoom
  api.loadLocalZoom();

  // Create Map
  _dc.$map = L.map($main, {
    ...(props.mapOptions || {}),
    zoomControl: true,
    attributionControl: false,
    zoom: _dc.geo.value.zoom ?? props.zoom,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
  });

  // Create consol
  L.control
    .scale({
      metric: true,
      imperial: false,
      updateWhenIdle: true,
    })
    .addTo(_dc.$map);

  // Create the main bg-layer
  useTileLayer(props, _dc);

  // Events
  _dc.$map.on("move", (evt) => {
    // Zoom/Move 会触发这个
    api.OnMapMove(evt);
  });
  _dc.$map.on("click", (evt) => {
    api.OnMapPointerClick(evt);
  });
  _dc.$map.on("mousemove", (evt) => {
    api.OnMapPointerMove(evt);
  });

  // Prepare live layer for the presentation of value data
  _dc.$live = L.layerGroup().addTo(_dc.$map);

  // Init map view
  initMapView(props, _dc);

  // Then Render the data
  redrawMap(props, _dc, api);

  // 监控容器尺寸变化
  if (_dc.resizeObserver) {
    _dc.resizeObserver.disconnect();
  }
  _dc.resizeObserver = new ResizeObserver(() => {
    _dc.$map?.invalidateSize();
  });
  _dc.resizeObserver.observe($main);
}

export function initMapView(props: LbsMapProps, _dc: LbsMapDrawContext) {
  // console.log("initMapView");
  // Get current zoom, keep the last user zoom state
  let mapData = _dc.mapData.value;
  let zoom = _dc.geo.value.zoom ?? props.zoom;

  let fromCoords = props.valueCoords ?? "WGS84";
  let toCoords = _dc.baseTileCoords;

  // Default view
  if (_dc.$map) {
    // 采用【北京】作为默认的位置
    let lal: LatLngObj = {
      lat: 39.907576,
      lng: 116.391275,
    };
    if (props.center) {
      if (isLatLngObj(props.center)) {
        lal = props.center;
      } else if (isLatLngTuple(props.center)) {
        lal = latlngTupleToObj(props.center);
      } else {
        throw "Invalid defaultLocation: " + props.center;
      }
    }
    // 自动采用值
    else if (
      props.value &&
      (props.valueType == "obj" || props.valueType == "tuple")
    ) {
      // 元组值
      if (_.isArray(props.value)) {
        lal = latlngTupleToObj(props.value as LatLngTuple);
      }
      // 那么必然就是对象值
      else {
        lal = props.value as LatLngObj;
      }
    }
    let dftCenter = translateCoordsForLatlngObj(fromCoords, toCoords, lal);
    _dc.$map.setView(dftCenter, zoom);
    return;
  }

  // Auto fit the data
  //..................................
  if ("obj" == props.valueType) {
    let lal = mapData as LatLngObj;
    _dc.$map!.setView(lal, zoom);
  }
  //..................................
  else if ("obj-list" == props.valueType) {
    let list = mapData as LatLngObj[];
    if (list.length > 1) {
      let gr = getLatlngObjBounds(list);
      let SW = latlngObjToTuple(gr.SW);
      let NE = latlngObjToTuple(gr.NE);
      _dc.$map!.fitBounds([SW, NE]);
    } else if (list.length == 1) {
      let latlng = list[0];
      _dc.$map!.setView(latlng, zoom);
    }
  }
  //..................................
  else if ("tuple" == props.valueType) {
    let lal = latlngTupleToObj(mapData as LatLngTuple);
    _dc.$map!.setView(lal, zoom);
  }
  //..................................
  else if ("tuple-list" == props.valueType) {
    let list = mapData as LatLngTuple[];
    if (list.length > 1) {
      let gr = getLatlngTupleBounds(list);
      let SW = latlngObjToTuple(gr.SW);
      let NE = latlngObjToTuple(gr.NE);
      _dc.$map!.fitBounds([SW, NE]);
    } else if (list.length == 1) {
      let latlng = list[0];
      _dc.$map!.setView(latlng, zoom);
    }
  }
  //..................................
  else if ("geojson" == props.valueType) {
    throw "Not implement geojson get center";
  }
  //..................................
}

export function redrawMap(
  props: LbsMapProps,
  _dc: LbsMapDrawContext,
  api: LbsMapApi
) {
  let { $map, $live } = _dc;
  if (!$map || !$live) {
    return;
  }

  $map.invalidateSize();
  // Prepare the function name

  // Clear live layer
  $live.clearLayers();

  // Draw data
  if (_dc.mapData.value) {
    draw_map_data({
      _dc,
      props,
      api,
      autoFitBounds: props.autoFitBounds,
      showMarker: props.showMarker,
      markerIcon: props.markerIcon,
      markerIconOptions: props.markerIconOptions,
      markerPopup: props.markerPopup,
      markerPopupOptions: props.markerPopupOptions,
    });
  }
}
