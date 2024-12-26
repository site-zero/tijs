<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
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
    tabsAlign: 'left',
  });
  //-------------------------------------------------------
  const $el = ref<HTMLElement>();
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
  /**
   * @param dir 方向: -1: 向左;  1: 向右
   */
  function onClickScroller(dir: number) {
    // 防守
    if (!$ul.value) return;
    let el = $ul.value;

    // 滚动距离为自己的宽度
    let W = el.getBoundingClientRect().width;
    let R = 0.8;

    //let old_left = el.scrollLeft;
    let left = el.scrollLeft + W * dir * R;
    el.scrollTo({ left });

    _.delay(() => {
      TabOverflow.updateOverflow();
      //console.log(`scrollFrom ${old_left} >> ${left} ==`, el.scrollLeft);
    }, 500);
  }
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
      TabOverflow.tryWatch();
      //TabOverflow.updateOverflow();
    },
    { immediate: true }
  );
  //-------------------------------------------------------
  onMounted(() => {
    TabOverflow.tryWatch();
  });
  //-------------------------------------------------------
  onUnmounted(() => {
    TabOverflow.depose();
  });
  //-------------------------------------------------------
</script>
<template>
  <div
    class="ti-tabs"
    :class="TopClass"
    ref="$el">
    <div
      class="tab-items-con"
      ref="$ul">
      <div class="items-wrapper">
        <div
          class="tab-item"
          v-for="(it, index) in TabItems"
          :class="it.className"
          :style="it.style"
          :data-index="index"
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
        </div>
      </div>
    </div>
    <div
      class="scroller-con"
      v-if="_overflow.left || _overflow.right">
      <a
        class="to-left"
        v-if="_overflow.left"
        @click="onClickScroller(-1)"
        ><i class="zmdi zmdi-caret-left"></i
      ></a>
      <div class="sep"></div>
      <a
        class="to-right"
        v-if="_overflow.right"
        @click="onClickScroller(1)"
        ><i class="zmdi zmdi-caret-right"></i
      ></a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-tabs.scss';
</style>
