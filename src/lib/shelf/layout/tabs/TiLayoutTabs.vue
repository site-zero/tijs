<script lang="ts" setup>
  import { inject, reactive } from 'vue';
  import { BUS_KEY, LayoutState, TiAppEvent, useBusEmit } from '../../../';
  import { TiLayoutTabsInfo } from './ti-layout-tabs-index';
  import {
    COM_TYPE,
    LayoutTabsEvents,
    LayoutTabsProps,
    useLayoutTabs,
  } from './use-layout-tabs';
  /*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
  defineOptions({
    name: COM_TYPE,
    inheritAttrs: true,
  });
  /*-------------------------------------------------------

                        State

-------------------------------------------------------*/
  const state = reactive({
    shown: {},
  }) as LayoutState;
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  const props = withDefaults(defineProps<LayoutTabsProps>(), {
    tabAt: 'top',
    tabAlign: 'center',
    defaultTab: 0,
  });
</script>
<template>tabs</template>
<style lang="scss" scoped>
  @import './ti-layout-tabs.scss';
</style>
