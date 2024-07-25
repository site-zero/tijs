import _ from "lodash";
import { CssUtils, I18n } from "../../../core";
import { TabDisplayItem } from "../../../lib";
import { TabsProps } from "./ti-tabs-types";

export function useTabsItem(props:TabsProps){
    let items = [] as TabDisplayItem[];
    _.forEach(props.options, (it, index) => {
      let item = {
        className: CssUtils.mergeClassName({}, it.className),
        style: CssUtils.mergeStyles(it.style ?? {}, {
          caseMode: 'kebab',
        }),
        current: false,
        index,
        icon: it.icon,
        value: it.value ?? index,
      } as TabDisplayItem;

      if (it.text) {
        item.text = I18n.text(it.text);
      }

      if (props.tabMaxWidth && !item.style!['max-width']) {
        item.style!['max-width'] = CssUtils.toSize(props.tabMaxWidth);
      }

      if (item.style!['max-width']) {
        item.className['wrap-content'] = true;
      }

      if (_.isEqual(item.value, props.value)) {
        item.current = true;
        item.className['is-current'] = true;
      }

      items.push(item);
    });
    return items;
}