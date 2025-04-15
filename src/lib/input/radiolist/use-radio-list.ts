import { computed, ref } from 'vue';
import { StdOptionItem } from '../../../_type';
import { ListProps, useOptions, useStdListItem } from '../../../lib';
import { RadioListProps } from './ti-radio-list-types';

export function useRadioList(props: RadioListProps) {
  let { dict } = useOptions(props);
  let { toStdItems } = useStdListItem(props);
  let _options = ref<StdOptionItem[]>([]);

  async function reloadOptions() {
    let list = await dict?.getData();
    _options.value = toStdItems(list ?? []);
  }

  const ListConfig = computed((): ListProps => {
    return {
      emptyRoadblock: props.emptyRoadblock,

      // Aspect
      textFormat: props.textFormat,
      textAsHtml: props.textAsHtml,
      tipWidth: props.tipWidth,
      size: props.size,
      borderStyle: props.borderStyle,
      highlightChecked: props.highlightChecked,
      canHover: props.canHover,
      allowUserSelect: props.allowUserSelect,
      autoI18n: props.autoI18n,

      // Std List
      getIcon: props.getIcon,
      getText: props.getText,
      getTip: props.getTip,
      getId: props.getValue,
    };
  });

  return {
    optionsData: _options,
    reloadOptions,
    ListConfig,
  };
}
