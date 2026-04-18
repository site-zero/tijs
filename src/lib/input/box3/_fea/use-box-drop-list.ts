import {
  AnyOptionItem,
  CssUtils,
  ListItemTextFormat,
  ListProps,
} from "@site0/tijs";
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
  const { getTipContainer, dftRowType } = setup;
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
        getRowType: dftRowType,
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

    type ItemKey = "tip" | "text" | "value";
    const _build_html = (
      it: AnyOptionItem,
      ks: ItemKey[],
      tagMapping: Record<ItemKey, string> = {
        text: "em",
        tip: "abbr",
        value: "code",
      }
    ): string => {
      let ss = [];
      for (let k of ks) {
        let tagName = tagMapping[k];
        let tagStyle = props.tipItemTagStyles?.[k];
        if (!tagName) continue;
        let v = it[k];
        if (!_.isNil(v)) {
          ss.push(`<${tagName}`);
          if (tagStyle && !_.isEmpty(tagStyle)) {
            ss.push(` style="${CssUtils.renderCssRule(tagStyle)}"`);
          }
          ss.push(">");
          ss.push(_.escape(v));
          ss.push(`</${tagName}>`);
        }
      }
      return ss.join("");
    };

    // 设置快速格式化
    if (!re.textFormat && props.tipFormat) {
      const tfmt_set: Record<BoxDropItemFormat, ListItemTextFormat> = {
        T: `<em>\${text}</em>`,
        VT: (it: AnyOptionItem): string => {
          return _build_html(it, ["value", "text"]);
        },
        TV: (it: AnyOptionItem): string => {
          return _build_html(it, ["text", "value"]);
        },
        TP: (it: AnyOptionItem): string => {
          return _build_html(it, ["text", "tip"]);
        },
        PT: (it: AnyOptionItem): string => {
          return _build_html(it, ["tip", "text"]);
        },
        VTP: (it: AnyOptionItem): string => {
          return _build_html(it, ["value", "text", "tip"]);
        },
        VpT: (it: AnyOptionItem): string => {
          return _build_html(it, ["value", "tip", "text"], {
            value: "code",
            text: "em",
            tip: "code",
          });
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
