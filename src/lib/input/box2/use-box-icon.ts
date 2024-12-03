import { computed } from 'vue';
import { IconInput } from '../../../_type/core-types';
import { Be, Icons } from '../../../core';
import { BoxIconFor } from './ti-input-box2-types';
import { InputBox2Feature } from './use-input-box2';

export type BoxIconOptions = {
  _box: InputBox2Feature;
  icon?: IconInput;
  hoverIcon?: IconInput;
  iconFor?: BoxIconFor;
  autoIcon?: IconInput;
};

export function useBoxIcon(options: BoxIconOptions) {
  const { _box, icon, hoverIcon, iconFor, autoIcon } = options;
  //--------------------------------------------------
  const _icon = computed(() => {
    if (autoIcon) return autoIcon;
    if (icon) return icon;
    if (iconFor) {
      return {
        'clear': 'zmdi-minus',
        'copy': 'zmdi-copy',
        'load-options': 'zmdi-caret-down',
      }[iconFor];
    }
  });
  //--------------------------------------------------
  const _hover_icon = computed(() => {
    if (!_icon.value) return;
    if (hoverIcon) return hoverIcon;
    if (iconFor) {
      return {
        'clear': 'zmdi-close',
        'copy': 'zmdi-copy',
        'load-options': 'zmdi-caret-down',
      }[iconFor];
    }
  });
  //--------------------------------------------------
  const hasIcon = computed(() => (_icon.value ? true : false));
  //--------------------------------------------------
  const IconPartClass = computed(() => {
    //console.log("IconPartClass", iconFor, 'clear' == iconFor)
    return {
      'can-hover': iconFor ? true : false,
      'can-rotate': 'clear' == iconFor,
    };
  });
  //--------------------------------------------------
  const IconPartHtml = computed(() => {
    if (!_icon.value) return '';
    let html = [Icons.fontIconHtml(_icon.value)];
    if (_hover_icon.value) {
      html.push(Icons.fontIconHtml(_hover_icon.value));
    }
    return html.join('');
  });
  //--------------------------------------------------
  function onClick() {
    if (!iconFor) return;
    // 清除值
    if ('clear' === iconFor) {
      _box.clearOptionsData();
      _box.updateBoxState({
        box_value: null,
        usr_text: null,
        box_icon: null,
        box_text: null,
        box_tip: null,
      });
      _box.emitIfChanged();
    }
    // 写入剪贴板
    else if ('copy' === iconFor) {
      Be.Clipboard.write(_box.InputText.value ?? '');
      let el = _box.getElement();
      if (el) {
        Be.BlinkIt(el);
      }
    }
    // 加载选项
    else if ('load-options' === iconFor) {
      _box.showOptions();
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
