import { Icons, KeyboardStatus } from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { Box3IconHandler, BoxIconEmit, BoxIconProps } from "./types-box-icon";

export type BoxIconSetup = {
  isReadonly: () => boolean;
  onInvoke: (hdl: Box3IconHandler) => void;
  onEmit: (clickEmit: BoxIconEmit) => void;
  onClear: () => void;
  onCopy: (kbs: KeyboardStatus) => void;
  onOpen: () => void;
  onLoadOptions: () => void;
};

export function useBoxIcon(props: BoxIconProps, setup: BoxIconSetup) {
  const { icon, hoverIcon, iconFor, autoIcon, clickEmit } = props;
  //--------------------------------------------------
  const _icon = computed(() => {
    if (_.isNull(icon)) return;
    if (icon) return icon;
    if (_.isFunction(iconFor)) return "zmdi-settings";
    if (iconFor) {
      return {
        "clear": autoIcon || "zmdi-minus",
        "copy": "zmdi-copy",
        "load-options": "zmdi-caret-down",
        "click": "zmdi-more",
        "open": "zmdi-open-in-new",
      }[iconFor];
    }
  });
  //--------------------------------------------------
  const _hover_icon = computed(() => {
    if (!_icon.value) return;
    if (hoverIcon) return hoverIcon;
    if (_.isFunction(iconFor)) return _icon.value;
    if (iconFor) {
      return {
        "clear": "zmdi-close",
        "copy": "zmdi-copy",
        "load-options": "zmdi-caret-down",
        "open": "zmdi-open-in-new",
        "click": _icon.value,
      }[iconFor];
    }
  });
  //--------------------------------------------------
  const hasIcon = computed(() => (_icon.value ? true : false));
  //--------------------------------------------------
  const IconPartClass = computed(() => {
    //console.log("IconPartClass", iconFor, 'clear' == iconFor)
    if (iconFor != "copy" && setup.isReadonly()) {
      return {};
    }
    return {
      "can-hover": iconFor ? true : false,
      "can-rotate": "clear" == iconFor,
    };
  });
  //--------------------------------------------------
  const IconPartHtml = computed(() => {
    if (!_icon.value) return "";
    let html = [Icons.fontIconHtml(_icon.value)];
    if (_hover_icon.value) {
      html.push(Icons.fontIconHtml(_hover_icon.value));
    }
    return html.join("");
  });
  //--------------------------------------------------
  function onClick(evt: MouseEvent) {
    if (!iconFor) return;
    // 自定义动作
    if (_.isFunction(iconFor)) {
      setup.onInvoke(iconFor);
    }
    // 释放点击
    else if ("click" == iconFor) {
      setup.onEmit(clickEmit);
    }
    // 清除值
    else if ("clear" === iconFor) {
      setup.onClear();
    }
    // 写入剪贴板
    else if ("copy" === iconFor) {
      let kbs: KeyboardStatus = {
        altKey: evt.altKey,
        ctrlKey: evt.ctrlKey,
        shiftKey: evt.shiftKey,
        metaKey: evt.metaKey,
      };
      setup.onCopy(kbs);
    }
    // 打开目标
    else if ("open" === iconFor) {
      setup.onOpen();
    }
    // 加载选项
    else if ("load-options" === iconFor) {
      setup.onLoadOptions();
    }
  }
  //--------------------------------------------------
  // 输出特性
  //--------------------------------------------------
  return {
    _icon,
    _hover_icon,
    hasIcon,
    IconPartClass,
    IconPartHtml,
    onClick,
  };
}
