import _ from 'lodash';
import { computed } from 'vue';
import { ActionBarItem, ActionBarItemInfo } from '../../../_type';
import { I18n, Icons } from '../../../core';
import { ActionBarProps } from '../../../lib/';
import { ImageProps } from '../all-tiles';
import { UploadBarProps } from './ti-upload-bar-types';

function _join_action(
  items: ActionBarItem[],
  at: ActionBarItemInfo | boolean | undefined,
  dftItem: ActionBarItem
) {
  if (at) {
    // 默认值
    if (_.isBoolean(at)) {
      items.push({ ...dftItem });
    }
    // 自定义值
    else {
      items.push({ ...dftItem, ...at });
    }
  }
}

export function useUploadBar(props: UploadBarProps) {
  // 构建主要显示文本
  const Text = computed(() => {
    if (_.isString(props.text)) {
      return { text: props.text };
    } else if (props.text) {
      return props.text;
    }
    return { text: I18n.text(props.placeholder ?? 'i18n:nil-obj') };
  });

  // 是否开启前缀清除的特性
  const isPrefixForClean = computed(() => {
    if (_.isNil(props.prefixForClean)) {
      return !props.clearButton;
    }
    return 'yes' == props.prefixForClean;
  });

  // 构建预览
  const Preview = computed(() => {
    let dftIcon = Icons.getIcon(props.type, 'far-file');
    // console.log('dftIcon', dftIcon);
    let preview = {
      width: '100%',
      height: '100%',
      dftSrc: Icons.parseIcon(dftIcon),
      iconFontSize: 'var(--ti-fontsz-b)',
      ...props.preview,
    } as ImageProps;

    return preview;
  });

  // 构建操作按钮
  const ActionBar = computed(() => {
    let actions: ActionBarItem[] = [];
    _join_action(actions, props.uploadButton, {
      icon: 'fas-upload',
      tip: 'i18n:ti-upload-bar-upload',
      className: `is-${props.type ?? 'primary'}-r`,
      action: 'choose-file',
    });
    _join_action(actions, props.clearButton, {
      icon: 'far-trash-can',
      tip: 'i18n:ti-upload-bar-clean ',
      className: `is-${props.type ?? 'primary'}-r`,
      action: 'clear',
    });
    // 定制化的操作按钮
    if (props.actions) {
      _.forEach(props.actions, (at) => {
        at = _.cloneDeep(at);
        if (_.isUndefined(at.className)) {
          at.className = `is-${props.type ?? 'primary'}-r`;
        }
        actions.push(at);
      });
    }

    // 生成操作栏配置属性
    if (actions.length > 0) {
      return {
        className: 'top-as-button',
        items: actions,
        ...(props.actionBar ?? {}),
      } as ActionBarProps;
    }
  });

  //-------------------------------------------------
  // 输出特性
  //-------------------------------------------------
  return {
    isPrefixForClean,
    Preview,
    Text,
    ActionBar,
  };
}
