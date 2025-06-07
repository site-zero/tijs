import _ from "lodash";
import { computed } from "vue";
import { LbsMapProps, openAppModal } from "../../";
import {
  isLatLngObj,
  isLatLngTuple,
  LatLngObj,
  LbsMapValue,
} from "../../view/all-views";
import { latlngTupleToObj } from "../../view/lbs-map/gis";
import { InputLatLngEmitter, InputLatLngProps } from "./ti-input-latlng-types";

export function useInputLatLngApi(
  props: InputLatLngProps,
  emit: InputLatLngEmitter
) {
  //-----------------------------------------------------
  // 数据处理
  //-----------------------------------------------------
  const ValueType = computed(() => {
    if (props.valueType) {
      return props.valueType;
    }
    if (props.value) {
      if (isLatLngObj(props.value)) {
        return "obj";
      }
      if (isLatLngTuple(props.value)) {
        return "tuple";
      }
    }
    return "obj";
  });
  //-----------------------------------------------------
  function getLatLngObj() {
    if (isLatLngTuple(props.value)) {
      return latlngTupleToObj(props.value);
    }
    if (isLatLngObj(props.value)) {
      return props.value;
    }
  }
  //-----------------------------------------------------
  function toLatLngValue(lal: LatLngObj): LbsMapValue {
    let { lat, lng } = lal;
    if ("tuple" == ValueType.value) {
      return [lat, lng];
    }
    return { lat, lng };
  }
  //-----------------------------------------------------
  // 打开编辑界面
  //-----------------------------------------------------
  async function doEditPoint() {
    // 只读模式防守一下
    if (props.readonly) {
      return;
    }

    // 准备数据
    let lal = getLatLngObj();

    // 打开编辑框
    let re = await openAppModal({
      icon: "zmdi-pin-drop",
      title: "i18n:edit",
      position: "top",
      type: "primary",
      width: "90%",
      height: "90%",
      minWidth: "640px",
      minHeight: "480px",
      clickMaskToClose: true,
      result: lal ?? { lat: 39.9987, lng: 116.4026 },
      comType: "TiLbsMap",
      comConf: {
        valueType: "obj",
        valuePrecision: props.valuePrecision,
        valueCoords: props.valueCoords,
        editPoint: props.editPoint ?? "drag",
        showInfo: {
          zoom: true,
          pointerHover: true,
        },
        ...props.mapOptions,
      } as LbsMapProps,
    });

    // 用户取消
    if (!re) {
      return;
    }

    // 转换值的格式并通知改动
    let val = toLatLngValue(re);
    notifyChange(val);
  }
  //-----------------------------------------------------
  // 事件处理
  //-----------------------------------------------------
  function doClearValue() {
    emit("change", null);
  }
  //-----------------------------------------------------
  function notifyChange(val: LbsMapValue) {
    if (!_.isEqual(props.value, val)) {
      emit("change", val);
    }
  }
  //-----------------------------------------------------
  // 返回操作接口
  //-----------------------------------------------------
  return {
    doEditPoint,
    doClearValue,
    notifyChange,
  };
}
