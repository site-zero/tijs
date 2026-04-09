import { AnyOptionItem, ListItemTextFormat, ListProps } from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import {
  BoxDropItemFormat,
  BoxDropListProps,
  BoxDropListSetup,
} from "./types-box-drop-list";

export function useBoxDropList(
  props: BoxDropListProps,
  setup: BoxDropListSetup
) {
  const { getTipContainer } = setup;
  /**
   * 提示列表的配置信息
   */
  const ListConfig = computed(() => {
    let re: ListProps = _.assign(
      {
        size: props.boxFontSize,
        canSelect: true,
        canHover: true,
        allowUserSelect: false,
        borderStyle: "solid",
        autoScrollIntoView: true,
        scrollViewPort: () => getTipContainer(),
      } as ListProps,
      props.tipList
    );
    /**
     * 如果 options 的数据是采用原始的数据格式
     * 那么就需要列表自行判断 `icon/text/value/tip` 都是怎么获取
     * 因此这里需要将控件顶层的配置属性传递下去
     */
    if (props.optionKeepRaw) {
      re.getIcon = re.getIcon ?? props.getIcon;
      re.getText = re.getText ?? props.getText;
      re.getValue = re.getValue ?? props.getValue;
      re.getTip = re.getTip ?? props.getTip;
    }

    // 设置快速格式化
    if (!re.textFormat && props.tipFormat) {
      const tfmt_set: Record<BoxDropItemFormat, ListItemTextFormat> = {
        T: `<em>\${text}</em>`,
        VT: (it: AnyOptionItem): string => {
          if (_.isNil(it.value)) return `<em>${it.text}</em>`;
          return `<code>${it.value}:</code><em>${it.text}</em>`;
        },
        TV: (it: AnyOptionItem): string => {
          if (_.isNil(it.value)) return `<em>${it.text}</em>`;
          return `<em>${it.text}</em><code>:${it.value}</code>`;
        },
        TP: (it: AnyOptionItem): string => {
          return `<em>${it.text}</em><abbr>${it.tip}</abbr>`;
        },
        PT: (it: AnyOptionItem): string => {
          return `<code>${it.tip}</code><em>${it.text}</em>`;
        },
        VTP: (it: AnyOptionItem): string => {
          let ss = [];
          if (!_.isNil(it.value)) {
            ss.push(`<code>${it.value}:</code>`);
          }
          if (!_.isNil(it.text)) {
            ss.push(`<em>${it.text}</em>`);
          }
          if (!_.isNil(it.tip)) {
            ss.push(`<abbr>${it.tip}</abbr>`);
          }
          return ss.join("");
        },
        VpT: (it: AnyOptionItem): string => {
          let { value, text, tip } = it;
          if (tip) {
            return `<code>${value}:</code><code>${tip}</code><em>${text}</em>`;
          }
          return `<code>${value}:</code><em>${text}</em>`;
        },
      };
      re.textFormat = tfmt_set[props.tipFormat];
    }

    return re;
  });

  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return ListConfig;
}
