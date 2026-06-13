import _ from "lodash";
import { Dom } from "../../..";
import { DomSelector } from "../../../_type";

export type EditItOptions = Partial<{
  /**
   * 是否是多行文本
   *
   * @default `false`
   */
  multi: boolean;
  /**
   * 多行文本下，回车是否表示确认。
   * 如果回车表示确认，那么 `CTRL`+回车则表示换行
   *
   * @default `false`
   */
  enterAsConfirm: boolean;
  /**
   * 多行文本上，输出的值新行用 BR 替换。
   *
   * @default `false`
   */
  newLineAsBr: boolean;
  /**
   * 初始文字，如果没有给定，采用 Element 的文本
   */
  text: string;
  /**
   * 是否自动去掉前后空白
   *
   * @default `true``
   */
  trim: boolean;
  /**
   * 指定宽度，没有指定(小于等于0)则默认采用宿主元素的宽度
   */
  width: number;
  /**
   * 指定高度，没有指定(小于等于0)则默认采用宿主元素的高度
   */
  height: number;
  /**
   * 自动延伸宽度。
   * 主要是普通单行模式，随着输入内容变多，输入框也自动延长
   *
   * @default `true`
   */
  extendWidth: boolean;
  /**
   * 自动延伸高度
   * 主要是多行文本模式下有用，随着输入内容的换行
   * 文本框也自动变高
   *
   * @default `true`
   */
  extendHeight: boolean;

  /**
   * 当显示输入框，是否全选文字（仅当非 multi 模式有效）
   *
   * @default `true`
   */
  selectOnFocus: boolean;
}>;

type EditField = HTMLInputElement | HTMLTextAreaElement;

function toEditFieldText(input = "", newLineAsBr = false) {
  if (newLineAsBr) {
    return input.replace(/<br\s*\/?\s*>/gi, "\n");
  }
  return input;
}

function normalizeOutputText(input = "", trim = true, newLineAsBr = false) {
  let text = trim ? _.trim(input) : input;
  if (newLineAsBr) {
    text = text.replace(/\r?\n/g, "<br>");
  }
  return text;
}

function isRectChanged(a: DOMRect, b: DOMRect, delta = 0.5) {
  return (
    Math.abs(a.left - b.left) > delta ||
    Math.abs(a.top - b.top) > delta ||
    Math.abs(a.width - b.width) > delta ||
    Math.abs(a.height - b.height) > delta
  );
}

function selectFieldText($field: EditField) {
  _.delay(() => {
    $field.focus();
    if ($field instanceof HTMLInputElement) {
      $field.select();
      return;
    }
    let len = $field.value.length;
    $field.setSelectionRange(0, len);
  }, 0);
}

function placeCaretAtEnd($field: EditField) {
  _.delay(() => {
    $field.focus();
    let len = $field.value.length;
    $field.setSelectionRange(len, len);
  }, 0);
}

function createTextMirror(
  doc: Document,
  computed: CSSStyleDeclaration,
  baseWidth: number
) {
  return Dom.createElement({
    $p: doc.body,
    tagName: "span",
    style: {
      position: "fixed",
      left: "-99999px",
      top: "-99999px",
      visibility: "hidden",
      whiteSpace: "pre",
      width: "auto",
      minWidth: `${baseWidth}px`,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      fontStyle: computed.fontStyle,
      letterSpacing: computed.letterSpacing,
      textTransform: computed.textTransform,
      textIndent: computed.textIndent,
      lineHeight: computed.lineHeight,
      paddingLeft: computed.paddingLeft,
      paddingRight: computed.paddingRight,
      borderLeftWidth: computed.borderLeftWidth,
      borderRightWidth: computed.borderRightWidth,
      boxSizing: "border-box",
    },
  });
}

function canExtendWidth(computed: CSSStyleDeclaration) {
  return (
    computed.overflowX === "visible" && computed.textOverflow !== "ellipsis"
  );
}

function canExtendHeight(computed: CSSStyleDeclaration) {
  return computed.overflowY === "visible";
}

function shouldSelectTextOnFocus(selectOnFocus: boolean, multi: boolean) {
  if (!selectOnFocus || multi) {
    return false;
  }
  return true;
}

