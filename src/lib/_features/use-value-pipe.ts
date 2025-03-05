import _ from 'lodash';
import { computed } from 'vue';
import { StrCaseMode, ValueProcesser, Vars } from '../../_type';
import { Str } from '../../core';
import { getDefaultValPipes } from './val-pipes/dft-val-pipes';

export type ValuePipeFeature = ReturnType<typeof useValuePipe>;

export type ValuePipeProps = {
  /**
   * 输入值后是否需要强制修改文本形式
   * > 默认处理器名: $CASE
   */
  valueCase?: StrCaseMode;

  /**
   * 输入值后是否需要去掉前后空白
   * > 默认处理器名 $TRIM
   */
  trimed?: boolean;

  /**
   * 一个定制的管道，也就是处理顺序，
   * 如果是字符串，用 `|` 分割处理器名称
   * 如果是数组，每个个元素就是处理器的名称
   * 默认的，它的取值为  "$TRIM | $CASE"
   * 每个管线处理器，如果不存在，会被自动跳过
   */
  valuePiping?: string | string[];

  /**
   * 所有处理器通用的上下文环境参数， 默认就是 `{}`
   */
  pipeContext?: Vars;

  /**
   * 自定义的处理器: `{ $NAME: ()=>{...} }`
   */
  pipeProcessers?: Record<string, ValueProcesser>;
};

export function useValuePipe(props: ValuePipeProps) {
  /**
   * 准备处理器函数集合。
   *
   * 根据传入的属性 `props`，此函数会创建一个包含不同处理器函数的 Map 对象。
   * 处理器函数可以包括以下几种：
   *
   * - `$TRIM`: 如果 `props.trimed` 为真，则添加一个修剪字符串的处理器。
   * - `$CASE`: 如果 `props.valueCase` 存在，则添加一个根据指定大小写转换字符串的处理器。
   * - 自定义处理器: 如果 `props.pipeProcessers` 存在，则将其包含的所有处理器添加到 Map 中。
   *
   * @returns {Map<string, ValueProcesser>} 包含处理器函数的 Map 对象。
   */
  function __prepare_processor_map() {
    let re = new Map<string, ValueProcesser>();
    // Default
    let dft = getDefaultValPipes();
    _.forEach(dft, (v, k) => {
      re.set(k, v);
    });
    
    // case
    if (props.valueCase) {
      re.set('$CASE', Str.getCaseFunc(props.valueCase));
    }

    // customized
    if (props.pipeProcessers) {
      for (let [k, p] of Object.entries(props.pipeProcessers)) {
        re.set(k, p);
      }
    }
    return re;
  }

  /**
   * 处理器名称映射。
   */
  const _pp_map = computed(() => __prepare_processor_map());

  /**
   * 构建处理器数组。
   *
   * @returns {ValueProcesser[]} 返回处理器数组。
   *
   * @remarks
   * 该函数会根据 `props.valuePiping` 的值来构建处理器数组。如果 `props.valuePiping` 是字符串，
   * 则会将其按 `|` 分隔成数组。如果 `props.valuePiping` 为空，则默认使用 `['$TRIM', '$CASE']`。
   * 然后根据每个处理器名称从 `_pp_map.value` 中获取对应的处理器并添加到结果数组中。
   */
  function __build_processors() {
    let piping = props.valuePiping ?? ['$TRIM', '$CASE'];
    if (_.isString(piping)) {
      piping = Str.splitIgnoreBlank(piping, '|');
    }
    let re: ValueProcesser[] = [];
    for (let pipItem of piping) {
      let pro = _pp_map.value.get(pipItem);
      if (pro) {
        re.push(pro);
      }
    }
    return re;
  }

  /**
   * 计算属性 `__processors`，用于构建处理器。
   */
  const __processers = computed(() => __build_processors());

  // 返回处理函数
  return (val: any) => {
    let context = props.pipeContext ?? {};
    let re = val;
    for (let processer of __processers.value) {
      re = processer(re, context);
    }
    return re;
  };
}
