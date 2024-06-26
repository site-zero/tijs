import _ from 'lodash';
import { Dicts, I18n, Match } from '../../core';

const _BUILTIN_TRANS = new Map<string, ValTrans>();

export type ValueTranslator = (name: string, val: any) => Promise<string>;
type ValTrans = (val: any) => Promise<string>;

export type ValueTranslatorProps = {
  valueTranslators?: Record<string, string | ValTrans>;
  valueIsMatcher?: boolean;
};

// async function defaultTranslator(val: any): Promise<string> {
//   // 建立匹配器
//   let am = Match.parse(val);
//   return am.explainText(Match.createExplainI18n());
// }

function getTranslator(
  trans?: string | ValTrans,
  valueIsMatcher?: boolean
): ValTrans {
  // 默认
  if (!trans) {
    // 默认需要将值变成匹配条件的展示
    if (valueIsMatcher) {
      return async (val: any): Promise<string> => {
        // 建立匹配器
        let am = Match.parse(val);
        return am.explainText(Match.createExplainI18n());
      };
    }
    // 默认直接显示值
    return async (val: any): Promise<string> => {
      return `${val ?? I18n.get('nil')}`;
    };
  }
  // 自定义
  if (_.isFunction(trans)) {
    return trans;
  }
  // 采用字典
  let m = /^(#)(.+)$/.exec(trans);
  if (m) {
    let type = m[0];
    let name = m[1];
    if ('#' == type) {
      let dict = Dicts.checkDict(name);
      return async (val: any): Promise<string> => {
        let text = await dict.getItemText(val);
        return text;
      };
    }
  }

  // 内置翻译器
  let re = _BUILTIN_TRANS.get(trans);
  if (!re) {
    throw `Fail to found built-in translator '${trans}'`;
  }
  return re;
}

export function useValueTranslator(
  props: ValueTranslatorProps
): ValueTranslator {
  return async (name: string, val: any): Promise<string> => {
    let trans = _.get(props.valueTranslators, name);
    let _trnv = getTranslator(trans, props.valueIsMatcher);
    return await _trnv(val);
  };
}
