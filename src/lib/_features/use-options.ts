import JSON5 from 'json5';
import _ from 'lodash';
import { Vars } from '../../_type';
import { DictName, DictSetup, Dicts, TiDict, isDictSetup } from '../../core';

export type OptionsInput = string | DictName | DictSetup | Vars[];

export type OptionsProps = {
  /**
   * 可以获取一个`IDict`实例
   */
  options?: OptionsInput;

  /**
   * 动态字典需要这个属性作为变量上下文
   */
  dictVars?: Vars;

  /**
   * 值必须在字典中
   */
  mustInOptions?: boolean;
};

export type OptionsFeature = {
  dict?: Dicts.TiDict;
};

/**
 * 建立选项字典
 */
function __build_dict(props: OptionsProps): TiDict | undefined {
  let { options, dictVars = {} } = props;
  if (options) {
    // 选项数据
    if (_.isArray(options)) {
      let dictOptions = Dicts.makeDictOptions({ data: options });
      return Dicts.createDict(dictOptions);
    }

    // 直接就是选项
    if (isDictSetup(options)) {
      let dictOptions = Dicts.makeDictOptions(options);
      return Dicts.createDict(dictOptions);
    }

    // 分析字典名称
    let dictName: DictName;
    if (_.isString(options)) {
      let referName = Dicts.dictReferName(options);
      dictName = Dicts.explainDictName(referName);
    } else {
      dictName = options;
    }

    // 获取字典: 动态
    let { name, dynamic, dictKey } = dictName;
    if (dynamic) {
      if (!dictKey) {
        throw new Error(
          `DynamicDict: "${JSON5.stringify(dictName)}" without {dictKey}`
        );
      }
      let key = _.get(dictVars, dictKey);
      if (!key) {
        throw new Error(
          `DynamicDict: "${JSON5.stringify(
            dictName
          )}" Fail to get key from dictVars: ${JSON5.stringify(dictVars)}`
        );
      }
      return Dicts.checkDynamicDict(name, key, dictVars);
    }

    // 获取字典: 静态
    return Dicts.checkDict(name);
  }
}

export function useOptions(props: OptionsProps): OptionsFeature {
  const dict = __build_dict(props);
  return { dict };
}
