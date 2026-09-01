<script lang="ts" setup>
  import { TiActionBar } from "@site0/tijs";
  import { computed, useTemplateRef } from "vue";
  import { CssUtils } from "../../../core";
  import { gen_text_action_bar_config } from "./support";
  import { useInputTextApi } from "./ti-input-text-api";
  import { InputTextEmitter, InputTextProps } from "./ti-input-text-types";
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLDivElement>("el");
  const $text = useTemplateRef<HTMLTextAreaElement>("text");
  //-----------------------------------------------------
  const emit = defineEmits<InputTextEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputTextProps>(), {
    actionBarPosition: "top",
  });
  //-----------------------------------------------------
  const api = useInputTextApi(props, {
    getElement: () => $el.value,
    getTextElement: () => $text.value,
    emit,
  });
  //-----------------------------------------------------
  const TextValue = computed(() => api.getTextValue());
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(
      props.className,
      {
        "has-value": api.hasValue.value,
        "nil-value": !api.hasValue.value,
        "is-focused": api.isFocused.value,
        "no-focused": !api.isFocused.value,
        "show-border": !props.hideBorder,
        "hide-border": props.hideBorder,
      },
      {
        [`bar-at-${props.actionBarPosition}`]: props.actionBar ? true : false,
      }
    );
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.mergeStyles([{}, props.style]);
  });
  //-----------------------------------------------------
  const InputStyle = computed(() => {
    return CssUtils.mergeStyles([
      {},
      props.inputStyle,
      {
        width: CssUtils.toSize(props.width),
        height: CssUtils.toSize(props.height),
      },
    ]);
  });
  //-----------------------------------------------------
  const ActionBarConfig = computed(() => {
    return gen_text_action_bar_config(props, api);
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-text" :class="TopClass" :style="TopStyle" ref="el">
    <textarea
      ref="text"
      class="ti-input-text"
      :style="InputStyle"
      spellcheck="false"
      :readonly="api.isReadonly.value"
      :placeholder="api.Placeholder.value"
      :value="TextValue"
      @change="api.onTextChange"
      @focus="api.setFocus(true)"
      @blur="api.setFocus(false)"></textarea>
    <div class="part-actions" v-if="ActionBarConfig">
      <TiActionBar v-bind="ActionBarConfig" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-text.scss";
</style>
