import _ from "lodash";
import { computed } from "vue";
import { AppModalProps, openAppModal, Vars } from "../../../";
import { ActionBarEvent, ActionBarProps } from "../../action/all-actions";
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
        comConf: props.detailComConf || {},
      } as AppModalProps,
      props.panel
    );
    let newVal = await openAppModal(modal);

    // 通知改动
    tryNotifyChange(newVal);
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
    // 打开编辑器
    openFilterEditor,
  };
}
