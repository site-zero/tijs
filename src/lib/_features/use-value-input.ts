import _ from 'lodash';
import { AsyncFuncA1, FuncA1, StrCaseMode } from '../../_type';
import { Dicts, Str, TiDict } from '../../core';
import { wrapPromiseFunc } from '../../core/util/util-lang.ts';
import { OptionsFeature, OptionsProps, useOptions } from './use-options.ts';
/*-------------------------------------------------------

                        Types

-------------------------------------------------------*/
type ValueProcessorSet = {
  head: ((val: any) => Promise<any>)[];
  main: ((val: any) => Promise<any>)[];
  dict: ((val: any) => Promise<any>)[];
  tail: ((val: any) => Promise<any>)[];
};
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
export type ValueInputProps = OptionsProps & {
  /**
   * 输入值后是否需要强制修改文本形式
   */
  valueCase?: StrCaseMode;

  /**
   * 输入值后是否需要去掉前后空白
   */
  trimed?: boolean;

  /**
   * 自定义任何其他值处理器，在内置处理器后执行
   */
  beforeValueProcessors?: FuncA1<any, string> | FuncA1<any, string>[];

  /**
   * 自定义任何其他值处理器，在内置处理器后执行
   */
  afterValueProcessors?: FuncA1<any, string> | FuncA1<any, string>[];
};

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type ValueInputTidyMode = keyof ValueProcessorSet;
export type ValueInputFeature = OptionsFeature & {
  tidyValue: (val: any, mode?: ValueInputTidyMode[]) => Promise<any>;
  translateValue: (val: any) => Promise<string | Dicts.DictItem<any>>;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/

/**
 * 收集值处理器
 */
function __build_process_pips(props: ValueInputProps, dict?: TiDict) {
  let processors: ValueProcessorSet = {
    head: [],
    main: [],
    dict: [],
    tail: [],
  };
  //........................................
  // 自定义：前置
  let list = wrapPromiseFunc<FuncA1<any, string>, AsyncFuncA1<any, string>>(
    props.beforeValueProcessors
  );
  processors.head.push(...list);
  //........................................
  // 内部处理器：前置
  if (props.trimed) {
    processors.main.push(async (v) => _.trim(v));
  }
  if (props.valueCase) {
    let toCase = Str.getCaseFunc(props.valueCase);
    processors.main.push(async (v) => toCase(v));
  }
  //........................................
  // 字典值处理器
  if (props.mustInOptions && dict) {
    processors.dict.push(async (v) => {
      let it = await dict.getStdItem(v);
      return it?.value;
    });
  }
  //........................................
  // 自定义：后置
  list = wrapPromiseFunc<FuncA1<any, string>, AsyncFuncA1<any, string>>(
    props.afterValueProcessors
  );
  processors.tail.push(...list);

  //
  // 搞定返回
  return processors;
}
/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
/**
 * 建议在 Computed 函数里使用，以便获得最大程度的响应性
 */
export function useValueInput(props: ValueInputProps): ValueInputFeature {
  //
  // 准备选项过滤器
  const { dict } = useOptions(props);
  //
  // 准备处理器
  const processors = __build_process_pips(props, dict);
  //
  // 导出
  return {
    dict,
    /**
     * 【异步】对输入的值进行处理
     */
    tidyValue: async function (
      val: any,
      mode?: ValueInputTidyMode[]
    ): Promise<any> {
      let mark = {
        head: false,
        main: false,
        dict: false,
        tail: false,
      } as Record<ValueInputTidyMode, boolean>;

      // 全都需要
      if (!mode || _.isEmpty(mode)) {
        _.forEach(mark, (_v, k) => (mark[k as ValueInputTidyMode] = true));
      }
      // 逐个解开
      else {
        _.forEach(mode, (k) => (mark[k] = true));
      }

      return new Promise<any>(async (resolve, reject) => {
        let is_error = false;
        try {
          if (mark.head) {
            for (let processor of processors.head) {
              val = await processor(val);
            }
          }
          if (mark.main) {
            for (let processor of processors.main) {
              val = await processor(val);
            }
          }
          if (mark.dict) {
            for (let processor of processors.dict) {
              val = await processor(val);
            }
          }
          if (mark.tail) {
            for (let processor of processors.tail) {
              val = await processor(val);
            }
          }
        } catch (err) {
          is_error = true;
          if (!(err instanceof Error)) {
            err = new Error(Str.anyToStr(err));
          }
          console.error(err);
          reject(err);
        } finally {
          if (!is_error) {
            resolve(val);
          }
        }
      });
    },
    translateValue: async function (
      val: any
    ): Promise<string | Dicts.DictItem<any>> {
      return new Promise<any>(async (resolve, _reject) => {
        if (dict) {
          let it = await dict.getStdItem(val);
          if (!it) {
            if (props.mustInOptions) {
              resolve(undefined);
            } else {
              resolve(val);
            }
          } else {
            resolve(it);
          }
        }
        // 直接返回
        else {
          resolve(val);
        }
      });
    },
  };
}
