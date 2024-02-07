<script lang="ts" setup>
import { inject, reactive } from "vue";
import { BUS_KEY, TiAppEvent, useBusEmit } from "../../../";
import { LayoutState } from "../layout-support.ts";
import { TiLayoutTabsInfo } from "./ti-layout-tabs-index";
import { COM_TYPE, LayoutTabsEvents, LayoutTabsProps, useLayoutTabs } from "./use-layout-tabs";
/*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
defineOptions({
  name: COM_TYPE,
  inheritAttrs: true
});
/*-------------------------------------------------------

                        State

-------------------------------------------------------*/
const state = reactive({
  shown: {}
}) as LayoutState;
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
const props = withDefaults(defineProps<LayoutTabsProps>(), {
  tabAt: "top",
  tabAlign: "center",
  defaultTab: 0
});

/*-------------------------------------------------------

                  Bus & Notify & Emit

-------------------------------------------------------*/
let outer_bus = inject(BUS_KEY);
let emit = defineEmits<{
  (event: LayoutTabsEvents, payload: TiAppEvent): void;
}>();
// 准备通知函数
let notify = useBusEmit(TiLayoutTabsInfo, props, emit, outer_bus);
/*-------------------------------------------------------

                    Use features

-------------------------------------------------------*/
let Grid = useLayoutTabs(state, props, { notify });
</script>
<template>
  tabs
</template>
<style lang="scss" scoped>
@import "./ti-layout-tabs.scss";
</style>