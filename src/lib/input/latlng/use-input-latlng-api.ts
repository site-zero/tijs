import { isLatLngTuple, LatLngObj } from "../../../lib";
import { latlngTupleToObj } from "../../view/lbs-map/gis";
import { InputLatLngEmitter, InputLatLngProps } from "./ti-input-latlng-types";

export function useInputLatLngApi(props: InputLatLngProps, _emit: InputLatLngEmitter) {

    /**
     * 归一化输入属性
     * @returns  标准经纬度对象
     */
    function getLatLngObj(): LatLngObj | undefined {
        if (isLatLngTuple(props.value)) {
            return latlngTupleToObj(props.value)
        }
        if (props.value) {
            return props.value;
        }
    }



    return {
        getLatLngObj,
    }
}