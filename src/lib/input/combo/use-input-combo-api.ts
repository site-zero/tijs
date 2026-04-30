import {
  AnyOptionItem,
  BoxOptionsStatus,
  getBoxDisplayText,
  useBoxValue,
  useDeferList,
  useDisplayText,
  useLastHint,
  useOptionItem,
  useOptionsFilter,
  useOptionsReloading,
  usePlaceholder,
  useReadonly,
  useValuePipe,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { InputComboEmitter, InputComboProps } from "./input-combo-types";

const debug = false;

export type InputComboApi = ReturnType<typeof useTiInputComboApi>;

export type InputComoboSetup = {
  emit: InputComboEmitter;
  getTopElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
};

export function useTiInputComboApi(
  props: InputComboProps,
  setup: InputComoboSetup
) {
  const { emit, getTopElement, getInputElement } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _focused = ref<boolean>(false);
  const _options_data = ref<Vars[]>([]);
  const _options_status = ref<BoxOptionsStatus>("hide");
  const _current_item = ref<Vars>();
  //-----------------------------------------------------
  const _defer_list = useDeferList();
  //-----------------------------------------------------
  const _last_hint = useLastHint();
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  //-----------------------------------------------------
  const _display = computed(() => useDisplayText(props));
  const _pipe = computed(() => useValuePipe(props));
  //-----------------------------------------------------
  const _box_options = computed(() => useOptionItem<any>(props));
  const _box_filter = computed(() => useOptionsFilter(props));
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
  const Placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const isOptionsDataReady = computed(
    () => _options_status.value === "ready" && !_.isEmpty(_options_data.value)
  );
  const isOptionsDataLoading = computed(
    () => _options_status.value === "loading"
  );
  const isOptionsDataHide = computed(() => _options_status.value === "hide");
  const isOptionsDataShow = computed(() => !isOptionsDataHide.value);
  const hasOptionsData = computed(() => (props.loadOptions ? true : false));
  //-----------------------------------------------------
  const BoxValueType = computed(() => _box_val.value.BoxValueType.value);
  const PropsRawValue = computed(() => _box_val.value.PropsRawValue.value);
  const PropsStrValue = computed(() => _box_val.value.PropsStrValue.value);
  //-----------------------------------------------------
  const FilteredOptionsData = computed(() => {
    return _box_filter.value.filterOptionsData(_options_data.value || []);
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
      toOptionItem,
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
  function lookupItem(hint?: string) {
    if (_box_options.value && hint) {
      return _box_options.value.lookupItem(_options_data.value, hint);
    }
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
      return;
    }
    $input.focus();
    if (props.autoSelect) {
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

    if (debug)
      console.log(
        `tryNotifyChange(${val}) _current_item=`,
        _.cloneDeep(_current_item.value)
      );

    // 准备值
    let newVal = _box_val.value.unifyValue(val, _current_item.value);
    if (debug)
      console.log(
        `tryNotifyChange(${val}) vtype=${BoxValueType.value}, newVal=`,
        newVal
      );

    // 清理一下显示对象
    setCurrentItem(undefined);

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
  const _reloader = useOptionsReloading({
    _last_hint,
    _pipe_value: _pipe.value,
    isReadonly: () => isReadonly.value,
    hasOptionsData: () => hasOptionsData.value,
    isOptionsDataShow: () => isOptionsDataShow.value,
    setOptionsStatus,
    getOptionsData: () => _options_data.value,
    setOptionsData: (data: Vars[]) => {
      _options_data.value = data;
    },
    load: props.loadOptions,
    needReloadWhenHintChange: () => true,
  });
  //-----------------------------------------------------
  async function reloadOptionsData(hint?: string) {
    return await _reloader.reloadOptionsData(hint);
  }
  //-----------------------------------------------------
  async function tryReloadOptionsData(hint?: string) {
    await _reloader.tryReloadOptionsData(hint);
  }
  //-----------------------------------------------------
  async function tryReloadOptionsDataAndLookupItem(input: string) {
    if (debug) console.log(`tryReloadOptionsDataAndLookupItem(${input})`);

    // 如果 Tab 走的很快，那么 debounceTryReloadOptionsDataAndLookupItem
    // 会导致一个延迟加载，这会一个怪异的现象：
    // 输入框分明已经失焦了，但是几百毫秒以后，仍然会自动展现出选项下拉
    // 为此，我们加个判断，来防守一下
    if (!_focused.value) {
      if (debug)
        console.log(
          `tryReloadOptionsDataAndLookupItem(${input}) ignore for focused==false`
        );
      return;
    }

    await _reloader.tryReloadOptionsData(input);
    let it = lookupItem(input);
    setCurrentItem(it);
  }
  //-----------------------------------------------------
  const debounceTryReloadOptionsDataAndLookupItem = _.debounce(
    tryReloadOptionsDataAndLookupItem,
    props.tipShowDelay
  );
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    debug,
    // 计算属性
    shouldDelayTipReload,
    isFocused,
    isReadonly,
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
    //--------
    getTopElement,
    getInputElement,
    // 操作函数
    setFocused,
    setOptionsStatus,
    setCurrentItem,
    DeferList: _defer_list,
    // 数据改动
    applyPipe,
    tryNotifyChange,
    // 远程操作
    lookupItem,
    reloadOptionsData,
    tryReloadOptionsData,
    tryReloadOptionsDataAndLookupItem,
    debounceTryReloadOptionsDataAndLookupItem,
  };
}
