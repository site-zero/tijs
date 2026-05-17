import { StrOptionItem, TiEditPairsProps } from "@site0/tijs";
import _ from "lodash";
import { EditPairsApi } from "../use-edit-pairs-api";

export function get_tab_items(props: TiEditPairsProps, api: EditPairsApi) {
  let re = [] as StrOptionItem[];
  // 指定的分组
  if (props.groups) {
    re.push(...props.groups);
    if (props.otherGroup) {
      re.push(props.otherGroup);
    }
  }
  // 动态分组
  else if (api.ValueMode.value == "nested") {
    const titles = props.titles || {};
    const icons = props.icons || {};
    const tips = props.tips || {};
    for (let key of _.keys(api.ValueObj.value)) {
      const text = titles[key] || key;
      const icon = icons[key];
      const tip = tips[key];
      re.push({ text, value: key, icon, tip });
    }
  }
  // simple 对象，且没有指定分组方式，且还要按照 TabForm 显示
  // 这个场景，通常是调用者脑壳被挤了一下导致的，凑合显示一下，
  // 他看到结果自然就会认识到自己是犯了一个错误
  // 不管怎么样，就用 Others 来收集所有的字段吧
  else {
    re.push(api.OtherGroup.value);
  }

  return re;
}
