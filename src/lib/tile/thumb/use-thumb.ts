import { computed } from 'vue';
import {
  ThumbIndicator,
  ThumbIndicatorPosition,
  ThumbProps,
} from './ti-thumb-types';
import { TextSnippetProps } from '../../';
import _ from 'lodash';

function buildText(
  text?: string | TextSnippetProps
): TextSnippetProps | undefined {
  if (_.isString(text)) {
    return { text };
  } else if (text) {
    return text;
  }
}

function concludeIndicator(
  map: Map<ThumbIndicatorPosition, TextSnippetProps[]>,
  ind: ThumbIndicator
) {
  // 准备一个值
  let ts = buildText(ind.text);
  if (!ts) {
    return;
  }

  // 根据位置，自动设置图标
  // at left 用 prefixIcon
  // at right 用 suffixIcon
  if (ind.icon) {
    if (ind.position.indexOf('left') >= 0) {
      ts.prefixIcon = ind.icon;
    } else {
      ts.suffixIcon = ind.icon;
    }
  }

  // 加入到集合
  let list = map.get(ind.position);
  if (!list) {
    list = [ts];
    map.set(ind.position, list);
  } else {
    list.push(ts);
  }
}

export function useThumb(props: ThumbProps) {
  // 构建主要显示文本
  const Text = computed(() => buildText(props.text));

  // 构建扩展信息
  const More = computed(() => buildText(props.more));

  // 构建各个位置指示器
  const Indicators = computed(() => {
    let map = new Map<ThumbIndicatorPosition, TextSnippetProps[]>();
    if (props.indicators) {
      for (let it of props.indicators) {
        concludeIndicator(map, it);
      }
    }
    return map;
  });

  // 返回特性
  return {
    Text,
    More,
    Indicators,
  };
}
