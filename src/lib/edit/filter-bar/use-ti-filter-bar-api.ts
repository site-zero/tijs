import { computed } from "vue";
import { FilterBarProps, FilterBarEmitter } from "./ti-filter-bar-types";
import { ActionBarProps } from "src/lib/action/all-actions";
import _ from "lodash";
import { dft_flt_bar_action_items } from "./support/dft-flt-bar-actions";

export type FilterBarApi = ReturnType<typeof useTiFilterBarApi>;

export function useTiFilterBarApi(
  props: FilterBarProps,
  _emit: FilterBarEmitter
) {
  //-----------------------------------------------------
  // 操作菜单
  //-----------------------------------------------------
  const { actions } = props;
  const ActionBarConfig = computed((): ActionBarProps | undefined => {
    let re = _.cloneDeep(actions) ?? {};
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
  // 返回接口
  //-----------------------------------------------------
  return {
    ActionBarConfig,
  };
}
