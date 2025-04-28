import _ from 'lodash';
import { computed } from 'vue';
import { Icons } from '../../../../core';
import { ThumbProps } from '../../all-tiles';
import { getActionBarProps } from '../use-uploader';
import { UploadTileProps } from './ti-upload-tile-types';

export function useUploadTile(props: UploadTileProps) {
  // 构建主要显示文本
  const ObjThumb = computed(() => {
    let re: ThumbProps = {
      width: '100%',
      height: '100%',
      style: props.thumbStyle,
      preview: {
        width: '100%',
        height: '100%',
        dftSrc: Icons.parseIcon(Icons.getIcon(props.type, 'far-file')),
        iconFontSize: 'var(--ti-fontsz-b)',
      },
    };

    if (props.preview) {
      _.assign(re.preview, props.preview);
    }

    // 显示值
    if (!props.nilValue) {
      _.assign(re, {
        progress: props.progress,
        text: props.text ?? 'i18n:nil-obj',
      } as ThumbProps);
    }

    // 搞一下默认值
    _.defaults(re, _.cloneDeep(props.placeholder));

    return re;
  });

  // 构建操作按钮
  const ActionBar = computed(() =>
    getActionBarProps(props, { iconButton: false })
  );

  const InProgress = computed(() => {
    return (props.progress?.value ?? 0) > 0;
  });

  //-------------------------------------------------
  // 输出特性
  //-------------------------------------------------
  return {
    ObjThumb,
    ActionBar,
    InProgress,
  };
}
