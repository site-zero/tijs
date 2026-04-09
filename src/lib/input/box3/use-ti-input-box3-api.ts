import {
  AnyOptionItem,
  Str,
  useBoxHintCooking,
  useBoxOptionsData,
  useDict,
  useDisplayText,
  usePlaceholder,
  useReadonly,
  useValuePipe,
  useViewport,
  Vars,
  ViewportApi,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { useLastHint } from "./_fea/fea-last-hint";
import { InputBox3Emitter, InputBoxProps } from "./ti-input-box3-types";

export type TiInputBox3Setup = {
  emit: InputBox3Emitter;
  getTopElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
};

export type Box3OptionsStatus = "loading" | "ready" | "hide";

export function useTiInputBox3Api(
  props: InputBoxProps,
  setup: TiInputBox3Setup
) {
  const { emit, getTopElement, getInputElement } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _focused = ref<boolean>(false);
  const _options_data = ref<Vars[]>([]);
  const _options_status = ref<Box3OptionsStatus>("hide");
  const _current_item = ref<Vars>();
  //-----------------------------------------------------
  // 在 try_blur 里面会有可能注册一个延迟处理函数
  const _defer_blur = ref<Function>();
  //-----------------------------------------------------
  const _last_hint = useLastHint();
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  //-----------------------------------------------------
  const _viewport = computed((): ViewportApi => {
    return useViewport({
      getElement: api.getTopElement,
    });
  });
  //-----------------------------------------------------
  const _display = computed(() => useDisplayText(props));
  const _pipe = computed(() => useValuePipe(props));
  const _dict = computed(() => useDict(props));
  const _cook_hint = computed(() => useBoxHintCooking(props));
  //-----------------------------------------------------
  const _box_options = computed(() => {
    if (!_dict.value) return;
    return useBoxOptionsData(props, {
      dict: _dict.value,
      cookHint: _cook_hint.value,
    });
  });
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
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
  function clearHints() {
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
    // 明确的记录了 lastHint
    if (LastHint.value) {
      return LastHint.value;
    }

    // 尝试采用选择的 Item
    let boxItem = _current_item.value;
    let boxOpts = _box_options.value;
    if (boxOpts && boxItem) {
      // 如果聚焦了输入框，指明显示裸值，就显示裸值
      if (isOptionsDataShow.value && !props.useTextWhenFocus) {
        let std = boxOpts.toOptionItem(boxItem);
        return Str.anyToStr(std.value);
      }
      // 否则翻译显示值
      return _display.value(boxItem);
    }

    // 空值，一定归一化为空串
    if (_.isNil(props.value)) {
      return "";
    }
    
    // 直接显示值
    return Str.anyToStr(props.value);
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
  // 操作函数
  //-----------------------------------------------------
  function setFocused(focused: boolean) {
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
  function setOptionsStatus(status: Box3OptionsStatus) {
    _options_status.value = status;
  }
  //-----------------------------------------------------
  function setCurrentItem(item?: Vars | null) {
    _current_item.value = item ?? undefined;
  }
  //-----------------------------------------------------
  function setDeferBlur(do_blur: Function) {
    _defer_blur.value = do_blur;
  }
  //-----------------------------------------------------
  async function tryDeferBlur() {
    if (_defer_blur.value) {
      await _defer_blur.value();
      _defer_blur.value = undefined;
    }
  }
  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------
  function applyPipe(input: any) {
    let val = _pipe.value(input);
    return val;
  }
  //-----------------------------------------------------
  function notifyChange(val: any) {
    console.log("notifyChange", val);
    // 没必要做重复操作
    if (_.isEqual(props.value, val)) {
      return;
    }
    emit("change", val);
    if (props.onValueChange) {
      props.onValueChange(val);
    }
  }
  //-----------------------------------------------------
  async function tryNotifyChange(val: any) {
    console.log("tryNotifyChange", val);
    // 如果有选项，则需要检查选项
    if (hasOptionsData.value && props.mustInOptions) {
      let item = await reloadItem(val);
      if (!item) {
        val = null;
      }
    }
    // 没必要做重复操作
    if (_.isEqual(props.value, val)) {
      return;
    }
    emit("change", val);
  }
  //-----------------------------------------------------
  // 远程操作
  //-----------------------------------------------------
  async function reloadItem(val: any) {
    if (_box_options.value) {
      let opts = _box_options.value;
      return await opts.loadRawItemByValue(_options_data.value, val);
    }
  }
  //-----------------------------------------------------
  async function reloadCurrentItem() {
    _current_item.value = await reloadItem(props.value);
  }
  //-----------------------------------------------------
  async function tryReloadCurrentItem() {
    let cv = _current_item.value;
    if (!_.isEqual(cv, props.value)) {
      await reloadCurrentItem();
    }
  }
  //-----------------------------------------------------
  function lookupItem(hint?: string) {
    if (_box_options.value && hint) {
      return _box_options.value.lookupItem(_options_data.value, hint);
    }
  }
  //-----------------------------------------------------
  async function reloadOptionsData(hint?: string) {
    if (_box_options.value) {
      _options_status.value = "loading";
      let opts = _box_options.value;
      _options_data.value = await opts.reloadOptioinsData(hint);
      _options_status.value = "ready";
    }
  }
  //-----------------------------------------------------
  async function tryReloadOptionsData(hint?: string) {
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
  // 返回接口
  //-----------------------------------------------------
  const api = {
    BoxView: _viewport,
    // 计算属性
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
    FilteredOptionsData,
    isOptionsDataEmpty,
    isFilteredOptionsDataEmpty,
    //--------
    LastHint,
    clearHints,
    //--------
    CurrentItem: CurrentItem,
    CurrentItemValue: CurrentItemValue,
    //--------
    DisplayText,
    //--------
    toOptionItem,
    getOptionItemByVal,
    getNextOptionItem,
    //--------
    getTopElement,
    getInputElement,
    // 操作函数
    setFocused,
    setOptionsStatus,
    setCurrentItem,
    setDeferBlur,
    tryDeferBlur,
    // 数据改动
    applyPipe,
    notifyChange,
    tryNotifyChange,
    // 远程操作
    reloadItem,
    reloadCurrentItem,
    tryReloadCurrentItem,
    lookupItem,
    reloadOptionsData,
    tryReloadOptionsData,
  };
  return api;
}
