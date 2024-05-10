<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, reactive } from 'vue';
  import { TiIcon, TiRoadblock } from '../../';
  import { CssUtils } from '../../../core';
  import { ListProps } from './ti-list-types';
  import { useList } from './use-list';

  const props = withDefaults(defineProps<ListProps>(), {
    data: () => [],
    size: 'm',
    selectable: true,
    hoverable: true,
  });

  const List = computed(() => useList(props));
  const selection = reactive(List.value.selectable.createSelection());
  const roadblock = computed(() => List.value.getRoadblock());
  const Items = computed(() => List.value.buildOptionItems(selection));
  const NotItems = computed(() => _.isEmpty(Items.value));
  const isItemsHasIcon = computed(() => List.value.itemsHasIcon(Items.value));
  const isItemsHasTip = computed(() => List.value.itemsHasTip(Items.value));
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      {
        'is-hoverable': props.hoverable,
        'is-selectable': props.selectable,
      },
      `size-${props.size ?? 'm'}`
    )
  );
  const ListItemStyle = computed(() => {
    let cols = [];
    if (props.multi) {
      cols.push('2em');
    }
    if (isItemsHasIcon.value) {
      cols.push('2em');
    }
    cols.push('1fr');
    if (isItemsHasTip.value) {
      cols.push(props.tipWidth ?? '1fr');
    }
    return {
      'grid-template-columns': cols.join(' '),
    };
  });
</script>
<template>
  <div
    class="ti-list"
    :class="TopClass">
    <!--------------Empty Items------------------>
    <TiRoadblock
      v-if="NotItems"
      v-bind="roadblock" />
    <!---------------Show List------------------->
    <template v-else>
      <div
        v-for="it in Items"
        class="list-item"
        :style="ListItemStyle">
        <!--***********************************-->
        <!--=Check=-->
        <div
          v-if="props.multi"
          class="list-part as-check">
          <i
            v-if="it.checked"
            class="zmdi zmdi-check-square"></i>
          <i
            v-else
            class="zmdi zmdi-square-o"></i>
        </div>
        <!--=Icon=-->
        <div
          v-if="isItemsHasIcon"
          class="list-part as-icon">
          <TiIcon
            v-if="it.icon"
            :value="it.icon" />
        </div>
        <!--=Text=-->
        <div class="list-part as-text">
          <div>{{ it.text }}</div>
        </div>
        <!--=Tip=-->
        <div
          v-if="isItemsHasTip"
          class="list-part as-tip">
          <div v-if="it.tip">{{ it.tip }}</div>
        </div>
        <!--=Endl-->
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-list.scss';
</style>