function getPixel(input: string | null | undefined) {
  let num = Number.parseFloat(input || "");
  return Number.isFinite(num) ? num : 0;
}

function getBoxOuterSize(rect: DOMRect, computed: CSSStyleDeclaration) {
  let width = rect.width;
  let height = rect.height;
  let cssWidth = getPixel(computed.width);
  let cssHeight = getPixel(computed.height);

  if (cssWidth > 0) {
    width = cssWidth;
    if (computed.boxSizing !== "border-box") {
      width +=
        getPixel(computed.paddingLeft) +
        getPixel(computed.paddingRight) +
        getPixel(computed.borderLeftWidth) +
        getPixel(computed.borderRightWidth);
    }
  }

  if (cssHeight > 0) {
    height = cssHeight;
    if (computed.boxSizing !== "border-box") {
      height +=
        getPixel(computed.paddingTop) +
        getPixel(computed.paddingBottom) +
        getPixel(computed.borderTopWidth) +
        getPixel(computed.borderBottomWidth);
    }
  }

  return {
    width: Math.max(width, rect.width, 24),
    height: Math.max(height, rect.height, 24),
  };
}

/**
 * 在指定的目标元素上覆盖一个输入框，以便用户修改元素的文本内容。
 * 输入框的元素样式从目标元素的计算样式中继承。
 *
 * 支持 Esc 快捷键，取消输入框。
 * 当目标元素大小或者位置变化后，输入框也会自动取消。
 * 当页面发生滚动时，也取消输入框
 *
 * @param _it 要编辑的元素
 * @param _options 行为选项
 * @return 用户新输入的文本，如果用户取消输入或者发生错误或者文字没有改变，则返回 `undefined`
 */
