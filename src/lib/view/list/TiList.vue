<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, reactive, watch } from 'vue';
  import { SelectableState, TiIcon, TiRoadblock } from '../../';
  import { TableRowID } from '../../../_type';
  import { CssUtils } from '../../../core';
  import { ListEmitter, ListItem, ListProps } from './ti-list-types';
  import { useList } from './use-list';
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ListProps>(), {
    data: () => [],
    size: 'm',
    canSelect: true,
    canHover: true,
    allowUserSelect: false,
    autoI18n: true,
    textAsHtml: true,
    highlightChecked: true,
  });
  //-----------------------------------------------------
  const emit = defineEmits<ListEmitter>();
  //-----------------------------------------------------
  const selection = reactive({
    currentId: undefined,
    checkedIds: new Map<TableRowID, boolean>(),
    ids: [],
    lastSelectIndex: -1,
  } as SelectableState<TableRowID>);
  //-----------------------------------------------------
  const List = computed(() => useList(props, emit));
  //-----------------------------------------------------
  const roadblock = computed(() => List.value.getRoadblock());
  const Items = computed(() => List.value.buildOptionItems(selection));
  const NotItems = computed(() => _.isEmpty(Items.value));
  const isItemsHasIcon = computed(() => List.value.itemsHasIcon(Items.value));
  //-----------------------------------------------------
  const TopClass = computed(() => {
    let names: string[] = [];
    if (props.borderStyle) {
      names.push(`border-${props.borderStyle}`);
    }
    return CssUtils.mergeClassName(
      props.className,
      {
        'is-hoverable': props.canHover,
        'is-selectable': props.canSelect || props.canCheck,
        'is-highlight-checked': props.highlightChecked,
        'none-user-select': !props.allowUserSelect,
      },
      names
    );
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(
      CssUtils.mergeStyles(
        {
          'font-size': `var(--ti-fontsz-${props.size ?? 'm'})`,
        },
        props.style
      )
    );
  });
  //-----------------------------------------------------
  const MarkerIcons = computed(() => List.value.getMarkerIcons());
  //-----------------------------------------------------
  const ListItemStyle = computed(() => {
    let cols = [];
    if (MarkerIcons.value) {
      cols.push('2em');
    }
    if (isItemsHasIcon.value) {
      cols.push('2em');
    }
    cols.push('1fr');
    return {
      'grid-template-columns': cols.join(' '),
    };
  });
  //-----------------------------------------------------
  function onListItemClick(item: ListItem, event: MouseEvent) {
    //console.log('onListItemClick', item);
    List.value.OnItemSelect(selection, { event, item });
  }
  //-----------------------------------------------------
  watch(
    () => [props.currentId, props.checkedIds],
    () => {
      List.value.updateSelection(
        selection,
        props.data ?? [],
        props.currentId,
        props.checkedIds
      );
    },
    {
      immediate: true,
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-list"
    :class="TopClass"
    :style="TopStyle">
    <slot name="head"></slot>
    <!--------------Empty Items------------------>
    <div
      class="empty-tip"
      v-if="NotItems">
      <TiRoadblock v-bind="roadblock" />
    </div>
    <!---------------Show List------------------->
    <main v-else>
      <div
        v-for="it in Items"
        class="list-item"
        :class="it.className"
        :style="ListItemStyle"
        @click="onListItemClick(it, $event)"
        @dblclick="emit('open', it)">
        <!--***********************************-->
        <!--=Check=-->
        <div
          v-if="MarkerIcons"
          class="list-part as-check"
          @click.stop="
            List.OnItemCheck(selection, { event: $event, item: it })
          ">
          <TiIcon
            v-if="it.checked"
            :value="MarkerIcons[1]" />
          <TiIcon
            v-else
            :value="MarkerIcons[0]" />
        </div>
        <!--=Icon=-->
        <div
          v-if="isItemsHasIcon"
          class="list-part as-icon">
          <TiIcon
            v-if="it.icon"
            :value="it.icon" />
        </div>
        <!--=Text: AS HTML=-->
        <div
          v-if="props.textAsHtml"
          class="list-part as-text"
          v-html="it.displayText"></div>
        <!--=Text: AS PureText=-->
        <div
          class="list-part as-text"
          v-else>
          {{ it.displayText }}
        </div>
        <!--=Tip=-->
        <!--
        我看，不需要这个部分了，用自定义 textFormat as HTML 会更加灵活
        div
          v-if="isItemsHasTip"
          class="list-part as-tip">
          <div v-if="it.tip">{{ it.tip }}</div>
        </div-->
        <!--=Endl-->
      </div>
    </main>
    <slot name="tail"></slot>
  </div>
</template>
<style lang="scss">
  @use './ti-list.scss';
</style>
