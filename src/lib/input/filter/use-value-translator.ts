import _ from 'lodash';
import { Dicts, Match } from '../../../core';

const _BUILTIN_TRANS = new Map<string, ValTrans>();
const _AM_I18N = Match.createExplainI18n();

export type ValueTranslator = (name: string, val: any) => Promise<string>;
type ValTrans = (val: any) => Promise<string>;

export type ValueTranslatorProps = {
  translators?: Record<string, string | ValTrans>;
};

async function defaultTranslator(val: any): Promise<string> {
  // 建立匹配器
  let am = Match.parse(val);
  return am.explainText(_AM_I18N);
}

function getTranslator(trans?: string | ValTrans): ValTrans {
  // 默认
  if (!trans) {
    return defaultTranslator;
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
    let trans = _.get(props.translators, name);
    let _trnv = getTranslator(trans);
    return await _trnv(val);
  };
}
