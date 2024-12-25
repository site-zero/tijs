import _ from 'lodash';
import { ListProps } from '../../view/list/ti-list-types';
import { computed, Ref } from 'vue';
import { Vars } from '../../../_type';
import { InputBoxProps } from './ti-input-box-types';

export type TipListSetup = {
  _options_data: Ref<Vars[] | undefined>;
};

export function useTipList(props: InputBoxProps) {
  /**
   * 提示列表的配置信息
   */
  const TipListConfig = computed(() => {
    let re: ListProps = _.assign(
      {
        size: props.boxFontSize,
        canSelect: true,
        canHover: true,
        allowUserSelect: false,
        borderStyle: 'solid',
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
      re.textFormat = {
        T: `<em>\${text}</em>`,
        VT: `<code>\${value}:</code><em>\${text}</em>`,
        TV: `<em>\${text}</em><code>:\${value}</code>`,
        TT: `<em>\${text}</em><abbr>\${tip}</abbr>`,
        VTT: `<code>\${value}:</code><em>\${text}</em><abbr>\${tip}</abbr>`,
      }[props.tipFormat];
    }

    return re;
  });

  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return {
    TipListConfig,
  };
}
