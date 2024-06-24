import { ActionBarItem } from '../../../_type';
import { FilterFeature, FilterProps } from './ti-filter-types';
import { FilterEmitter } from './use-filter';
import { openAdvanceForm } from './use-filter-advance';
import { useFilterCustomization } from './use-filter-customize';

export function useFilterActions(
  props: FilterProps,
  Flt: FilterFeature,
  emit: FilterEmitter
) {
  let items = [] as ActionBarItem[];

  if (props.searchIcon || props.searchText) {
    items.push({
      icon: props.searchIcon ?? undefined,
      text: props.searchText ?? undefined,
      action: 'search',
    });
  }

  let moreItems = [
    {
      icon: 'zmdi-time-restore',
      text: 'i18n:reset',
      action: 'reset',
    },
  ] as ActionBarItem[];

  if (props.canCustomizedMajor) {
    moreItems.push({
      icon: 'zmdi-toys',
      text: 'i18n:ti-filter-customize',
      action: () => {
        useFilterCustomization(props, emit);
      },
    });
  }

  if (Flt.isNeedAdvanceForm.value) {
    moreItems.push({
      icon: 'zmdi-traffic',
      text: 'i18n:ti-filter-advance',
      action: () => {
        openAdvanceForm(props, emit);
      },
    });
  }

  if (props.moreActions) {
    moreItems.push({}, ...props.moreActions);
  }

  if (props.actionCollapse) {
    items.push({
      //icon: 'fas-ellipsis',
      icon: 'zmdi-dialpad',
      text: 'i18n:more',
      items: moreItems,
    });
  } else {
    items.push(...moreItems);
  }

  return items;
}
