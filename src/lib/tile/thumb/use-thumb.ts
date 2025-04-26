import _ from 'lodash';
import { computed } from 'vue';
import { TextSnippetProps } from '../../';
import { CssUtils } from '../../../core';
import {
  ThumbIndicator,
  ThumbIndicatorPosition,
  ThumbProps,
} from './ti-thumb-types';

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
  let ts = buildText(ind.text) ?? ({} as TextSnippetProps);

  // 默认自动 I18n
  if (_.isNil(ts.autoI18n)) {
    ts.autoI18n = true;
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

  // 防空
  if (_.isEmpty(ts)) {
    return;
  }

  // 逻辑类型
  ts.className = CssUtils.mergeClassName(
    ind.className,
    ind.type ? `is-${ind.type}` : ''
  );

  // 自定义样式
  if (ind.style) {
    ts.style = ind.style;
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

export type IndicatorSet = {
  position: ThumbIndicatorPosition;
  items: TextSnippetProps[];
};

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
        console.log('for', it);
        concludeIndicator(map, it);
      }
    }
    //console.log('indicator map', map);
    let re = [] as IndicatorSet[];
    for (let en of map.entries()) {
      let [position, items] = en;
      re.push({
        position,
        items,
      });
    }
    return re;
  });

  // 返回特性
  return {
    Text,
    More,
    Indicators,
  };
}
