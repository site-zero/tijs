import _ from "lodash";
import { getLBSMapStdTileLayer, isLBSMapStdTileType, LbsMapProps, LBSMapTileLayer, LBSMapTileLayerInput, LBSMapStdTileType, LBSMapValueCoords } from "./ti-lbs-map-types";

export function useLLTileLayer(LL: any, props: Pick<LbsMapProps, 'valueCoords' | 'tileLayer'>) {
    let coords = props.valueCoords ?? 'WGS84';
    let tileLayerList: LBSMapTileLayerInput[] = [];
    if (!props.tileLayer || _.isEmpty(props.tileLayer)) {
        tileLayerList = [({
            GCJ02: 'GAODE_ROADMAP',
            BD09: 'GAODE_ROADMAP',
            WGS84: 'TIANDITU_VECTOR_NOTE',
        } as Record<LBSMapValueCoords, LBSMapStdTileType>)[coords]]
    }
    // 循环处理
    else if (_.isArray(props.tileLayer)) {
        tileLayerList = props.tileLayer
    }
    // 仅仅一个瓦片层
    else {
        tileLayerList = [props.tileLayer]
    }

    // 循环处理瓦片层
    for (let it of tileLayerList) {
        createLLTileLayer(LL, it)
    }
}

function createLLTileLayer(LL: any, tileLayer: LBSMapTileLayerInput) {
    let tile: LBSMapTileLayer;
    if (isLBSMapStdTileType(tileLayer)) {
        tile = getLBSMapStdTileLayer(tileLayer)
    } else {
        tile = _.cloneDeep(tileLayer);
    }
    return LL.tileLayer(tile.url, tile.options ?? {});
}