<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, reactive, useTemplateRef, watch } from 'vue';
  import { SelectableState, TiIcon, TiRoadblock, useRowIndent } from '../../';
  import {
    CssSheet,
    ElementScrollIntoViewOptions,
    TableRowID,
  } from '../../../_type';
  import { Alg, CssUtils, Dom } from '../../../core';
  import {
    IndentlyItem,
    ListEmitter,
    ListItem,
    ListProps,
  } from './ti-list-types';
  import { useList } from './use-list';
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ListProps>(), {
    data: () => [],
    forceShowRowIconPart: 'auto',
    size: 'm',
    canSelect: true,
    canHover: true,
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
  const $main = useTemplateRef<HTMLElement>('main');
  const _list = computed(() => useList(props, selection, emit));
  //-----------------------------------------------------
  const roadblock = computed(() => _list.value.getRoadblock());
  const NotItems = computed(() => _.isEmpty(_list.value.Items.value));
  //-----------------------------------------------------
  const _indent = computed(() => useRowIndent(props));
  //-----------------------------------------------------
  const IndentlyItems = computed(() => {
    let re: IndentlyItem[] = [];
    for (let it of _list.value.Items.value) {
      re.push({
        ...it,
        ..._indent.value.getRowIndentation(it.value, it, it.icon),
      });
    }
    return re;
  });
  //-----------------------------------------------------
  const isAlwaysShowItemIcon = computed(() => {
    if ('yes' == props.forceShowRowIconPart) {
      return true;
    }
    if ('no' == props.forceShowRowIconPart) {
      return false;
    }
    // 那么就会是自动模式
    // 树模式下，就不强制显示
    if (props.rowIndents) {
      return false;
    }
    // 纯列表的话，只要有一个项目有图标就强制显示图标部分
    // 这样列表看起来会比较整齐
    return _list.value.itemsHasIcon(IndentlyItems.value);
  });
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
        'is-selectable': props.canSelect || props.showChecker,
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
  const TagScope = computed(() => Alg.genSnowQ(10));
  //-----------------------------------------------------
  const StyleSheetHTML = computed(() => {
    let scope = `.ti-list[data-ti-scope="${TagScope.value}"]`;
    if (props.styleSheet) {
      let ss: CssSheet[];
      if (_.isString(props.styleSheet)) {
        ss = CssUtils.parseCssStyleSheet(props.styleSheet);
      } else {
        ss = props.styleSheet as CssSheet[];
      }
      return [
        '<style>',
        CssUtils.renderCssStyleSheet(ss, scope),
        '</style>',
      ].join('\n');
    }
  });
  //-----------------------------------------------------
  const MarkerIcons = computed(() => _list.value.getMarkerIcons());
  //-----------------------------------------------------
  function onListItemClick(item: ListItem, event: MouseEvent) {
    //console.log('onListItemClick', item);
    _list.value.OnItemSelect({ event, item });
  }
  //-----------------------------------------------------
  function scrollIntoViewByIndex(
    index: number,
    options?: ElementScrollIntoViewOptions
  ) {
    // 防空
    if (!$main.value) {
      return;
    }
    // 找到对应的的元素
    let $item = Dom.find(
      `main>.list-item:nth-child(${index + 1})`,
      $main.value
    );
    console.log('scrollIntoViewByIndex', index, $item);
    if ($item && $item.parentElement) {
      let $main = $item.parentElement;
      Dom.scrollIntoView($main, $item, options);
    }
  }
  //-----------------------------------------------------
  watch(
    () => [props.currentId, props.checkedIds, props.data],
    () => {
      _list.value.updateSelection(
        selection,
        props.data ?? [],
        props.currentId,
        props.checkedIds
      );
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  defineExpose({
    scrollIntoViewByIndex,
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-list"
    :class="TopClass"
    :style="TopStyle"
    :data-ti-scope="TagScope">
    <div
      style="display: content"
      v-if="StyleSheetHTML"
      v-html="StyleSheetHTML"></div>
    <slot name="head"></slot>
    <!--------------Empty Items------------------>
    <div
      class="empty-tip"
      v-if="NotItems">
      <TiRoadblock v-bind="roadblock" />
    </div>
    <!---------------Show List------------------->
    <main
      v-else
      ref="main">
      <div
        v-for="it in IndentlyItems"
        class="list-item"
        :class="it.className"
        @click="onListItemClick(it, $event)"
        @dblclick="emit('open', it)">
        <!--***********************************-->
        <!--=Indent placeholder=-->
        <div
          class="list-part as-indents"
          v-if="it.indent > 0">
          <b v-for="_ii in it.indent"></b>
        </div>
        <!--=Indicator=-->
        <div
          v-if="it.indicator"
          class="list-part as-indicator for-node"
          v-html="it.indicator"
          @click.stop="
            emit('toggle:status', {
              id: it.id,
              currentStatus: it.rowStatus,
            })
          "></div>
        <div
          v-else-if="props.rowIndents"
          class="list-part as-indicator for-leaf"></div>
        <!--=Check Maker=-->
        <div
          v-if="MarkerIcons && it.canCheck"
          class="list-part as-check"
          @click.stop="_list.OnItemCheck({ event: $event, item: it })">
          <TiIcon
            v-if="it.checked"
            :value="MarkerIcons[1]" />
          <TiIcon
            v-else
            :value="MarkerIcons[0]" />
        </div>
        <!--=Icon=-->
        <div
          v-if="isAlwaysShowItemIcon || it.rowIcon"
          class="list-part as-icon">
          <TiIcon
            v-if="it.rowIcon"
            :value="it.rowIcon" />
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
