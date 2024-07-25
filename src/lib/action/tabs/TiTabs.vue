<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onUnmounted, reactive, ref, watch } from 'vue';
  import { TabDisplayItem, TiIcon } from '../../';
  import { CssUtils } from '../../../core';
  import { TabsEmitter, TabsProps } from './ti-tabs-types';
  import { useTabsItem } from './use-tabs-item';
  import { TabsOverflow, useTabsOverflowObserver } from './use-tabs-overflow';
  //-------------------------------------------------------
  const emit = defineEmits<TabsEmitter>();
  //-------------------------------------------------------
  const props = withDefaults(defineProps<TabsProps>(), {
    wrapTabs: false,
    tabItemSpace: 'm',
    tabsAt: 'top',
    tabsAlign: 'center',
  });
  //-------------------------------------------------------
  const $ul = ref<HTMLElement>();
  const _overflow = reactive({
    left: false,
    right: false,
  } as TabsOverflow);
  //-------------------------------------------------------
  const TabItems = computed(() => useTabsItem(props));
  //-------------------------------------------------------
  const TabOverflow = useTabsOverflowObserver({
    ul: $ul,
    overflow: _overflow,
  });
  //-------------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      {
        'wrap-tabs': props.wrapTabs,
      },
      `tabs-at-${props.tabsAt}`,
      `tabs-align-${props.tabsAlign}`,
      `tab-item-space-${props.tabItemSpace}`
    )
  );
  //-------------------------------------------------------
  function onClickItem(it: TabDisplayItem) {
    let old = _.cloneDeep(_.find(TabItems.value, (it) => it.current));
    let current = _.cloneDeep(it);
    emit('change', current, old);
  }
  //-------------------------------------------------------
  watch(
    () => TabItems.value,
    () => {
      TabOverflow.reWatch();
    }
    //{ immediate: true }
  );
  //-------------------------------------------------------
  onUnmounted(() => {
    TabOverflow.depose();
  });
  //-------------------------------------------------------
</script>
<template>
  <div
    class="ti-tabs"
    :class="TopClass">
    <ul ref="$ul">
      <li
        v-for="it in TabItems"
        :class="it.className"
        :style="it.style"
        @click="onClickItem(it)">
        <span
          class="as-icon"
          v-if="it.icon"
          ><TiIcon :value="it.icon"
        /></span>
        <span
          class="as-text"
          v-if="it.text"
          >{{ it.text }}</span
        >
      </li>
    </ul>
    <div class="scroller-con">
      <a>{</a>
      <a>}</a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-tabs.scss';
</style>
