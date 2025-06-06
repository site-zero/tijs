import L from "leaflet";
import _ from "lodash";
import {
  getLbsMapStdTileLayer,
  isLbsMapStdTileType,
  LbsMapDrawContext,
  LbsMapProps,
  LbsMapStdTileType,
  LBSMapTileLayer,
  LbsMapTileLayerInput,
  LbsMapValueCoords,
} from "./ti-lbs-map-types";

export function useTileLayer(
  props: Pick<LbsMapProps, "valueCoords" | "tileLayer">,
  _dc: LbsMapDrawContext
) {
  // 防空
  if (!_dc.$map) {
    console.warn("Map is not initialized, cannot add tile layers.");
    return;
  }
  let coords = props.valueCoords ?? "WGS84";
  let tileLayerList: LbsMapTileLayerInput[] = [];
  if (!props.tileLayer || _.isEmpty(props.tileLayer)) {
    tileLayerList = [
      (
        {
          GCJ02: "QQ_VECTOR_NOTE",
          BD09: "GOOGLE_VECTOR_CN",
          WGS84: "CARTO_ALL",
        } as Record<LbsMapValueCoords, LbsMapStdTileType>
      )[coords],
    ];
  }
  // 循环处理
  else if (_.isArray(props.tileLayer)) {
    tileLayerList = props.tileLayer;
  }
  // 仅仅一个瓦片层
  else {
    tileLayerList = [props.tileLayer];
  }

  // 循环处理瓦片层
  for (let it of tileLayerList) {
    createTileLayer(it).addTo(_dc.$map!);
  }
}

function createTileLayer(tileLayer: LbsMapTileLayerInput) {
  let tile: LBSMapTileLayer;
  if (isLbsMapStdTileType(tileLayer)) {
    tile = getLbsMapStdTileLayer(tileLayer);
  } else {
    tile = _.cloneDeep(tileLayer);
  }
  return L.tileLayer(tile.url, tile.options ?? {});
}
