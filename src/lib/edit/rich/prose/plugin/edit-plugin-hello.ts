import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const helloKey = new PluginKey("hello");

export const helloPlugin = () =>
  new Plugin({
    key: helloKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, oldSet) {
        // 1. 让旧装饰器随改动自动位移
        let decos = oldSet.map(tr.mapping, tr.doc);
        // 2. 删掉上一次的高亮
        decos = decos.remove(decos.find());
        // 3. 如果仅仅是光标（没拖选），就高亮单词
        const { selection } = tr;
        if (selection.empty) {
          const $pos = selection.$head;
          const wordRange = $pos.parent
            .textBetween($pos.start(), $pos.end(), null, "\ufffc")
            .match(/(^|\s)(\w+)/g); // 简单取单词
          if (wordRange) {
            const from = $pos.start() + wordRange.index! + wordRange[1].length;
            const to = from + wordRange[2].length;
            const deco = Decoration.inline(from, to, {
              style: "background:#5fa2dd",
            });
            decos = decos.add(tr.doc, [deco]);
          }
        }
        return decos;
      },
    },
    props: {
      decorations(state) {
        return helloKey.getState(state);
      },
      handleKeyDown(view, e) {
        if (e.key === "h" && e.ctrlKey) {
          const tr = view.state.tr;
          tr.setMeta(helloKey, { increase: true });
          tr.insertText("👋");
          view.dispatch(tr);
          return true; // 已处理，停止冒泡
        }
      },
      handleDOMEvents: {
        click: (view, e) => {
          const tr = view.state.tr;
          console.log("hello:handleDOMEvents:click", {
            from: tr.selection.from,
            to: tr.selection.to,
          });
        },
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
