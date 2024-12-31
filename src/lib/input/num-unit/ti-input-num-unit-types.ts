import { InputBoxProps, InputNumProps } from '../../';
import { AspectSize, Vars } from '../../../_type';

export type InputNumUnitEmitter = (event: 'change', payload: Vars) => void;

export type InputNumUnitProps = Omit<InputNumProps, 'value'> & {
  //-----------------------------------------------------
  // 处理值
  //-----------------------------------------------------
  /**
   * 值是一个对象，有两个键，默认被认为是:
   * `{number:456.24, unit:'KG'}`
   * 当然，你可以通过 (get/set)(Number/Unit) 重新定义这个对象
   */
  value?: Vars;
  getNumber?: string | ((vars: Vars) => number);
  setNumber?: string | ((vars: Vars, num: number) => void);
  getUnit?: string | ((vars: Vars) => string);
  setUnit?: string | ((vars: Vars, unit: string) => void);
  /**
   * 如果 setNumber 不是自定义函数，那么将值设置到 value
   * 的时候，是否需要转换为字符串（主要是为浮点数考虑）
   */
  numAsStr?: boolean;
  /**
   * 如果未能取到数字，那么是否需要给个默认值，默认是 `0`
   */
  defaultNumber?: number;
  /**
   * 如果未能取到单位，那么是否需要给个默认值
   */
  defaultUnit?: string;
  //-----------------------------------------------------
  // 处理单位
  //-----------------------------------------------------
  units?: Omit<InputBoxProps, 'value'>;
  /**
   * 单位是否支持直接输入，true 标识只能下拉选择
   */
  unitSelectOnly?: boolean;
  //-----------------------------------------------------
  // 显示
  //-----------------------------------------------------
  unitWidth?: string | number;
  gap?: AspectSize;
  style?: Vars;
};
