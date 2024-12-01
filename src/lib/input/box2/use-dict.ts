import JSON5 from 'json5';
import _ from 'lodash';
import { Convertor, IconInput, Vars } from '../../../_type';
import { DictName, Dicts, isDictSetup } from '../../../core';
import { computed } from 'vue';

export type DictInput = string | DictName | DictProps | Vars[];

export type DictProps = {
  /**
   * 动态字典需要这个属性作为变量上下文
   */
  dictVars?: Vars;

  /**
   * 指定值的Icon获取方式, 通常，对于带 options 的输入框。
   * 如果打开了 autoPreifxIcon 选项，则会尝试从选项对象里获取 icon
   * 如果标准选项里有了 icon 字段自然没有问题。
   * 但是如果这个 icon 是从原生对象根据某些字段按照一定逻辑生成的
   * 那么为了能同时表达道 valueBox 上，也需要声明这个属性。
   *
   * 默认的 ，对于 InputBox，它会用 tipList.getIcon 作为这个属性的默认值
   */
  getIcon?: string | Convertor<Vars, IconInput | undefined>;
  getText?: string | Convertor<Vars, string | undefined>;
  getTip?: string | Convertor<Vars, string | undefined>;
  getValue?: string | ((item: Vars, index: number) => any);
};

export function useDict(_dict_input: DictInput|undefined, setup: DictProps) {
  let { dictVars = {}, getIcon, getText, getTip, getValue } = setup;
  return computed(() => {
    if (_dict_input) {
      // 选项数据
      if (_.isArray(_dict_input)) {
        let dictOptions = Dicts.makeDictOptions({
          data: _dict_input,
          icon: getIcon,
          text: getText,
          tip: getTip,
          value: getValue,
        });
        return Dicts.createDict(dictOptions);
      }

      // 直接就是选项
      if (isDictSetup(_dict_input)) {
        let dictOptions = Dicts.makeDictOptions(_dict_input);
        return Dicts.createDict(dictOptions);
      }

      // 分析字典名称
      let dictName: DictName;
      if (_.isString(_dict_input)) {
        let referName = Dicts.dictReferName(_dict_input);
        dictName = Dicts.explainDictName(referName);
      } else {
        dictName = _dict_input as DictName;
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
          return;
          // throw new Error(
          //   `DynamicDict: "${JSON5.stringify(
          //     dictName
          //   )}" Fail to get key from dictVars: ${JSON5.stringify(dictVars)}`
          // );
        }
        return Dicts.checkDynamicDict(name, key, dictVars);
      }

      // 获取字典: 静态
      return Dicts.checkDict(name);
    }
  });
}
