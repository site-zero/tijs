import _ from 'lodash';
import { computed } from 'vue';
import { IconInput } from '../../../_type/core-types';
import { Be, Icons } from '../../../core';
import { BoxIconFor, InputBoxApi } from './ti-input-box2-types';

export type BoxIconOptions = {
  _box: InputBoxApi;
  icon?: IconInput | null;
  hoverIcon?: IconInput | null;
  iconFor?: BoxIconFor;
  autoIcon?: IconInput;
};

export function useBoxIcon(options: BoxIconOptions) {
  const { _box, icon, hoverIcon, iconFor, autoIcon } = options;
  //--------------------------------------------------
  const _icon = computed(() => {
    if (autoIcon) return autoIcon;
    if (_.isNull(icon)) return;
    if (icon) return icon;
    if (_.isFunction(iconFor)) return;
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
    if (_.isFunction(iconFor)) return _icon.value;
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
    // 自定义动作
    if (_.isFunction(iconFor)) {
      iconFor(_box);
    }
    // 清除值
    else if ('clear' === iconFor) {
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
      Be.Clipboard.write(_box.Text.value ?? '');
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
