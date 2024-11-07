import _ from 'lodash';
import { computed } from 'vue';
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

  //-------------------------------------------------
  // 输出特性
  //-------------------------------------------------
  return {
    Text,
  };
}
