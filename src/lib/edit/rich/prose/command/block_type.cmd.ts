import { setBlockType } from "prosemirror-commands";
import { EditorSchema } from "../ti-edit-rich-prose-types";

export function useBlockTypeCommands(schema: EditorSchema) {
  return {
    h1: setBlockType(schema.nodes.heading, { level: 1 }), // 标题1
    h2: setBlockType(schema.nodes.heading, { level: 2 }), // 标题2
    h3: setBlockType(schema.nodes.heading, { level: 3 }), // 标题3
    h4: setBlockType(schema.nodes.heading, { level: 4 }), // 标题4
    h5: setBlockType(schema.nodes.heading, { level: 5 }), // 标题5
    h6: setBlockType(schema.nodes.heading, { level: 6 }), // 标题6
    p: setBlockType(schema.nodes.paragraph, { level: 6 }), // 正文
  };
}
