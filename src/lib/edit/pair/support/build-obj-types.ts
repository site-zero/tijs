import { EditPairsProps } from "../edit-pairs-types";

export type GenObjFormFieldSetup = Pick<
  EditPairsProps,
  "titles" | "icons" | "tips" | "fields" | "defaultFields"
>;
