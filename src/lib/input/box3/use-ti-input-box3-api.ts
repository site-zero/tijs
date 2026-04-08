import {
  Box3IconHandler,
  feaBoxAspect,
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
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { useBoxPrefixSuffix } from "./_fea/fea-box-prefix-suffix";
import { BoxIconEmit } from "./_fea/types-box-icon";
import { InputBox3Emitter, InputBox3Props } from "./ti-input-box3-types";

export type TiInputBox3Setup = {
  emit: InputBox3Emitter;
  getTopElement: () => HTMLElement | null;
  getInputElement: () => HTMLElement | null;
};

export type Box3OptionsStatus = "loading" | "ready" | "hide";

export function useTiInputBox3Api(
  props: InputBox3Props,
  setup: TiInputBox3Setup
) {
  const { emit, getTopElement } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _focused = ref<boolean>(false);
  const _options_data = ref<Vars[]>([]);
  const _options_status = ref<Box3OptionsStatus>("hide");
  const _current_item = ref<Vars>();
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  //-----------------------------------------------------
  const _viewport = computed(() =>
    useViewport({
      getElement: getTopElement,
    })
  );
  //-----------------------------------------------------
  const _aspect = computed(() =>
    feaBoxAspect(props, {
      isFocused: () => _focused.value,
      isTipBoxReady: () => false,
      isReadonly: () => _readonly.value.isReadonly(props),
      getViewport: () => _viewport.value,
      getTipMainBoxStyle: () => {
        return {};
      },
    })
  );
  //-----------------------------------------------------
  const _presuffix = computed(() =>
    useBoxPrefixSuffix(props, {
      getBoxIcon: () => undefined,
      isReadonly: () => _readonly.value.isReadonly(props),
      onInvoke: (hdl: Box3IconHandler) => {
        hdl(api);
      },
      onEmit: (clickEmit: BoxIconEmit) => {
        emit(clickEmit);
      },
      onClear: () => {},
      onCopy: () => {},
      onOpen: () => {},
      onLoadOptions: () => {},
    })
  );
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
  const DisplayText = computed(() => {
    if (_current_item.value) {
      return _display.value(_current_item.value);
    }
    if (_.isNil(props.value)) {
      return "";
    }
    return Str.anyToStr(props.value);
  });
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function setFocused(focused: boolean) {
    _focused.value = focused;
  }
  //-----------------------------------------------------
  function setOptionsReady(st: Box3OptionsStatus) {
    _options_status.value = st;
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
  // 数据改动
  //-----------------------------------------------------

  //-----------------------------------------------------
  // 远程操作
  //-----------------------------------------------------
  async function reloadCurrentItem() {
    _current_item.value = undefined;
    if (_box_options.value) {
      let opts = _box_options.value;
      _current_item.value = await opts.loadRawItemByValue(
        _options_data.value,
        props.value
      );
    }
  }
  //-----------------------------------------------------
  async function reloadOptionsData() {
    _options_status.value = "loading";
    if (_box_options.value) {
      let opts = _box_options.value;
      _options_data.value = await opts.reloadOptioinsData();
    }
    _options_status.value = "ready";
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  const api = {
    Aspect: _aspect,
    PreSuffix: _presuffix,
    Display: _display,
    // 计算属性
    isFocused,
    isReadonly,
    isInputReadonly,
    Placeholder,
    FilteredOptionsData,
    isOptionsDataEmpty,
    isFilteredOptionsDataEmpty,
    DisplayText,
    // 操作函数
    setFocused,
    setOptionsReady,
    setOptionsStatus,
    setCurrentItem,
    // 数据校验
    // 数据改动
    // 远程操作
    reloadCurrentItem,
    reloadOptionsData,
  };
  return api;
}
