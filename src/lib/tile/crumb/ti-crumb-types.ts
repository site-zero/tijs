import {
  CommonProps,
  IconInput,
  SelectableProps,
  StdListItemProps,
  TableRowID,
  TextFragment,
  Vars,
} from "@site0/tijs";

export type CrumbEmitter = {
  (event: "change", payload: any): void;
};

export type CrumbProps = CommonProps &
  Omit<StdListItemProps, "getValue"> & {
    /**
     * 传入的数据对象
     */
    data?: Vars[];

    /**
     * 当前选中的项的 ID
     */
    currentItemId?: TableRowID;

    /**
     * 获取项的 ID
     *
     * @param it 项的原始数据对象
     * @returns 项的 ID
     */
    getValue?: string | ((it: Vars) => TableRowID);

    /**
     * 点击项时，触发 change 的参数
     *
     * - `id`: 参数值为 ID
     * - `std-item`: 参数值为标准对象
     * - `raw-item`: 参数值为原始对象
     *
     * @default 'id'
     */
    emitValueType?: "id" | "std-item" | "raw-item";

    /**
     * 如果没有数据项，显示什么占位信息
     */
    emptyRoadblock?: {
      text?: string;
      icon?: IconInput;
    };
    //-----------------------------------------------------
    // 头部和尾部的可配置扩展槽
    //-----------------------------------------------------
    head?: TextFragment;
    tail?: TextFragment;
  };
