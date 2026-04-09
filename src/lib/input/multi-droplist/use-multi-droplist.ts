import {
  BoxOptionsStatus,
  ListSelectEmitInfo,
  TableRowID,
  TagItem,
  useBoxOptionsData,
  useDict,
  useReadonly,
  Util,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";
import {
  MultiDroplistEmitter,
  MultiDroplistProps,
} from "./ti-multi-droplist-types";

export type MultiDroplistApi = ReturnType<typeof useMultiDroplist>;

export function useMultiDroplist(
  props: MultiDroplistProps,
  emit: MultiDroplistEmitter
) {
  //console.log('useMultiDroplist');
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _items = ref<TagItem[]>();
  const _it_values = ref<TableRowID[]>();
  //-----------------------------------------------------
  const _options_data = ref<Vars[]>();
  const _options_status = ref<BoxOptionsStatus>("hide");
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
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
  // 计算属性
  //-----------------------------------------------------
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
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
  const TagItems = computed(() => _items.value);
  //-----------------------------------------------------
  const TagValues = computed(() => {
    if (_it_values.value) {
      return _it_values.value;
    }
    let vals: TableRowID[] = [];
    if (props.value) {
      vals = _.concat([], props.value);
    }
    return vals;
  });
  //-----------------------------------------------------
  // 操作函数
  //-----------------------------------------------------
  function setOptionsStatus(status: BoxOptionsStatus) {
    _options_status.value = status;
  }
  //-----------------------------------------------------
  function changeItems(items: TagItem[]) {
    let vals = _.map(items, (it) => it.value);
    tryNotifyChange(vals);
  }
  //-----------------------------------------------------
  function removeItem(it: TagItem) {
    let vals: TableRowID[] = [];
    for (let val of TagValues.value) {
      if (val != it.value) {
        vals.push(val);
      }
    }
    tryNotifyChange(vals.length == 0 ? null : vals);
  }
  //-----------------------------------------------------
  function clearOptionsData() {
    _options_data.value = undefined;
    _it_values.value = undefined;
  }
  //-----------------------------------------------------
  function tryNotifyChange(
    vals: TableRowID[] | undefined | null = _it_values.value
  ) {
    // console.log('tryNotifyChange', vals);
    if (_.isUndefined(vals)) {
      return;
    }
    if (_.isEqual(vals, props.value)) {
      return;
    }
    emit("change", vals ?? null);
  }
  //-----------------------------------------------------
  // 异步方法
  //-----------------------------------------------------
  async function onOptionSelect(payload: ListSelectEmitInfo) {
    let ids = Util.anyToTruthyKeys(payload.checkedIds);
    // console.log('onOptionSelect', payload.checkedIds);
    _it_values.value = ids;
    await _load_items(ids);
  }
  //-----------------------------------------------------
  async function cancelChange() {
    clearOptionsData();
    setOptionsStatus("hide");
    await onPropsValueChange();
  }
  //-----------------------------------------------------
  async function openOptions() {
    if (props.readonly) {
      return;
    }
    let opts = _box_options.value;
    if (opts) {
      _options_status.value = "loading";
      _options_data.value = await opts.reloadOptioinsData();
      _options_status.value = "ready";
    }
  }
  //-----------------------------------------------------
  let delay_load: (TableRowID[] | undefined)[] | null = null;
  //-----------------------------------------------------
  async function _load_items(vals?: TableRowID[]) {
    // console.log(
    //   "_load_items",
    //   vals?.length || 0,
    //   vals,
    //   `_delay_laod: [${delay_load?.length}]`
    // );
    let items: TagItem[] = [];

    // 准备取消控制器
    if (!delay_load) {
      delay_load = [];
    }
    // 如果正在读取，那么记录到最后
    else {
      delay_load.push(vals);
      return;
    }

    // 逐个值来处理
    if (vals) {
      for (let val of vals) {
        let it = await _dict.value?.getStdItem(val);
        if (!it) {
          items.push({
            text: `${val}`,
            value: val,
          });
        }
        // 显示标准项目
        else {
          items.push({
            icon: it.icon,
            text: it.text,
            value: it.value,
            tip: it.tip,
          });
        }
      }
    }

    // 继续取最后一个直接读取
    if (delay_load && delay_load.length > 0) {
      let lastValues = delay_load.pop();
      delay_load = null;
      await _load_items(lastValues);
    }
    // 清空栈并设置值
    else {
      delay_load = null;
      //console.log("_item.value=", items.length, vals);
      _items.value = items.length > 0 ? items : undefined;
    }
  }
  //-----------------------------------------------------
  async function onPropsValueChange() {
    //console.log("onPropsValueChange", props.value);
    await _load_items(TagValues.value);
  }
  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    // 计算属性
    isReadonly,
    isOptionsDataReady,
    isOptionsDataLoading,
    isOptionsDataHide,
    isOptionsDataShow,
    hasOptionsData,
    FilteredOptionsData,
    TagItems,
    TagValues,

    // 操作函数
    setOptionsStatus,
    changeItems,
    removeItem,
    clearOptionsData,
    tryNotifyChange,

    // 异步方法
    onOptionSelect,
    cancelChange,
    openOptions,
    onPropsValueChange,
  };
}
