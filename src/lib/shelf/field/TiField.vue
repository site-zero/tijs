<script lang="ts" setup>
import { computed, onUnmounted, provide } from "vue";
import { BUS_KEY, FieldPair, TiAppEvent, TiEvent, useBusEmit } from "../../";
import { createBus } from "../../../core";
import { TiFieldInfo } from "./ti-field-index";
import { COM_TYPE, FieldEvents, FieldProps, useField } from "./use-field";

/*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
defineOptions({
  name: COM_TYPE,
  inheritAttrs: false,
  nameWidth: 0
});
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
let props = withDefaults(defineProps<FieldProps>(), {
  autoValue: "value",
  checkEquals: true
});
/*-------------------------------------------------------

                    Bus & Notify & Emit

-------------------------------------------------------*/
let emit = defineEmits<{
  (event: FieldEvents, payload: TiEvent<FieldPair>): void;
}>();
// 搞一个不使用 bus 直接使用 emit 的 notify 函数
let notify = useBusEmit(TiFieldInfo, props, emit);
//
// 适配消息总线
//
let field_bus = createBus<TiAppEvent>("TiField");
provide(BUS_KEY, field_bus);
/*-------------------------------------------------------

                      Features

-------------------------------------------------------*/
const Fld = computed(() => useField(props, { notify }));
const hasTitle = computed(() => (Fld.value.FieldTitle ? true : false));
/*-------------------------------------------------------

                   适配全局消息总线

-------------------------------------------------------*/
// field_bus.on("*", (k, v) => {
//   console.log("field_bus", k, v)
// })
field_bus.on("change", (msg) => {
  Fld.value.OnFieldChange(msg.data.payload);
});
/*-------------------------------------------------------

                  Life Hooks

-------------------------------------------------------*/
onUnmounted(() => {
  field_bus.depose()
})
</script>

<template>
  <div class="ti-field-name" :style="Fld.FieldNameStyle" v-if="hasTitle">
    <div class="field-name-con">
      <span>{{ Fld.FieldTitle }}</span>
    </div>
  </div>
  <div class="ti-field-value">
    <div class="field-value-com">
      <component :is="Fld.FieldComType" v-bind="Fld.FieldComConf" />
    </div>
    <div class="field-value-tip" v-if="Fld.hasTip">{{ tip }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import "./ti-field.scss";
</style>