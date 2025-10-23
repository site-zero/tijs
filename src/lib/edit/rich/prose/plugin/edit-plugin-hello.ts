import { Plugin, PluginKey } from "prosemirror-state";

const helloKey = new PluginKey("hello");

export const helloPlugin = () =>
  new Plugin({
    key: helloKey,
    state: {
      init() {
        return { count: 0 };
      },
      apply(tr, value) {
        const meta = tr.getMeta(helloKey);
        return meta?.increase ? { count: value.count + 1 } : value;
      },
    },
    props: {
      handleKeyDown(view, e) {
        if (e.key === "h" && e.ctrlKey) {
          const tr = view.state.tr;
          tr.setMeta(helloKey, { increase: true });
          tr.insertText("👋");
          view.dispatch(tr);
          return true; // 已处理，停止冒泡
        }
      },
      handlePaste(_view, e, slice) {
        const text = slice.content.textBetween(
          0,
          slice.content.size,
          "\n\n",
          " "
        );
        console.log("hello:handlePaste", { e, slice: text });
        return true;
      },
    },
  });
