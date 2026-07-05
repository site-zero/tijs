import {
  ActionBarProps,
  FormProps,
  SelectableProps,
  TableProps,
  TableRowID,
  Vars,
} from "@site0/tijs";
import { EditRecordsApi } from "./use-edit-records-api";

export type EditRecordsEmitter = {
  (event: "change", payload: any): void;
};

export type EditRecordsProps = Pick<SelectableProps<TableRowID>, "getId"> & {
  keepName?: string;
  value?: Vars[];

  /**
   * 表格的设置，如果不指定，则默认当作 `value|text|tip` 的对象来处理
   */
  table?: Partial<
    Omit<
      TableProps,
      "getId" | "data" | "keepColumns" | "currentId" | "checkedIds"
    >
  >;

  form?: Omit<FormProps, "data">;

  actionBar?: ActionBarProps;

  /**
   * 如何生成新项目 ID
   */
  newIdSetup?: EditRecordNewIdSetup;

  /**
   * 指定了如何创建新项目，如果不设置该项目，则默认不能创建新项目。
   * 如果是模版对象，会调用 `explain` 它的上下文是
   *
   * ```
   * {
   *    id: "xxx",  // 新记录的自动分配 ID
   *    len: 10     // 一共有多少记录
   * }
   * ```
   */
  newItem?: EditRecordNewItem;

  /**
   * 延迟通知改动的时间，单位毫秒
   * 默认值 500
   */
  emitDelay?: number;
};

export type EditRecordNewIdSetup = {
  n?: number;
  prefix?: string;
};

export type EditRecordNewItem =
  | Vars
  | ((api: EditRecordsApi) => Promise<Vars | undefined>)
  | ((api: EditRecordsApi) => Vars | undefined);
