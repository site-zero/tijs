import { FormProps, TableProps, Vars } from "@site0/tijs";

export type EditRecordsEmitter = {
  (event: "change", payload: any): void;
};

export type EditRecordsProps = {
  keepName?: string;
  value?: Vars[];

  /**
   * 表格的设置，如果不指定，则默认当作 `value|text|tip` 的对象来处理
   */
  table?: Omit<TableProps, "data" | "keepColumns" | "currentId" | "checkedIds">;

  form?: Omit<FormProps, "data">;
  /**
   * 延迟通知改动的时间，单位毫秒
   * 默认值 500
   */
  emitDelay?: number;
};
