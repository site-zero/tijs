import _ from 'lodash';
import { computed } from 'vue';
import { ImageProps } from '../all-tiles';
import { UploadBarProps } from './ti-upload-bar-types';

export function useUploadBar(props: UploadBarProps) {
  // 构建主要显示文本
  const Text = computed(() => {
    if (_.isString(props.text)) {
      return { text: props.text };
    } else if (props.text) {
      return props.text;
    }
    return { text: 'i18n:nil' };
  });

  // 构建预览
  const Preview = computed(() => {
    return {
      width: '100%',
      height: '100%',
      dftSrc: {
        type: 'font',
        value: 'far-file',
        style: {
          fontSize: '1em',
          color: 'var(--ti-color-mask-thin)',
        },
      },
      ...props.preview,
    } as ImageProps;
  });

  //-------------------------------------------------
  // 输出特性
  //-------------------------------------------------
  return {
    Preview,
    Text,
  };
}
