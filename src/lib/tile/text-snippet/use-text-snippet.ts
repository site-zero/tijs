import _ from "lodash";
import { TiRawCom, Vars } from "../../../_type";
import { CssUtils, I18n, Tmpl } from "../../../core/";
import { useFieldCom } from "../../_features";
import { TextSnippetProps } from "./text-snippet-types";

export type TextSnippetApi = ReturnType<typeof useTextSnippet>;

export function useTextSnippet(props: TextSnippetProps) {
  let tag: string | TiRawCom = props.tagName ?? "div";
  let TopClass = CssUtils.mergeClassName(props.className);
  let TopStyle = CssUtils.toStyle(props.style);
  //-----------------------------------------------------
  let TopAttrs = {} as Vars;
  //-----------------------------------------------------
  _.forEach(props.attrs, (v, k) => {
    if (_.isNil(v)) return;
    k = _.kebabCase(k);
    if (!/^\^/.test(k)) {
      k = "^" + k;
    }
    TopAttrs[k] = v;
  });
  //-----------------------------------------------------
  _.forEach(props.props, (v, k) => {
    if (_.isNil(v)) return;
    k = _.kebabCase(k);
    if (!/^\./.test(k)) {
      k = "." + k;
    }
    TopAttrs[k] = v;
  });
  //-----------------------------------------------------
  let text: string | undefined = undefined;
  if (props.text) {
    text = props.autoI18n ? I18n.text(props.text) : props.text;
  }
  let customized = false;

  // 自定义
  if (props.comType) {
    customized = true;
    let com = useFieldCom(props);
    //console.log("load_confirm", props.vars?.data?.load_confirm);
    let CustomizedCom = com.autoGetCom({}, props.vars ?? { text }, text);
    //console.log("CustomizedCom", CustomizedCom.comConf.value);
    tag = CustomizedCom.rawCom;
    _.assign(TopAttrs, CustomizedCom.comConf);
  }
  // 纯文本
  else if (props.dynamic && text) {
    text = Tmpl.exec(text, props.vars ?? {});
  }

  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    tag,
    TopClass,
    TopStyle,
    TopAttrs,
    text,
    customized,
  };
}
