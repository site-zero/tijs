import {
  ActionBarEvent,
  ActionBarProps,
  AppModalProps,
  FieldChange,
  FormFieldItem,
  FormProps,
  openAppModal,
  useFieldChange,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { dft_flt_bar_action_items } from "./support/dft-flt-bar-actions";
import { FilterBarEmitter, FilterBarProps } from "./ti-filter-bar-types";
import { useFormMajor } from "./use-form-major";

export type FilterBarApi = ReturnType<typeof useTiFilterBarApi>;

export function useTiFilterBarApi(
  props: FilterBarProps,
  emit: FilterBarEmitter
) {
  //-----------------------------------------------------
  // 常驻字段
  //-----------------------------------------------------
  const major = useFormMajor(props.major ?? {});
  const MajorFields = computed(() => major.getFields());
  const hasMajorFields = computed(() => major.hasMajorFields());
  //-----------------------------------------------------
  // 字段改动接口
  //-----------------------------------------------------
  const _major_change = computed(() => {
    return useFieldChange<FormFieldItem>(
      props.detailComConf ?? {},
      MajorFields.value
    );
  });
  //-----------------------------------------------------
  // 操作菜单
  //-----------------------------------------------------
  const { actions } = props;
  const ActionBarConfig = computed((): ActionBarProps | undefined => {
    let re = _.cloneDeep(actions) ?? {};
    _.defaults(re, {
      itemAlign: "right",
    } as Partial<ActionBarProps>);
    // 用户确定不要显示动作条
    if (re && _.isArray(re.items) && _.isEmpty(re.items)) {
      return;
    }
    // 默认动作条项目
    if (!re.items) {
      re.items = dft_flt_bar_action_items();
    }
    // 默认上下文变量集
    if (re.vars) {
      re.vars = props.vars;
    }
    return re;
  });
  //-----------------------------------------------------
  // 处理数据
  //-----------------------------------------------------
  function tryNotifyChange(newVal: Vars) {
    // 用户取消
    if (!newVal || _.isEqual(newVal, props.value)) {
      return;
    }

    // 用户确认
    emit("change", newVal);
  }
  //-----------------------------------------------------
  // 响应事件
  //-----------------------------------------------------
  function onActionFire(event: ActionBarEvent) {
    let { name: eventName } = event;
    if (eventName === "do:search") {
      emit("search", _.cloneDeep(props.value ?? {}));
    } else if (eventName === "do:reset") {
      let val = props.resetValue ?? {};
      tryNotifyChange(val);
    } else if (eventName === "do:edit") {
      openFilterEditor();
    }
  }
  //-----------------------------------------------------
  function onTagsChange(newVal: Vars) {
    // console.log("onTagsChange", newVal);
    tryNotifyChange(newVal);
  }
  //-----------------------------------------------------
  function onMajorFieldChange(change: FieldChange) {
    _major_change.value.handleValueChange(change, {
      emit: (eventName: string, payload: any) => {
        if ("change" == eventName) {
          // 融合新值
          let newData = { ...(props.value ?? {}), ...payload };
          tryNotifyChange(newData);
        }
      },
      data: props.value ?? {},
      checkEquals: true,
    });
  }
  //-----------------------------------------------------
  // 打开编辑器
  //-----------------------------------------------------
  async function openFilterEditor() {
    console.log("openFilterEditor");
    const result = _.cloneDeep(props.value ?? {});
    let modal = _.assign(
      {
        title: "i18n:edit",
        icon: "zmdi-graphic-eq",
        type: "primary",
        position: "left",
        width: "480px",
        height: "100%",
        clickMaskToClose: true,
        result,
        model: { data: "data", event: "change" },
        comType: props.detailComType || "TiForm",
        comConf: _.defaults(props.detailComConf || {}, {
          changeMode: "all",
        } as FormProps),
      } as AppModalProps,
      props.panel
    );
    let newVal = await openAppModal(modal);

    // 融合新值
    let newData = { ...(props.value ?? {}), ...newVal };

    // 通知改动
    tryNotifyChange(newData);
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    // 常驻字段
    MajorFields,
    hasMajorFields,
    // 操作菜单
    ActionBarConfig,
    // 响应事件
    onActionFire,
    onTagsChange,
    onMajorFieldChange,
    // 打开编辑器
    openFilterEditor,
  };
}
