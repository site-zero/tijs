<script lang="ts" setup>
import { computed, onUnmounted, provide } from "vue";
import { BUS_KEY, TiAppEvent, TiEvent, useBusEmit } from "../../";
import { createBus } from "../../../core";
import { TiCellInfo } from "./ti-cell-index";
import { COM_TYPE, CellChanged, CellEvents, CellProps, useField } from "./use-cell";
/*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
defineOptions({
  name: COM_TYPE,
  inheritAttrs: true
});
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
let props = withDefaults(defineProps<CellProps>(), {
  autoValue: "value",
  checkEquals: true,
  rowIndex: 0,
  colIndex: 0
});
/*-------------------------------------------------------

                    Bus & Notify & Emit

-------------------------------------------------------*/
let emit = defineEmits<{
  (event: CellEvents, payload: TiEvent<CellChanged>): void;
}>();
// 搞一个不使用 bus 直接使用 emit 的 notify 函数
let notify = useBusEmit(TiCellInfo, props, emit);
//
// 适配消息总线
//
let cell_bus = createBus<TiAppEvent>("TiCell");
provide(BUS_KEY, cell_bus);
/*-------------------------------------------------------

                      Features

-------------------------------------------------------*/
const Cell = computed(() => useField(props, { notify }));
/*-------------------------------------------------------

                   适配全局消息总线

-------------------------------------------------------*/
cell_bus.on("change", (msg) => {
  Cell.value.OnCellChange(msg.data.payload);
});
/*-------------------------------------------------------

                  Life Hooks

-------------------------------------------------------*/
onUnmounted(() => {
  cell_bus.depose()
})
</script>

<template>
  <div class="ti-cell">
    <div class="ti-cell-con">
      <component :is="Cell.CellComType" v-bind="Cell.CellComConf" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./ti-cell.scss";
</style>