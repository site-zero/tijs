import { FormProps, Vars } from "@site0/tijs";

export type BatchFormEmitter = {
  (eventName: "change", payload: Vars): void;
};

export type BatchFormProps = Omit<FormProps, "defaultFieldTitleBy"> & {};
