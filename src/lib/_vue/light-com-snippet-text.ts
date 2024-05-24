import _, { kebabCase } from 'lodash';
import { SetupContext, VNode, h } from 'vue';
import { TiIcon } from '../';
import {
  CssUtils,
  I18n,
  IconInput,
  TextContentType,
  ValueChange,
  Vars,
} from '../../core';
import { FieldComProps, useFieldCom } from '../_features';

export type TextSnippetEmitter = {
  (evetName: 'change', payload: ValueChange<string>): void;
};

export type TextSnippetProps = FieldComProps & {
  className?: any;
  style?: Vars;
  textStyle?: Vars;
  tagName?: string;
  attrs?: Vars;
  props?: Vars;
  // 用来动态 explain 传入的 comConf
  vars?: Vars;
  text: string;
  textType?: TextContentType;
  autoI18n?: boolean;
  prefixIcon?: IconInput;
  suffixIcon?: IconInput;
};

export function TextSnippet(
  props: TextSnippetProps,
  context: SetupContext<TextSnippetEmitter>
) {
  //........................................
  let tag = props.tagName ?? 'div';
  let tagProps = {
    class: CssUtils.mergeClassName(props.className),
    style: props.style,
  } as Vars;
  //........................................
  // 添加自定义属性
  _.forEach(props.attrs, (v, k) => {
    if (_.isNil(v)) return;
    k = kebabCase(k);
    if (!/^\^/.test(k)) {
      k = '^' + k;
    }
    tagProps[k] = v;
  });
  //........................................
  // 添加自定义选项
  _.forEach(props.props, (v, k) => {
    if (_.isNil(v)) return;
    k = kebabCase(k);
    if (!/^\./.test(k)) {
      k = '.' + k;
    }
    tagProps[k] = v;
  });
  //........................................
  let text = props.autoI18n ? I18n.text(props.text) : props.text;
  //
  // 自定义控件
  //
  if (props.comType) {
    let eventKey = _.camelCase(`on-${props.changeEventName ?? 'change'}`);
    let emit = context.emit as TextSnippetEmitter;

    let com = useFieldCom(props);
    let CustomizedCom = com.autoGetCom({}, props.vars ?? { text }, text);
    let { comType, comConf } = CustomizedCom;
    comConf[eventKey] = (val: any) => {
      emit('change', { value: val, oldVal: props.text });
    };

    let cusComNode = h(comType, comConf);
    tagProps.class['customized-com'] = true;
    return h(tag, tagProps, [cusComNode]);
  }
  //........................................
  // 准备子内容
  let children = [] as VNode[];

  // 前缀图标
  if (props.prefixIcon) {
    children.push(h(TiIcon, { class: 'at-prefix', value: props.prefixIcon }));
  }

  // 文字内容
  let textProps = {
    class: 'as-snippet-text',
    style: props.textStyle,
  } as Vars;
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
