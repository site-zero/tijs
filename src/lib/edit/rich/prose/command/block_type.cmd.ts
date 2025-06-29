import { setBlockType } from "prosemirror-commands";
import { EditorSchema } from "../ti-edit-rich-prose-types";

export function useBlockTypeCommands(schema: EditorSchema) {
  return {
    h1: setBlockType(schema.nodes.heading, { level: 1 }),
    h2: setBlockType(schema.nodes.heading, { level: 2 }),
    h3: setBlockType(schema.nodes.heading, { level: 3 }),
    h4: setBlockType(schema.nodes.heading, { level: 4 }),
    h5: setBlockType(schema.nodes.heading, { level: 5 }),
    h6: setBlockType(schema.nodes.heading, { level: 6 }),
    p: setBlockType(schema.nodes.paragraph, { level: 6 }),
  };
}
