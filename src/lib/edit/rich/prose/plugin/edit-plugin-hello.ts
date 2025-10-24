import _ from "lodash";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const helloKey = new PluginKey("hello");

export const helloProsePlugin = () =>
  new Plugin({
    key: helloKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, oldSet) {
        // 1. 让旧装饰器随改动自动位移
        let newSet = oldSet.map(tr.mapping, tr.doc);

        // 2. 删掉上一次的高亮
        newSet = newSet.remove(newSet.find());

        // 3. 如果仅仅是光标（没拖选），就高亮单词
        const { selection } = tr;
        //console.log("hello::apply", _.pick(selection, "from", "to", "empty"));
        // if (selection.empty) {
        //   const pos = tr.selection.from;
        //   const dom = () => {
        //     const btn = document.createElement("span");
        //     btn.textContent = "⚑";
        //     btn.style.cssText = "color:red;cursor:pointer;margin-left:4px";
        //     btn.title = "点我试试";
        //     btn.addEventListener("click", () => alert("widget 被点了"));
        //     return btn;
        //   };
        //   const deco = Decoration.widget(pos, dom, { side: 1 });
        //   newSet = newSet.add(tr.doc, [deco]);
        // }

        return newSet;
      },
    },
    props: {
      decorations(state) {
        return helloKey.getState(state);
      },
      //   handleKeyDown(view, e) {
      //     if (e.key === "h" && e.ctrlKey && e.altKey) {
      //       const tr = view.state.tr;
      //       tr.setMeta(helloKey, { increase: true });
      //       tr.insertText("👋");
      //       view.dispatch(tr);
      //       return true; // 已处理，停止冒泡
      //     }
      //   },
      //   handleDOMEvents: {
      //     click: (view, e) => {
      //       const tr = view.state.tr;
      //       console.log("hello:handleDOMEvents:click", {
      //         from: tr.selection.from,
      //         to: tr.selection.to,
      //       });
      //     },
      //   },
      //   handlePaste(_view, e, slice) {
      //     const text = slice.content.textBetween(
      //       0,
      //       slice.content.size,
      //       "\n\n",
      //       " "
      //     );
      //     console.log("hello:handlePaste", { e, slice: text });
      //     return true;
      //   },
    },
  });
