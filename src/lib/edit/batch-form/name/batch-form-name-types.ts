import { CommonProps } from "@site0/tijs";

export type BatchFormNameEmitter = {
  (event: "change", payload: any): void;
};

export type BatchFormNameProps = CommonProps & {
  title: string;
  name: string | string[];
  checkedNames: Record<string, boolean>;
};
