import _ from 'lodash';
import {
  AsyncFuncA1,
  Convertor,
  FuncA1,
  IconInput,
  StrCaseMode,
  Vars,
} from '../../_type';
import { Dicts, Str, TiDict, Tmpl } from '../../core';
import { wrapPromiseFunc } from '../../core/util/util-lang';
import { OptionsFeature, OptionsProps, useOptions } from './use-options';
import { computed, ref, Ref } from 'vue';
import { abort } from 'process';
/*-------------------------------------------------------

                        Types

-------------------------------------------------------*/
type ValueProcessorSet = {
  head: ((val: any) => Promise<any>)[];
  main: ((val: any) => Promise<any>)[];
  dict: ((val: any) => Promise<any>)[];
  tail: ((val: any) => Promise<any>)[];
};

type ValHintCooker = (val: any) => string | undefined;
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

  // 动态渲染的上下文
  boxVars?: Vars;

  /**
   * 有时候，我们不想让用户输入的字符串简单的传递给 dict.query 去查询。
   * 我们需要给 hint 字符串编制更多的信息。
   *
   * 譬如一个选择框，输入省份的 code 进行查询，但是我们还想加入国家这个约束条件。
   * 我们可以通过 boxVars 接受国家的代码，譬如 `{country:'CN'}`，
   * 当我们输入 G 的时候，我们希望传递给后端 `G:CN` 这样的字符串。
   *
   * 因此我们就要用到这个配置，将其设置为 '${hint}:${country}' 就能在每次查询
   * 的时候根据这个字符串模板进行渲染。
   * 它的上下文，永远是 `{...boxVars, hint:'你输入的内容'}`。
   *
   * > ！因此不要为 boxVars 设置 'hint' 这个名称的变量，因为会被你输入的内容重载掉。
   *
   * 如果你指定的是一个自定义函数，那你就能做的更加细腻
   */
  renderHint?: string | ((vars: Vars) => string);
};

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type ValueInputTidyMode = keyof ValueProcessorSet;
export type ValueInputFeature = OptionsFeature & {
  cookValHint: ValHintCooker;
  tidyValue: (val: any, mode?: ValueInputTidyMode[]) => Promise<any>;
  translateValue: (val: any) => Promise<string | Dicts.DictItem<any>>;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
type BuildProcessPipsOptions = {
  dict?: TiDict;
  cookValHint?: ValHintCooker;
  ctrlAbort: Ref<AbortController | undefined>;
};
/**
 * 收集值处理器
 */
function __build_process_pips(
  props: ValueInputProps,
  setup: BuildProcessPipsOptions
) {
  let processors: ValueProcessorSet = {
    head: [],
    main: [],
    dict: [],
    tail: [],
  };
  let { dict, cookValHint, ctrlAbort } = setup;
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
      if (cookValHint) {
        console.log('mustInOptions dict, cookValHint', v);
        v = cookValHint(v);
      }
      // 取消上一次的转换
      if (ctrlAbort.value) {
        try {
          ctrlAbort.value.abort('Cancel Last Query in use-value-input.ts');
        } catch (_err) {}
      }
      ctrlAbort.value = new AbortController();
      let it = await dict.getStdItem(v, ctrlAbort.value.signal);
      if (cookValHint) {
        console.log(`await dict.getStdItem(${v}) => `, it);
      }
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
  //................................................
  const RenderHint = computed(() => {
    if (props.renderHint) {
      if (_.isString(props.renderHint)) {
        let t = Tmpl.parse(props.renderHint);
        return (vars: Vars) => {
          return t.render(vars);
        };
      }
      return props.renderHint;
    }
  });
  //................................................
  // function prepareHintVars(hint: string): Vars {
  //   let re = _.cloneDeep(props.boxVars ?? {});
  //   re.hint = hint;
  //   return re;
  // }
  //................................................
  function cookValHint(val?: string): string | undefined {
    if (RenderHint.value) {
      let v_in_str = val ?? '';
      let hvars = _.cloneDeep(props.boxVars ?? {});
      hvars.hint = v_in_str;
      return RenderHint.value(hvars) ?? v_in_str;
    }
    return val;
  }
  //................................................
  //
  // 准备选项过滤器
  const { dict } = useOptions(props);
  //................................................
  //
  // 准备处理器
  const ctrlAbort = ref(new AbortController());
  const processors = __build_process_pips(props, {
    dict,
    cookValHint: RenderHint.value ? cookValHint : undefined,
    ctrlAbort,
  });
  //................................................
  //
  // 准备值图标获取器
  let _get_value_icon: Convertor<Vars, IconInput | undefined> | undefined =
    undefined;

  // 直接获取自路径
  if (_.isString(props.getOptionIcon)) {
    _get_value_icon = (it: Vars): IconInput | undefined =>
      _.get(it, props.getOptionIcon as string) as IconInput;
  }
  // 定制
  else if (props.getOptionIcon) {
    _get_value_icon = props.getOptionIcon;
  }

  //................................................
  /**
   * 【异步】对输入的值进行处理
   */
  async function tidyValue(
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
  }

  //................................................
  async function translateValue(
    val: any
  ): Promise<string | Dicts.DictItem<any>> {
    return new Promise<any>(async (resolve, _reject) => {
      if (dict) {
        let rawIt = await dict.getItem(val);
        let it = dict.toStdItem(rawIt);
        if (_get_value_icon) {
          let _icon = _get_value_icon(rawIt);
          it.icon = _icon ?? it.icon;
        }
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
  }

  //---------------------------------------------------
  // 导出特性
  //---------------------------------------------------
  return {
    dict,
    cookValHint,
    tidyValue,
    translateValue,
  };
}