export async function EditIt(
  it: DomSelector,
  _options = {} as EditItOptions
): Promise<string | undefined> {
  if (typeof document === "undefined") {
    return;
  }

  console.log("EditIt", { it, options: _options });

  // 获取目标元素
  let $el = Dom.find(it);
  if (!$el) {
    console.warn(`[Be.EditIt] Target ${it} Not Found!`);
    return;
  }

  let {
    multi = false,
    enterAsConfirm = false,
    newLineAsBr = false,
    text,
    trim = true,
    width = 0,
    height = 0,
    extendWidth = !multi,
    extendHeight = multi,
    selectOnFocus = true,
  } = _options;

  let doc = $el.ownerDocument || document;
  let win = doc.defaultView || window;
  let computed = win.getComputedStyle($el);
  let rect = $el.getBoundingClientRect();
  let boxSize = getBoxOuterSize(rect, computed);
  let fieldText = toEditFieldText(text ?? $el.innerText ?? "", newLineAsBr);
  let oriText = normalizeOutputText(fieldText, trim, newLineAsBr);
  let baseWidth = width > 0 ? width : boxSize.width;
  let baseHeight = height > 0 ? height : boxSize.height;
  let allowExtendWidth = !multi && extendWidth && canExtendWidth(computed);
  let allowExtendHeight = multi && extendHeight && canExtendHeight(computed);
  let autoSelectText = shouldSelectTextOnFocus(selectOnFocus, multi);
  let oriVisibility = $el.style.visibility;

  return new Promise<string | undefined>((resolve) => {
    let done = false;
    let frameId = 0;
    let mirror = !allowExtendWidth
      ? undefined
      : createTextMirror(doc, computed, baseWidth);

    let $field = Dom.createElement({
      $p: doc.body,
      tagName: multi ? "textarea" : "input",
      attrs: multi ? undefined : { type: "text" },
      props: { value: fieldText },
      style: {
        position: "fixed",
        display: "block",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        minWidth: `${baseWidth}px`,
        minHeight: `${baseHeight}px`,
        margin: "0",
        appearance: "none",
        //paddingTop: computed.paddingTop,
        //paddingRight: computed.paddingRight,
        //paddingBottom: computed.paddingBottom,
        //paddingLeft: computed.paddingLeft,
        padding: "0 0.6em",
        border: "none",
        borderTopWidth: computed.borderTopWidth,
        borderRightWidth: computed.borderRightWidth,
        borderBottomWidth: computed.borderBottomWidth,
        borderLeftWidth: computed.borderLeftWidth,
        borderTopStyle: computed.borderTopStyle,
        borderRightStyle: computed.borderRightStyle,
        borderBottomStyle: computed.borderBottomStyle,
        borderLeftStyle: computed.borderLeftStyle,
        borderColor: "var(--ti-color-primary)",
        // borderTopColor: computed.borderTopColor,
        // borderRightColor: computed.borderRightColor,
        // borderBottomColor: computed.borderBottomColor,
        // borderLeftColor: computed.borderLeftColor,
        borderRadius: computed.borderRadius,
        backgroundColor: "var(--ti-color-highlight)",
        color: "var(--ti-color-highlight-f)",
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        fontStyle: computed.fontStyle,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        textAlign: computed.textAlign,
        textIndent: computed.textIndent,
        textTransform: computed.textTransform,
        textDecoration: computed.textDecoration,
        boxSizing: "border-box",
        outline: "none",
        boxShadow: "none",
        resize: "none",
        overflowX: multi ? "hidden" : "visible",
        overflowY: multi ? "hidden" : "hidden",
        whiteSpace: multi ? "pre-wrap" : "nowrap",
        zIndex: 999,
      },
    }) as EditField;

    $el.style.visibility = "hidden";

    let teardown = () => {
      $el.style.visibility = oriVisibility;
      win.removeEventListener("scroll", onScroll, true);
      win.removeEventListener("resize", onResize, true);
      $field.removeEventListener("keydown", onKeyDown);
      $field.removeEventListener("input", onInput);
      $field.removeEventListener("blur", onBlur);
      if (frameId) {
        win.cancelAnimationFrame(frameId);
      }
      if (mirror) {
        Dom.remove(mirror);
      }
      Dom.remove($field);
    };

    let finalize = (confirm: boolean) => {
      console.log("finalize", { confirm });
      if (done) {
        return;
      }
      done = true;
      let value: string | undefined;
      if (confirm) {
        let output = normalizeOutputText($field.value, trim, newLineAsBr);
        if (!_.isNil(output) && output !== oriText) {
          value = output;
        }
      }
      teardown();
      resolve(value);
    };

    let syncSize = () => {
      if (!$field.isConnected) {
        return;
      }
      if (multi && extendHeight) {
        $field.style.height = `${baseHeight}px`;
        $field.style.height = `${Math.max(baseHeight, $field.scrollHeight)}px`;
      }
      if (multi && allowExtendHeight) {
        $field.style.width = `${Math.max(baseWidth, $field.scrollWidth)}px`;
      }
      if (allowExtendWidth && mirror) {
        let text = $field.value || " ";
        mirror.textContent = text;
        $field.style.width = `${Math.max(baseWidth, mirror.getBoundingClientRect().width + 1)}px`;
      }
    };

    let onScroll = () => finalize(false);
    let onResize = () => finalize(false);
    let onInput = () => syncSize();
    let onBlur = () => finalize(true);
    let onKeyDown = (evt: Event) => {
      let keyEvt = evt as KeyboardEvent;
      if (keyEvt.key === "Escape") {
        evt.preventDefault();
        finalize(false);
        return;
      }
      if (keyEvt.key !== "Enter") {
        return;
      }
      if (!multi) {
        evt.preventDefault();
        finalize(true);
        return;
      }
      if (enterAsConfirm && !keyEvt.ctrlKey) {
        evt.preventDefault();
        finalize(true);
      }
    };

    let watchTargetRect = () => {
      if (done) {
        return;
      }
      let currentRect = $el.getBoundingClientRect();
      if (isRectChanged(rect, currentRect)) {
        finalize(false);
        return;
      }
      frameId = win.requestAnimationFrame(watchTargetRect);
    };

    syncSize();

    // 晚一点再增加这个事件，刚创建的元素有可能会导致页面滚动
    //win.addEventListener("scroll", onScroll, true);
    win.addEventListener("resize", onResize, true);
    $field.addEventListener("keydown", onKeyDown);
    $field.addEventListener("input", onInput);
    $field.addEventListener("blur", onBlur);
    frameId = win.requestAnimationFrame(watchTargetRect);

    console.log("EditIt: show field", { autoSelectText });
    if (autoSelectText) {
      selectFieldText($field);
    } else {
      placeCaretAtEnd($field);
    }
    $field.focus();
  });
}
