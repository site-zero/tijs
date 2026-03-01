import { FormProps, Vars } from "@site0/tijs";

export type TiBatchFormEmitter = {
  (eventName: "change", payload: Vars): void;
};

export type TiBatchFormProps = Omit<FormProps, "defaultFieldTitleBy"> & {};
