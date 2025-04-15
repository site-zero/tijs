import { computed, ref } from 'vue';
import { StdOptionItem } from '../../../_type';
import { ListProps, useOptions, useStdListItem } from '../../../lib';
import { CheckListProps } from './ti-check-list-types';

export function useChecklist(props: CheckListProps) {
  let _options = computed(() => useOptions(props));
  let _std_lis = computed(() => useStdListItem(props));
  let _options_data = ref<StdOptionItem[]>([]);

  async function reloadOptions() {
    let list = await _options.value.dict?.getData();
    _options_data.value = _std_lis.value.toStdItems(list ?? []);
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
    };
  });

  return {
    optionsData: _options_data,
    reloadOptions,
    ListConfig,
  };
}
