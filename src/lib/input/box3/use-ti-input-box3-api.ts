import {
  feaBoxAspect,
  useBoxHintCooking,
  useBoxOptionsData,
  useDict,
  useDisplayText,
  useReadonly,
  useValuePipe,
  useViewport,
  Vars,
} from "@site0/tijs";
import { computed, ref } from "vue";
import { useBoxPrefixSuffix } from "./_fea/fea-box-prefix-suffix";
import { BoxIconEmit, BoxIconHandler } from "./_fea/types-box-icon";
import { InputBox3Emitter, InputBox3Props } from "./ti-input-box3-types";

export type TiInputBox3Setup = {
  emit: InputBox3Emitter;
  getTopElement: () => HTMLElement | null;
  getInputElement: () => HTMLElement | null;
};

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
  const _aspect = feaBoxAspect(props, {
    isFocused: () => _focused.value,
    isTipBoxReady: () => false,
    isReadonly: () => _readonly.value.isReadonly(props),
    getViewport: () => _viewport.value,
    getTipMainBoxStyle: () => {
      return {};
    },
  });
  //-----------------------------------------------------
  const _presuffix = computed(() =>
    useBoxPrefixSuffix(props, {
      getBoxIcon: () => undefined,
      isReadonly: () => _readonly.value.isReadonly(props),
      onInvoke: (hdl: BoxIconHandler) => {
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
      getOptionsData: () => _options_data.value,
      setOptionsData: (data: Vars[]) => (_options_data.value = data || []),
      cookHint: _cook_hint.value,
    });
  });
  //-----------------------------------------------------
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
  const isInputReadonly = computed(() => isReadonly.value || !props.canInput);
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------

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
      _current_item.value = await opts.loadRawItemByValue(props.value);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  const api = {
    // 计算属性
    // 操作函数
    // 数据校验
    // 数据改动
    // 远程操作
  };
  return api;
}
