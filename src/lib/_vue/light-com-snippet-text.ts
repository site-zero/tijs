import { SetupContext, VNode, h } from 'vue';
import { TiIcon } from '../';
import {
  ValueChanged,
  I18n,
  IconInput,
  TextContentType,
  Vars,
} from '../../core';
import { FieldComProps, useFieldCom } from '../_features';

export type TextSnippetEmitter = {
  (evetName: 'change', payload: ValueChanged<string>): void;
};

export type TextSnippetProps = FieldComProps & {
  className: string;
  tagName?: string;
  text: string;
  textType?: TextContentType;
  autoI18n?: boolean;
  prefixIcon?: IconInput;
  suffixIcon?: IconInput;
};

export function TextSnippet(
  props: TextSnippetProps,
  _context: SetupContext<TextSnippetEmitter>
) {
  let tag = props.tagName ?? 'div';
  let tagProps = { class: props.className } as Vars;
  let text = props.autoI18n ? I18n.text(props.text) : props.text;
  //
  // 自定义控件
  //
  if (props.comType) {
    console.log('TextSnippet', props);
    let com = useFieldCom(props);
    let DynamicCom = com.autoGetCom({}, { value: text }, text);
    let vnode = h(DynamicCom.comType, DynamicCom.comConf);
    return h(tag, tagProps, [vnode]);
  }

  // 准备子内容
  let children = [] as VNode[];

  // 前缀图标
  if (props.prefixIcon) {
    children.push(h(TiIcon, { class: 'at-prefix', value: props.prefixIcon }));
  }

  // 文字内容
  let textProps = { class: 'as-snippet-text' } as Vars;
  if ('html' == props.textType) {
    textProps.innerHTML = text;
  } else {
    textProps.innerText = text;
  }
  children.push(h('div', textProps));

  // 后缀图标
  if (props.suffixIcon) {
    children.push(h(TiIcon, { class: 'at-suffix', value: props.suffixIcon }));
  }

  return h(tag, tagProps, children);
}
