import _ from 'lodash';
import { computed } from 'vue';
import { IconInput } from '../../../_type/core-types';
import { Be, Icons } from '../../../core';
import { LabelApi, LabelEmitter, LabelIconFor } from './ti-label-types';

export type LabelIconOptions = {
  _api: LabelApi;
  href?: string;
  icon?: IconInput | null;
  hoverIcon?: IconInput | null;
  iconFor?: LabelIconFor;
  autoIcon?: IconInput;
  emit: LabelEmitter;
};

export function useLabelIcon(options: LabelIconOptions) {
  const { _api, href, icon, hoverIcon, iconFor, autoIcon, emit } = options;
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
        'copy-raw': 'zmdi-copy',
      }[iconFor];
    }
    if (href) {
      return 'zmdi-open-in-new';
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
        'copy-raw': 'zmdi-copy',
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
      iconFor(_api);
    }
    // 清除值
    else if ('clear' === iconFor) {
      emit('change', null);
    }
    // 写入剪贴板
    else if ('copy' === iconFor || 'copy-raw' == iconFor) {
      let text = {
        'copy': _api.DisplayValue.value,
        'copy-raw': _api.RawValue.value,
      }[iconFor];
      Be.Clipboard.write(text ?? '');
      let el = _api.getElement();
      if (el) {
        Be.BlinkIt(el);
      }
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
