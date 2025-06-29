import { toggleMark } from "prosemirror-commands";
import { EditorSchema } from "../ti-edit-rich-prose-types";

export function useToggleMarkCommands(schema: EditorSchema) {
  return {
    B: toggleMark(schema.marks.strong),
    I: toggleMark(schema.marks.em),
    U: toggleMark(schema.marks.underline),
    code: toggleMark(schema.marks.code),
  };
}
