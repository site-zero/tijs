import L from "leaflet";
import _ from "lodash";
import {
  getLbsMapStdTileLayer,
  isLbsMapStdTileType,
  LbsMapProps,
  LbsMapStdTileType,
  LBSMapTileLayer,
  LbsMapTileLayerInput,
  LbsMapValueCoords,
} from "./ti-lbs-map-types";

export function useTileLayer(
  props: Pick<LbsMapProps, "valueCoords" | "tileLayer">
) {
  let coords = props.valueCoords ?? "WGS84";
  let tileLayerList: LbsMapTileLayerInput[] = [];
  if (!props.tileLayer || _.isEmpty(props.tileLayer)) {
    tileLayerList = [
      (
        {
          GCJ02: "GAODE_ROADMAP",
          BD09: "GAODE_ROADMAP",
          WGS84: "TIANDITU_VECTOR_NOTE",
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
    createTileLayer(it);
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
