import _ from "lodash";
import { computed, nextTick, Ref, ref } from "vue";
import { AnyOptionItem, IconInput, Vars } from "../../../_type";
import { Dicts, I18n } from "../../../core";
import { anyToStr } from "../../../core/text/ti-str";
import { usePlaceholder, useReadonly, ValuePipeFeature } from "../../_features";
import { useDisplayText } from "./../../_features";
import {
  BoxEmitTime,
  InputBoxEmitter,
  InputBoxProps,
} from "./ti-input-box-types";
import { ValueHintCooking } from "./use-value-hint-cooking";
import { ValueOptions } from "./use-value-options";
//--------------------------------------------------
export type InputBoxState = {
  /**
   * 用户输入的文本（已经通过了管线）
   */
  usr_text: string | null;

  /**
   * 输入框真实的值（如果声明了选项，则会查询选项的值）
   */
  box_value: any;
  box_icon: IconInput | null;
  box_text: string | null;
  box_tip: string | null;
};
//--------------------------------------------------
export type InputBoxSetup = {
  _box_state: InputBoxState;
  _options_data: Ref<Vars[] | undefined>;
  _pipe: ValuePipeFeature;
  _dict: Dicts.TiDict | undefined;
  _options: ValueOptions | undefined;
  cookHint: ValueHintCooking;
  getElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
  emit: InputBoxEmitter;
};
//--------------------------------------------------
export function useInputBox2(props: InputBoxProps, setup: InputBoxSetup) {
  //------------------------------------------------
  let {
    _box_state,
    _options_data,
    _pipe,
    _dict,
    _options,
    cookHint,
    getElement,
    getInputElement,
    emit,
  } = setup;
  //------------------------------------------------
  const _focused = ref(document.activeElement === getInputElement());
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  //------------------------------------------------
  const hasTips = computed(() => (_options_data.value ? true : false));
  //------------------------------------------------
  const _display = computed(() => useDisplayText(props));
  //------------------------------------------------
  const InputText = computed(() => {
    let {
      usr_text,
      box_value: value,
      box_text: text,
      box_tip: tip,
      box_icon: icon,
    } = _box_state;
    let text0 = _display.value({ text, tip, icon, value }) ?? value;
    if (_focused.value) {
      return usr_text ?? text0;
    }
    return text0;
  });
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
  const isInputReadonly = computed(() => isReadonly.value || !props.canInput);
  //------------------------------------------------
  const emitTimeMap = new Map<BoxEmitTime, boolean>();
  if (props.emitTime) {
    for (let et of props.emitTime) {
      emitTimeMap.set(et, true);
    }
  }
  function shouldWhenEmit(et: BoxEmitTime) {
    return emitTimeMap.has(et) ?? false;
  }
  //------------------------------------------------
  const OptionsData = computed(() => {
    let re: Vars[] = [];
    // 显示清除选项
    if (props.showCleanOption) {
      re.push({
        text: I18n.text("i18n:clear"),
        value: null,
      });
    }
    if (_options) {
      re.push(..._options.OptionsData.value);
    }

    return re;
  });
  //------------------------------------------------
  // 操作方法
  //------------------------------------------------
  function __amend_box_state(amend: Partial<InputBoxState>) {
    if (amend.box_text && props.autoI18n) {
      amend.box_text = I18n.text(amend.box_text);
    }
    //console.trace('!!!!!!!!!!!__amend_box_state', amend.box_value, props.value);
    _.assign(_box_state, amend);
  }
  //------------------------------------------------
  function updateBoxState(amend: Partial<InputBoxState>) {
    __amend_box_state(amend);
  }
  //------------------------------------------------
  function setValueByItem(item: Vars | null) {
    let amend: InputBoxState = {
      usr_text: null,
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    if (item) {
      let stdItem = _options?.toOptionItem(item);
      if (stdItem) {
        let usr_text = _display.value(stdItem);
        _.assign(amend, {
          usr_text,
          box_value: stdItem.value ?? null,
          box_icon: stdItem.icon ?? null,
          box_text: stdItem.text ?? null,
          box_tip: stdItem.tip ?? null,
        });
      }
    }
    __amend_box_state(amend);
  }
  //------------------------------------------------
  function applyPipe(text0: string) {
    let text1 = _pipe(text0);
    //console.log("applyPipe", text0, text1);
    // 无需修改
    if (text1 == _box_state.usr_text) {
      return;
    }
    let amend: InputBoxState = {
      usr_text: text1,
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    // 未定义的话，那么就直接更新了
    if (!props.mustInOptions) {
      amend.box_value = text1;
    }
    // 更新状态
    __amend_box_state(amend);
  }
  //------------------------------------------------
  async function applyTipsByHint(usr_text?: string) {
    // 未定义字典，就不需要查找了
    if (!_dict) {
      return;
    }

    let { reloadOptioinsData, lookupOptionItem, getOptionItem } =
      _options ?? {};

    // 使用当前的输入状态作为查询线索
    let amend = _.cloneDeep(_box_state);
    let text1 = usr_text;
    let item: AnyOptionItem | undefined = undefined;

    // 准备一个直接处理值的方法，未聚焦的时候会用
    // 读取过程中，突然失焦的时候，也会用到
    const __just_set_value = async () => {
      if (text1) {
        var hint = cookHint(text1);
        item = (await _dict.getStdItem(hint))?.toOptionItem();
      }
      amend.usr_text = null;
    };

    // 如果不是聚焦状态，就不要显示选项了，直接看值
    if (!_focused.value) {
      await __just_set_value();
    }
    //.................................
    // 否则就是聚焦咯，那么展开选项
    //.................................
    // 没有选项，则看看是否需要展开选项
    else {
      // 如果被意外结束了，那么通常是网络错误，或者用户失焦距导致的读取中断
      const whenAbort = async () => {
        clearOptionsData();
        await __just_set_value();
      };

      // 需要加载选项
      if (!hasTips.value) {
        // 定义了选项展开操作，那么就需要展开
        if (reloadOptioinsData) {
          let hint = props.tipUseHint ? text1 : undefined;
          await reloadOptioinsData(hint, whenAbort);
        }
      }
      // query hint
      else if (props.tipUseHint) {
        if (_options) {
          await _options.reloadOptioinsData(text1, whenAbort);
        }
      }

      // 如果查询的结果为空，那么就不显示选项
      if (
        "auto" == props.tipShowTime &&
        _options &&
        _options.isDataEmpty.value
      ) {
        clearOptionsData();
      }

      // 首先尝试精确查找
      if (getOptionItem) {
        item = getOptionItem(text1);
      }

      // 如果没有则尝试模拟查找
      if (!item && lookupOptionItem && text1) {
        item = lookupOptionItem(text1);
      }
    }

    // 找到了选项
    if (item) {
      //amend.usr_text = _display.value(item) ?? '';
      amend.box_value = item.value;
      amend.box_icon = item.icon ?? null;
      amend.box_text = item.text ?? null;
      amend.box_tip = item.tip ?? null;
    }
    // 必须在字典中
    else if (props.mustInOptions) {
      amend.box_value = null;
      amend.box_icon = null;
      amend.box_text = null;
      amend.box_tip = null;
    }
    // 那么就维持原来的值咯
    else {
      // 似乎什么也不需要做
    }

    // 更新状态
    __amend_box_state(amend);

    // 后续，尝试一下通知改动
    // 但是如果选项列表是展开的，就不要通知了
    // 因为到等到其关闭才能决定是否要展开
    if (!hasTips.value && !_focused.value) {
      emitIfChanged();
    }
  }
  //------------------------------------------------
  // const debounceApplyTipsByHint = _.debounce(
  //   (usr_text?: string) => {
  //     applyTipsByHint(usr_text);
  //   },
  //   props.tipShowDelay,
  //   {
  //     leading: false,
  //     trailing: true,
  //   }
  // );
  //------------------------------------------------
  let _apply_pipe_at = 0;
  async function applyPipeAndTips(text0: string) {
    // 为了防止用户数据字符，然后立刻回车
    // 这样回车回导致输入确认后，有执行一遍本函数
    let now = Date.now();
    if (now - _apply_pipe_at <= 0) {
      return;
    }
    try {
      applyPipe(text0);
      return await applyTipsByHint(_box_state.usr_text ?? undefined);
    } finally {
      _apply_pipe_at = now;
    }
  }
  //------------------------------------------------
  const debounceApplyPipeAndTips = _.debounce(
    applyPipeAndTips,
    props.tipShowDelay,
    {
      leading: false,
      trailing: true,
    }
  );
  //------------------------------------------------
  // const debounceInputUpdate = _.debounce(
  //   (text0: string) => {
  //     onInputUpate(text0);
  //   },
  //   500,
  //   {
  //     leading: false,
  //     trailing: true,
  //   }
  // );
  //------------------------------------------------
  // async function onInputUpate(text0: string) {
  //   let { reloadOptioinsData, lookupOptionItem, getOptionItem } =
  //     _options ?? {};

  //   // 如果不是聚焦状态，就不要搞了
  //   if (!_focused.value) {
  //     return;
  //   }

  //   let text1 = _pipe(text0);
  //   let amend: InputBoxState = {
  //     usr_text: text1,
  //     box_value: null,
  //     box_icon: null,
  //     box_text: null,
  //     box_tip: null,
  //   };
  //   // 未定义的话，那么就直接更新了
  //   if (!props.mustInOptions) {
  //     amend.box_value = text1;
  //   }
  //   // 没有选项，则看看是否需要展开选项
  //   if (!hasTips.value) {
  //     // 定义了选项展开操作，那么就需要展开
  //     if (reloadOptioinsData) {
  //       let hint = props.tipUseHint ? text1 : undefined;
  //       await reloadOptioinsData(hint);
  //     }
  //   }
  //   // query hint
  //   else if (props.tipUseHint) {
  //     await _options?.reloadOptioinsData(text1);
  //   }

  //   // 首先尝试精确查找
  //   let item: AnyOptionItem | undefined = undefined;
  //   if (getOptionItem) {
  //     item = getOptionItem(text1);
  //   }

  //   // 如果没有则尝试模拟查找
  //   if (!item && lookupOptionItem) {
  //     item = lookupOptionItem(text1);
  //   }

  //   if (item) {
  //     amend.box_value = item.value;
  //     amend.box_icon = item.icon ?? null;
  //     amend.box_text = item.text ?? null;
  //     amend.box_tip = item.tip ?? null;
  //   }

  //   // 更新状态
  //   __amend_box_state(amend);
  // }
  //------------------------------------------------
  async function onPropsValueChange() {
    let val = anyToStr(props.value);
    let amend: InputBoxState = {
      usr_text: val ?? "",
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    // 未定义的话，那么就直接更新了
    if (!props.mustInOptions) {
      amend.box_value = val;
    }

    // 如果有值，就尝试查询一下
    if (_dict && val) {
      var hint = cookHint(val);
      let item = await _dict.getStdItem(hint);
      if (item) {
        amend.usr_text = _display.value(item) ?? "";
        amend.box_value = item.value;
        amend.box_icon = item.icon ?? null;
        amend.box_text = item.text ?? null;
        amend.box_tip = item.tip ?? null;
      }
    }

    // 更新状态
    __amend_box_state(amend);
  }
  //------------------------------------------------
  /**
   * 非常无奈，我发现某些很复杂的场景，譬如一个 GUI 里面嵌套 TabForms
   * 而 form 里还有 InputGroup，进行Tab切换的时候，正好 Vue 认为
   * 两个 Tab 的某个 Input 不需要重新创建。
   *
   * 然后我就会在一个 watch props.value 里调用两遍 onPropsValueChange
   * 的情况，通常是在 2ms 内的，苦思不得其解。
   *
   * 于是我干脆用一个反弹跳来解决这个问题。无论怎样，在300内只会有一次调用
   * 应该就能解决这个问题了
   */
  const debouncePropsValueChange = _.debounce(
    () => {
      onPropsValueChange();
    },
    300,
    {
      leading: false,
      trailing: true,
    }
  );

  //------------------------------------------------
  async function getItemByValue(val: any): Promise<AnyOptionItem | undefined> {
    if (_dict) {
      let hint = cookHint(val);
      let re = await _dict.getStdItem(hint);
      if (re) {
        return re.toOptionItem();
      }
    }
  }
  //------------------------------------------------
  /**
   *
   * @param offset 1: down(next), -1: up(prev)
   */
  /**
   * 处理键盘上下键事件，根据偏移量选择下一个或上一个选项。
   *
   * @param offset - 偏移量，正数表示向下移动，负数表示向上移动，0表示不移动。
   * > 1: down(next), -1: up(prev)
   *
   * @returns {Promise<void>} - 异步函数，无返回值。
   *
   * @remarks
   * - 如果偏移量为0，函数直接返回。
   * - 如果 `_options.value` 为空，函数直接返回。
   * - 如果选项列表未展示，调用 `reloadOptioinsData` 重新加载选项数据。
   * - 如果当前没有选中的值，使用第一个选项。
   * - 如果当前选中的值在选项列表中找不到，使用第一个选项。
   * - 根据偏移量获取下一个选项，并更新 `_box_state`。
   */
  async function onKeyUpOrDown(offset: number) {
    if (offset == 0) {
      return;
    }
    if (!_options) {
      return;
    }
    let { reloadOptioinsData, getOptionItemIndex, getOptionItemAt } = _options;

    // 确保展示了选项列表
    if (!hasTips.value) {
      await reloadOptioinsData();
      offset = 0;
    }

    let amend: InputBoxState = {
      usr_text: null,
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    let box_val = _box_state.box_value;
    let itIndex = 0;
    // 如果没值，就用第一个选项
    if (_.isNil(box_val)) {
      offset = 0;
    }
    // 看看当前的下标
    else {
      itIndex = getOptionItemIndex(box_val);
      // 没找到，还是用第一个选项
      if (itIndex < 0) {
        offset = 0;
      }
    }

    // 聚焦下一个项目
    let nextItem = getOptionItemAt(itIndex, offset);
    if (nextItem) {
      amend.usr_text = _display.value(nextItem) ?? "";
      amend.box_value = nextItem.value;
      amend.box_icon = nextItem.icon ?? null;
      amend.box_text = nextItem.text ?? null;
      amend.box_tip = nextItem.tip ?? null;
    }

    // 更新状态
    __amend_box_state(amend);
  }
  //------------------------------------------------
  function setFocused(focused: boolean) {
    if (isReadonly.value) {
      _focused.value = false;
    } else {
      _focused.value = focused;
    }
  }
  //------------------------------------------------
  function whenFocused() {
    if (_focused.value && !isReadonly.value) {
      if (props.autoSelect) {
        nextTick(() => {
          let $input = getInputElement();
          if ($input && _focused.value) {
            $input.select();
          }
        });
      }

      // 如果需要展示选项
      if (props.tipShowTime == "focus" && _options) {
        let { reloadOptioinsData } = _options;
        reloadOptioinsData();
      }
    }
  }
  //------------------------------------------------
  function clearOptionsData() {
    if (_options_data.value) {
      // console.error('clearOptionsData');
      _options_data.value = undefined;
    }
  }
  //------------------------------------------------
  function onClickIcon(event: any) {
    if ("click:prefix-icon" == event) {
      emit("click:prefix-icon");
    } else if ("click:suffix-icon" == event) {
      emit("click:suffix-icon");
    } else {
      emit("click", event);
    }
  }
  //------------------------------------------------
  function emitIfChanged() {
    if (isReadonly.value) {
      return;
    }
    let val = _box_state.box_value;
    let emitType = props.emitType || "value";
    if (!_.isEqual(val, props.value)) {
      // 空值
      if (_.isNil(val) || "" === val) {
        if (!props.keepEmptyValue) {
          val = null;
        }
        if (props.onValueChange) {
          props.onValueChange(val);
        }
        emit("change", val);
      }
      // 原始对象
      else if ("raw-item" == emitType && _dict) {
        let hint = cookHint(val);
        _dict.getStdItem(hint).then((it) => {
          let item = it?.toOptionItem();
          if (props.onValueChange) {
            props.onValueChange(val);
          }
          emit("change", item ?? null);
        });
      }
      // 标准对象
      else if ("std-item" == emitType && _dict) {
        let item: AnyOptionItem = {
          value: _box_state.box_value,
          text: _box_state.box_text ?? undefined,
          icon: _box_state.box_icon ?? undefined,
          tip: _box_state.box_tip ?? undefined,
        };
        if (props.onValueChange) {
          props.onValueChange(val);
        }
        emit("change", item);
      }
      // 采用值
      else {
        if (props.onValueChange) {
          props.onValueChange(val);
        }
        emit("change", val);
      }
    }
  }
  //------------------------------------------------
  // 重置 _options_data
  //------------------------------------------------
  if (!_focused.value) {
    clearOptionsData();
  }
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  let api = {
    // _box_state,
    // _options_data,
    // _focused,
    getElement,
    getInputElement,
    hasTips,
    Text: InputText,
    shouldWhenEmit,
    Value: computed(() => _box_state.box_value),
    isFocused: computed(() => _focused.value),
    isReadonly,
    isInputReadonly,
    OptionsData,
    updateBoxState,
    setValueByItem,
    setFocused,
    whenFocused,
    applyPipe,
    applyTipsByHint,
    //debounceApplyTipsByHint,
    applyPipeAndTips,
    debounceApplyPipeAndTips,
    onPropsValueChange,
    debouncePropsValueChange,
    onKeyUpOrDown,
    clearOptionsData,
    getItemByValue,
    showOptions: async () => {
      if (!hasTips.value && !isInputReadonly.value) {
        await _options?.reloadOptioinsData();
      }
    },
    onClickIcon,

    emitIfChanged,
    Placeholder: computed(() => usePlaceholder(props)),
  };
  if (props.exportApi) {
    props.exportApi(api);
  }
  return api;
}
