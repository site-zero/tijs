import { TableProps, Vars } from "@site0/tijs";

export type EditTableEmitter = {
  (event: "change", payload: any): void;
};

export type EditTableProps = Omit<TableProps, "data"> & {
  value?: Vars[];
};
