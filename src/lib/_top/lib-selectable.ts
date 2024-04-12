import { Convertor, Vars } from '../../core';

export type SelectableProps<ID extends string | number> = {
  /**
   * 传入的数据对象
   */
  data: Vars[];
  /**
   * 从指定的对象获取 ID
   *
   * - `string` : 表示一个数据键，将通过 `_.get` 获取值，这个值必须是 `T`
   *              或者可以被 `anyConvertor` 转换的值
   * - `Function` : 一个获取 ID 的函数
   */
  getId: Convertor<Vars, ID | undefined> | string;

  /**
   * 是否支持多重选择
   */
  multi?: boolean;

  /**
   * 将任何值转换为 `T`
   */
  convertToId: Convertor<any, ID | undefined>;

  currentId?: ID;
  checkedIds?: Record<ID, boolean> | Map<ID, boolean>;
};
