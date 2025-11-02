import _ from "lodash";
import { TableRowID, Vars } from "../../../_type";
import { useStdListItem } from "../../_features";
import { CrumbEmitter, CrumbProps } from "./ti-crumb-types";

export type TiCrumbApi = ReturnType<typeof useTiCrumbApi>;

export function useTiCrumbApi(props: CrumbProps, emit: CrumbEmitter) {
  //-----------------------------------------------------
  // 归一化获取项 ID 的方法
  //-----------------------------------------------------
  let _get_id: (it: Vars) => TableRowID;
  if (props.getValue) {
    // 用户指定了键
    if (_.isString(props.getValue)) {
      let k = props.getValue;
      _get_id = (it: Vars) => _.get(it, k);
    }
    // 用户指定了 getter
    else {
      let getter = props.getValue;
      _get_id = (it: Vars) => getter(it);
    }
  }
  //-----------------------------------------------------
  const { toStdItem } = useStdListItem({
    ...props,
    getValue: (it: Vars, _index: number) => {
      return _get_id(it);
    },
  });
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {};
}
