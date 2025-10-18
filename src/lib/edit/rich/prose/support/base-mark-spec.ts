import OrderedMap from "orderedmap";
import { MarkSpec } from "prosemirror-model";

export function getBaseMarkSpec(): OrderedMap<MarkSpec> {
  return OrderedMap.from({
    // 加粗标记
    strong: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b" },
        { style: "font-weight=bold" },
      ],
      toDOM: () => ["strong", 0],
    },
    // 斜体标记
    em: {
      parseDOM: [{ tag: "em" }, { tag: "i" }, { style: "font-style=italic" }],
      toDOM: () => ["em", 0],
    },
    // 行内代码标记
    code: {
      parseDOM: [{ tag: "code" }],
      toDOM: () => ["code", 0],
    },
    // 下划线
    underline: {
      parseDOM: [{ tag: "u" }],
      toDOM: () => ["u", 0],
    },
  });
}
