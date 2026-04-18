import {
  AnyOptionItem,
  BoxOptionsStatus,
  I18n,
  Icons,
  useBoxOptionsData,
  useBoxValue,
  useDict,
  usePlaceholder,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import { DropTagEmitter, DropTagProps } from "./ti-drop-tag-types";

const debug = false;

export type DropTagApi = ReturnType<typeof useDropTagApi>;

export type DropTagSetup = {
  emit: DropTagEmitter;
};

export function useDropTagApi(props: DropTagProps, setup: DropTagSetup) {
  const { emit } = setup;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _options_data = ref<Vars[]>([]);
  const _options_status = ref<BoxOptionsStatus>("hide");
  const _current_item = ref<Vars>();
  //-----------------------------------------------------
  const _dict = computed(() => useDict(props));
  //-----------------------------------------------------
  const _box_options = computed(() => {
    if (!_dict.value) return;
    return useBoxOptionsData(props, {
      dict: _dict.value,
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
  const CurrentItem = computed(() => {
    return _current_item.value;
  });
  //-----------------------------------------------------
  const CurrentStdItem = computed(() => {
    if (!CurrentItem.value) return;
    return _box_options.value?.toOptionItem(CurrentItem.value);
  });
  //-----------------------------------------------------
  const CurrentItemValue = computed(() => {
    return CurrentStdItem.value?.value;
  });
  //-----------------------------------------------------
  const CurrentItemHTML = computed(() => {
    if (props.renderHtml) {
      return props.renderHtml(CurrentItem.value);
    }
    let html: string[] = [];
    let it = CurrentItem.value;
    if (!it) {
      html.push(`<div class="as-empty>`);
      html.push(I18n.text(props.placeholder || "i18n:empty"));
      html.push("</div>");
    }
    // 渲染 HTML
    else {
      if (it.icon && !props.hideIcon) {
        html.push(`<span class="as-icon">`);
        html.push(Icons.fontIconHtmlWithStyle(it.icon));
        html.push(`</span>`);
      }
      if (it.text && !props.hideText) {
        let text = _.escape(it.text);
        text = I18n.text(text);
        html.push(`<span class="as-text">${text}</span>`);
      }
      if (it.tip && !props.hideTip) {
        let tip = _.escape(it.tip);
        tip = I18n.text(tip);
        html.push(`<span class="as-tip">${tip}</span>`);
      }
    }
    return html.join("");
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
  // 操作函数
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
  function tryNotifyChange() {
    const cIt = _current_item.value;
    const stdIt = toOptionItem(cIt);
    const newVal = _box_val.value.unifyValue(stdIt?.value, cIt);

    if (_.isEqual(newVal, props.value)) {
      return;
    }

    // 回调函数
    if (props.onValueChange) {
      props.onValueChange(newVal);
    }

    // 通知改动
    emit("change", newVal);
  }
  //-----------------------------------------------------
  // 远程操作
  //-----------------------------------------------------
  async function reloadItem(val: any) {
    if (_box_options.value) {
      let opts = _box_options.value;
      if (props.optionKeepRaw) {
        return await opts.loadRawItemByValue(_options_data.value, val);
      }
      return await opts.loadStdItemByValue(_options_data.value, val);
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
  async function reloadOptionsData() {
    if (debug) console.log(`reloadOptionsData`);
    if (_box_options.value) {
      _options_status.value = "loading";
      let opts = _box_options.value;
      _options_data.value = await opts.reloadOptioinsData();
      _options_status.value = "ready";
    }
  }
  //-----------------------------------------------------
  async function tryReloadOptionsData() {
    if (debug) console.log(`tryReloadOptionsData`);
    // 需要重新加载
    if (!isOptionsDataShow.value) {
      await reloadOptionsData();
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 计算属性
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
    CurrentItem,
    CurrentStdItem,
    CurrentItemValue,
    CurrentItemHTML,
    //--------
    toOptionItem,
    getOptionItemByVal,

    // 操作函数
    setOptionsStatus,
    setCurrentItem,

    // 数据改动
    tryNotifyChange,

    // 远程操作
    reloadItem,
    reloadCurrentItem,
    reloadOptionsData,
    tryReloadOptionsData,
  };
}
