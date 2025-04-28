import _ from 'lodash';
import { computed } from 'vue';
import { I18n, Icons } from '../../../../core';
import { ImageProps } from '../../all-tiles';
import { getActionBarProps } from '../use-uploader';
import { UploadBarProps } from './ti-upload-bar-types';

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

  // 构建操作按钮
  const ActionBar = computed(() =>
    getActionBarProps(props, { iconButton: true })
  );

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

  const InProgress = computed(() => {
    return (props.progress?.value ?? 0) > 0;
  });

  //-------------------------------------------------
  // 输出特性
  //-------------------------------------------------
  return {
    isPrefixForClean,
    Preview,
    Text,
    ActionBar,
    InProgress,
  };
}
