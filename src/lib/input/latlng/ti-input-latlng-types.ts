import { CommonProps } from "../../../_type";
import {
  LbsMapProps,
  LbsMapValue,
  LbsMapValueCoords,
} from "../../view/all-views";
import { InputBoxAspect } from "../all-input";

export type InputLatLngEmitter = {
  (event: "change", payload: LbsMapValue | null): void;
};

export type InputLatLngProps = CommonProps & {
  /**
   * 值，可以是对象，也可以是元组
   */
  value?: LbsMapValue;

  /**
   * 对于没有值的清空，初次编辑值将会生成 Obj 还是 Tuple
   * 在这里可以指定。
   */
  valueType?: "obj" | "tuple";
  /**
   * 修改时，处理值的精度，默认`6`
   */
  valuePrecision?: number;
  /**
   * 值的坐标系，默认 `WGS84`
   */
  valueCoords?: LbsMapValueCoords;

  /**
   * 地图编辑模式: 'drag' | 'pin'
   */
  editPoint?: "drag" | "pin";

  /**
   * 是否只读
   */
  readonly?: boolean;

  /**
   * 是否可以直接输入经纬度，当然，只读模式下这个属性无效
   */
  canInput?: boolean;

  /**
   * 地图编辑器的定制属性
   */
  mapOptions?: LbsMapProps;

  boxAspect?: InputBoxAspect;
};
