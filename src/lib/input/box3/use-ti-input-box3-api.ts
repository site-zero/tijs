import {
  AnyOptionItem,
  BoxOptionsDataApi,
  BoxOptionsStatus,
  isAsyncFunc,
  useBoxHintCooking,
  useBoxOptionsData,
  useBoxValue,
  useDict,
  useDisplayText,
  usePlaceholder,
  useReadonly,
  useValuePipe,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { useLastHint } from "./_fea";
import { getBoxDisplayText } from "./_fea/get-box-display-text";
import { InputBoxEmitter, InputBoxProps } from "./ti-input-box3-types";

const debug = false;

export type InputBox3Setup = {
  emit: InputBoxEmitter;
  getTopElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
};

export function useTiInputBox3Api(props: InputBoxProps, setup: InputBox3Setup) {
  const { emit, getTopElement, getInputElement } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _focused = ref<boolean>(false);
  const _options_data = ref<Vars[]>([]);
  const _options_status = ref<BoxOptionsStatus>("hide");
  const _current_item = ref<Vars>();
  //-----------------------------------------------------
  /**
   * 下面的操作
   *  - blur
   *  - on_input_change
   * 有可能是下面操作导致的:
   * 1. 点击输入框以外区域
   *    > 我们需要延迟的处理所有的 defer
   * 2. 点击选项: 会先触发 change/blur,
   *    > 我们需要保留 options 的 DOM，为此 change/blur 的操作会被 defer
   *    > 在 try_select_option_item 我们可以有机会无视这些 defer
   * 3. Enter 键: 可以立即处理
   * 4. Tab 键: 可以立即处理
   */
  const _defer_list = ref<Function[]>([]);
  //-----------------------------------------------------
  const _last_hint = useLastHint();
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  //-----------------------------------------------------
  const _display = computed(() => useDisplayText(props));
  const _pipe = computed(() => useValuePipe(props));
  const _dict = computed(() => useDict(props));
  const _cook_hint = computed(() => useBoxHintCooking(props));
  //-----------------------------------------------------
  const _box_options = computed((): BoxOptionsDataApi | undefined => {
    if (!_dict.value) return;
    return useBoxOptionsData(props, {
      dict: _dict.value,
      cookHint: _cook_hint.value,
    });
  });
  //-----------------------------------------------------
  const _box_val = computed(() => {
    return useBoxValue(props, {
      toOptionItem,
    });
  });
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const shouldDelayTipReload = computed(
    () => props.tipShowDelay && props.tipShowDelay > 0
  );
  const isFocused = computed(() => _focused.value);
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
  const isInputReadonly = computed(() => isReadonly.value || !props.canInput);
  const Placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const isOptionsDataReady = computed(() => _options_status.value === "ready");
  const isOptionsDataLoading = computed(
    () => _options_status.value === "loading"
  );
  const isOptionsDataHide = computed(() => _options_status.value === "hide");
  const isOptionsDataShow = computed(() => !isOptionsDataHide.value);
  const hasOptionsData = computed(() => (_dict.value ? true : false));
  //-----------------------------------------------------
  const BoxValueType = computed(() => _box_val.value.BoxValueType.value);
  const PropsRawValue = computed(() => _box_val.value.PropsRawValue.value);
  const PropsStrValue = computed(() => _box_val.value.PropsStrValue.value);
  //-----------------------------------------------------
  const FilteredOptionsData = computed(() => {
    return _box_options.value?.filterOptionsData(_options_data.value || []);
  });
  //-----------------------------------------------------
  const isOptionsDataEmpty = computed(() => {
    return _.isEmpty(_options_data.value);
  });
  //-----------------------------------------------------
  const isFilteredOptionsDataEmpty = computed(() => {
    return _.isEmpty(FilteredOptionsData.value);
  });
  //-----------------------------------------------------
  const LastHint = computed(() => _last_hint.LastHint.value);
  //------------------------------------------------
  function setLastHint(hint: string | undefined) {
    _last_hint.setLastHint(hint);
  }
  //------------------------------------------------
  function clearLastHints() {
    _last_hint.setLastHint(undefined);
    _last_hint.rejectPending("!ClearHints!");
  }
  //-----------------------------------------------------
  const CurrentItem = computed(() => {
    if (!_current_item.value) return;
    return _box_options.value?.toOptionItem(_current_item.value);
  });
  const CurrentItemValue = computed(() => {
    return CurrentItem.value?.value;
  });
  //-----------------------------------------------------
  const DisplayText = computed(() => {
    let re = getBoxDisplayText({
      lastHint: LastHint.value,
      boxOptions: _box_options.value,
      boxItem: _current_item.value,
      isOptionsDataShow: isOptionsDataShow.value,
      useTextWhenFocus: props.useTextWhenFocus ?? false,
      pickDisplayText: _display.value,
      InputStrValue: PropsStrValue.value,
    });
    if (debug) console.log(`DisplayText: [${re}]`);
    return re;
  });
  //-----------------------------------------------------
  function toOptionItem(it?: Vars | null | undefined): AnyOptionItem | null {
    if (_.isNil(it) || !_box_options.value) {
      return null;
    }
    return _box_options.value.toOptionItem(it);
  }
  //-----------------------------------------------------
  function getOptionItemByVal(value: any) {
    return _box_options.value?.getOptionItemByVal(_options_data.value, value);
  }
  //-----------------------------------------------------
  function getNextOptionItem(offset: number): Vars | undefined {
    // 防空
    if (!_box_options.value) {
      return undefined;
    }
    const box = _box_options.value;
    const list = FilteredOptionsData.value || [];
    const val = CurrentItemValue.value;
    let index = box.getOptionItemIndex(list, val);
    return box.getRawItemAt(list, index, offset);
  }
  //-----------------------------------------------------
  function getInputLiveValue() {
    let $input = getInputElement();
    if (!$input) {
      return "";
    }
    return $input.value;
  }
  //-----------------------------------------------------
  /**
   * 在 `try_show_options` 时候，如果需要重新加载 options data
   * 我们可能需要重新获取当前输入框的 live value 作为 hint
   *
   * 因为，服务器在 tipUseHint 时，表示总是需要你输入点什么，它才好
   * 查询数据，通常这是因为目标数据数量太多，需要客户端给点提示。
   *
   * 因此在这个场景下，我们就需要直接从输入框取值，提供给 reload 函数。
   *
   * 但是在大多数少量数据的场景，就不需要，因为它总是获取全量数据的。
   * 并且这通常也会被 TiDict 缓存
   */
  function getLiveHintForReloadOptions() {
    if (!props.tipUseHint) {
      return undefined;
    }
    return getInputLiveValue();
  }
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function setFocused(focused: boolean) {
    if (isReadonly.value) {
      return;
    }
    if (focused && _focused.value) return;
    _focused.value = focused;
    if (!focused) {
      return;
    }
    // 自动聚焦
    let $input = getInputElement();
    if (!$input) {
      console.warn("TiInputBox3: 没有找到 Input 元素");
      return;
    }
    $input.focus();
    if (props.autoSelect && props.canInput) {
      $input.select();
    }
  }
  //-----------------------------------------------------
  function setOptionsStatus(status: BoxOptionsStatus) {
    _options_status.value = status;
  }
  //-----------------------------------------------------
  function setCurrentItem(item?: Vars | null) {
    _current_item.value = item ?? undefined;
  }
  //-----------------------------------------------------
  function addDefer(deferFn: Function) {
    _defer_list.value.push(deferFn);
    if (debug) console.log("addDefer: len=", _defer_list.value.length);
  }
  //-----------------------------------------------------
  function clearDefer() {
    _defer_list.value = [];
    if (debug) console.log("clearDefer: len=", _defer_list.value.length);
  }
  //-----------------------------------------------------
  async function tryDeferList() {
    for (let deferFn of _defer_list.value) {
      if (isAsyncFunc(deferFn)) {
        await deferFn();
      } else {
        deferFn();
      }
    }
    _defer_list.value = [];
  }
  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------
  function applyPipe(input: any) {
    let val = _pipe.value(input);
    return val;
  }
  //-----------------------------------------------------
  async function tryNotifyChange(val: any) {
    if (debug) console.log(`tryNotifyChange(${val})`);
    // 如果有选项，则需要检查选项
    if (hasOptionsData.value) {
      let item = await reloadItem(val);
      if (!item) {
        if (debug) console.log(`tryNotifyChange(${val}) !item=> undefined`);
        _current_item.value = undefined;
        if (props.mustInOptions) {
          val = null;
        }
      } else {
        if (debug) console.log(`tryNotifyChange(${val}) item=`, { ...item });
        _current_item.value = item;
      }
    }
    if (debug)
      console.log(
        `tryNotifyChange(${val}) _current_item=`,
        _.cloneDeep(_current_item.value)
      );

    // 准备值
    // let vtype = BoxValueType.value;
    // let newVal: any = null;
    // if (!_.isNil(val)) {
    //   // 裸对象
    //   if ("raw-item" == vtype) {
    //     if (_current_item.value) {
    //       newVal = _.cloneDeep(_current_item.value);
    //     } else {
    //       newVal = { value: val };
    //     }
    //   }
    //   // 标准对象
    //   else if ("std-item" == vtype) {
    //     if (_current_item.value) {
    //       newVal = toOptionItem(_current_item.value);
    //     } else {
    //       newVal = { value: val };
    //     }
    //   }
    //   // 默认就用值
    //   else {
    //     newVal = val;
    //   }
    // }
    let newVal = _box_val.value.unifyValue(val, _current_item.value);
    if (debug)
      console.log(
        `tryNotifyChange(${val}) vtype=${BoxValueType.value}, newVal=`,
        newVal
      );

    // 没必要做重复操作
    if (_.isEqual(props.value, newVal)) {
      if (debug) console.log(`tryNotifyChange(${val}): skip for isEqual`);
      return;
    }

    // 回调函数
    if (props.onValueChange) {
      props.onValueChange(newVal);
    }

    // 通知改动
    emit("change", newVal);
    if (debug) console.log(`tryNotifyChange(${val}): emit change`, newVal);
  }
  //-----------------------------------------------------
  // 远程操作
  //-----------------------------------------------------
  async function reloadItem(val: any) {
    if (_box_options.value) {
      let box = _box_options.value;
      if (props.optionKeepRaw) {
        return await box.loadRawItemByValue(_options_data.value, val);
      }
      return await box.loadStdItemByValue(_options_data.value, val);
    }
  }
  //-----------------------------------------------------
  async function reloadCurrentItem() {
    const inputVal = PropsStrValue.value;
    if (debug) console.log(`>>> reloadCurrentItem: inputVal=${inputVal}`);
    // 没必要重新加载了
    if (_.isEqual(inputVal, CurrentItemValue.value)) {
      if (debug)
        console.log(`<<< reloadCurrentItem(${inputVal}): skip for isEqual`);
      return;
    }
    _current_item.value = await reloadItem(inputVal);
    if (debug)
      console.log(
        `<<< reloadCurrentItem: _current_item=`,
        _.cloneDeep(_current_item.value)
      );
  }
  //-----------------------------------------------------
  function lookupItem(hint?: string) {
    if (_box_options.value && hint) {
      return _box_options.value.lookupItem(_options_data.value, hint);
    }
  }
  //-----------------------------------------------------
  async function reloadOptionsData(hint?: string) {
    // 防守
    if (isReadonly.value) {
      setOptionsStatus("hide");
      _options_data.value = [];
      return;
    }
    if (debug) console.log(`reloadOptionsData(${hint})`);
    if (_box_options.value) {
      setOptionsStatus("loading");
      let opts = _box_options.value;
      let piped_hint = _pipe.value(hint);
      _options_data.value = await opts.reloadOptioinsData(piped_hint);

      // 最有防守一下，也许再这一时刻， box 变只读了呢？
      if (isReadonly.value) {
        setOptionsStatus("hide");
      } else {
        setOptionsStatus("ready");
      }
    }
  }
  //-----------------------------------------------------
  async function tryReloadOptionsData(hint?: string) {
    if (debug) console.log(`tryReloadOptionsData(${hint})`);

    // 如果在需要 hint 展示不同 options 的时候，那么就要实时刷新
    // 否则读取一次 options 就不需要再次读取了
    let need_reload_options = false;
    if (hasOptionsData.value) {
      if (props.tipUseHint || !isOptionsDataShow.value) {
        need_reload_options = true;
      }
    }

    // 记录一下最后一次查询
    _last_hint.setLastHint(hint);

    // 已经在读取内容了，加入等待队列
    let ing = _last_hint.tryPending(hint);
    if (ing) {
      return ing;
    }

    // 需要重新加载
    if (need_reload_options) {
      try {
        await reloadOptionsData(hint);
      } catch (err) {
        _last_hint.rejectPending(err, hint);
      }
    }
    // 解决 pending 的处理过程
    _last_hint.resolvePending(_options_data.value, hint);
  }
  //-----------------------------------------------------
  async function tryReloadOptionsDataAndLookupItem(input: string) {
    if (api.debug) console.log(`tryReloadOptionsDataAndLookupItem(${input})`);

    // 如果 Tab 走的很快，那么 debounceTryReloadOptionsDataAndLookupItem
    // 会导致一个延迟加载，这会一个怪异的现象：
    // 输入框分明已经失焦了，但是几百毫秒以后，仍然会自动展现出选项下拉
    // 为此，我们加个判断，来防守一下
    if (!_focused.value) {
      if (api.debug)
        console.log(
          `tryReloadOptionsDataAndLookupItem(${input}) ignore for focused==false`
        );
      return;
    }

    await api.tryReloadOptionsData(input);
    let it = api.lookupItem(input);
    api.setCurrentItem(it);
  }
  //-----------------------------------------------------
  const debounceTryReloadOptionsDataAndLookupItem = _.debounce(
    tryReloadOptionsDataAndLookupItem,
    props.tipShowDelay
  );
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  const api = {
    debug,
    // 计算属性
    shouldDelayTipReload,
    isFocused,
    isReadonly,
    isInputReadonly,
    Placeholder,
    //--------
    isOptionsDataReady,
    isOptionsDataLoading,
    isOptionsDataHide,
    isOptionsDataShow,
    hasOptionsData,
    //--------
    BoxValueType,
    PropsRawValue,
    PropsStrValue,
    //--------
    FilteredOptionsData,
    isOptionsDataEmpty,
    isFilteredOptionsDataEmpty,
    //--------
    LastHint,
    setLastHint,
    clearLastHints,
    //--------
    CurrentItem,
    CurrentItemValue,
    //--------
    DisplayText,
    //--------
    toOptionItem,
    getOptionItemByVal,
    getNextOptionItem,
    getInputLiveValue,
    getLiveHintForReloadOptions,
    //--------
    getTopElement,
    getInputElement,
    // 操作函数
    setFocused,
    setOptionsStatus,
    setCurrentItem,
    addDefer,
    clearDefer,
    tryDeferList,
    // 数据改动
    applyPipe,
    tryNotifyChange,
    // 远程操作
    reloadItem,
    reloadCurrentItem,
    lookupItem,
    reloadOptionsData,
    tryReloadOptionsData,
    tryReloadOptionsDataAndLookupItem,
    debounceTryReloadOptionsDataAndLookupItem,
  };
  return api;
}
