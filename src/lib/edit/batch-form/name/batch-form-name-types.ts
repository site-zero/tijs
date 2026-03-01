import { CommonProps } from "@site0/tijs";

export type BatchFormNamePayload = {
  name: string | string[];
  checked: boolean;
};

export type BatchFormNameEmitter = {
  (event: "change", payload: boolean): void;
};

export type BatchFormNameProps = CommonProps & {
  title: string;
  name: string | string[];
  checkedNames: Record<string, boolean>;
};
