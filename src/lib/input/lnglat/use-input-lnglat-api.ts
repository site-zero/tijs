import {
  Be,
  isLngLatObj,
  isLngLatTuple,
  LbsMapProps,
  LbsMapValue,
  LngLatObj,
  lnglatTupleToObj,
  openAppModal,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { InputLngLatEmitter, InputLngLatProps } from "./ti-input-lnglat-types";

export type InputLngLatSetup = {
  emit: InputLngLatEmitter;
  getElement: () => HTMLElement | null;
  getLngElement: () => HTMLElement | null;
  getLatElement: () => HTMLElement | null;
};

export function useInputLatLngApi(
  props: InputLngLatProps,
  setup: InputLngLatSetup
) {
  let { emit, getElement, getLngElement, getLatElement } = setup;
  //-----------------------------------------------------
  // 数据处理
  //-----------------------------------------------------
  const ValueType = computed(() => {
    if (props.valueType) {
      return props.valueType;
    }
    if (props.value) {
      if (isLngLatObj(props.value)) {
        return "obj";
      }
      if (isLngLatTuple(props.value)) {
        return "tuple";
      }
    }
    return "obj";
  });
  //-----------------------------------------------------
  function getLatLngObj() {
    if (isLngLatTuple(props.value)) {
      return lnglatTupleToObj(props.value);
    }
    if (isLngLatObj(props.value)) {
      return props.value;
    }
  }
  //-----------------------------------------------------
  function toLatLngValue(lal: LngLatObj): LbsMapValue {
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
      //model: { event: "change", data: "value" },
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
  function doCopyValue(mode: "lng" | "lat" | "all" = "all") {
    let lal = getLatLngObj() ?? { lat: 0, lng: 0 };
    let val = toLatLngValue(lal);
    let str = JSON.stringify(val);
    let ele = getElement();
    if ("lng" == mode) {
      str = String(lal.lng);
      ele = getLngElement() ?? ele;
    } else if ("lat" == mode) {
      str = String(lal.lat);
      ele = getLatElement() ?? ele;
    }
    Be.Clipboard.write(str);
    Be.BlinkIt(ele);
  }
  //-----------------------------------------------------
  function onUpdate(key: keyof LngLatObj, val: any) {
    if (_.isNil(val)) {
      update({ [key]: 0 });
    }
    // 确保是合法的值
    else {
      let v = val * 1;
      if (isNaN(v)) {
        v = -1;
      }
      update({ [key]: v });
    }
  }
  //-----------------------------------------------------
  function update(delta: Partial<LngLatObj>) {
    if (!_.isEmpty(delta)) {
      let lal = getLatLngObj() ?? { lat: 0, lng: 0 };
      _.assign(lal, delta);
      let val = toLatLngValue(lal);
      notifyChange(val);
    }
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
    doCopyValue,
    onUpdate,
    notifyChange,
  };
}
