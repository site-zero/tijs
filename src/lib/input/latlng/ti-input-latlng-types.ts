import { CommonProps } from "../../../_type";
import { LbsMapEditPointMode, LbsMapProps, LbsMapValue, LbsMapValueCoords, LbsMapValueType } from "../../view/all-views";

export type InputLatLngEmitter = {
  (event: "change", payload: any): void;
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
  valueType?: LbsMapValueType;
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
  editPoint?: Omit<LbsMapEditPointMode, 'none'>;

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
};