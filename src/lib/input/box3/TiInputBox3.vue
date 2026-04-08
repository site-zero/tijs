<script lang="ts" setup>
  import { computed, useTemplateRef } from "vue";
  import { useBoxComposition } from "./_fea";
  import { try_update_by_input } from "./support";
  import { InputBox3Emitter, InputBox3Props } from "./ti-input-box3-types";
  import { useTiInputBox3Api } from "./use-ti-input-box3-api";
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $input = useTemplateRef<HTMLInputElement>("input");
  //-----------------------------------------------------
  const emit = defineEmits<InputBox3Emitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputBox3Props>(), {
    canInput: true,
    value: "",
    autoI18n: true,
    tipShowTime: "focus",
    tipShowDelay: 500,
    tipUseHint: false,
    trimed: true,
    autoSelect: true,
    // boxFontSize: "m",
    // boxPadding: "m",
    // boxRadius: "s",
  });
  //-----------------------------------------------------
  const api = useTiInputBox3Api(props, {
    emit,
    getTopElement: () => $el.value,
    getInputElement: () => $input.value,
  });
  //-----------------------------------------------------
  const Compose = computed(() => {
    return useBoxComposition(props, {
      isReadonly: () => api.isInputReadonly.value,
      onChange: (val: string) => {
        try_update_by_input(api, val);
      },
    });
  });
  //-----------------------------------------------------
  const Aspect = computed(() => api.Aspect.value);
  const Prefix = computed(() => api.PreSuffix.value.getBoxPrefix());
  const Suffix = computed(() => api.PreSuffix.value.getBoxSuffix());
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input-box3"
    :class="Aspect.TopClass.value"
    :style="Aspect.TopStyle.value">
    <!--=============| MAIN PART |==================-->
    <div
      ref="el"
      class="part-main"
      :class="Aspect.PartMainClass.value"
      :style="Aspect.PartMainStyle.value">
      <!----------|> MAIN PART: HEAD |---------->
      <slot name="head"> </slot>
      <!----------|> MAIN PART: BODY |---------->
      <div class="main-body" :style="Aspect.MainBodyStyle.value">
        <!--|> MAIN PART: BODY > prefix icon |-->
        <div
          v-if="Prefix.hasIcon.value"
          class="icon-part at-prefix"
          :class="Prefix.IconPartClass.value"
          v-html="Prefix.IconPartHtml.value"
          @click.left.stop="Prefix.onClick"></div>
        <!--|> MAIN PART: BODY > raw input |-->
        <input
          ref="input"
          :style="Aspect.InputStyle.value"
          :placeholder="api.Placeholder.value"
          :value="api.DisplayText.value"
          :readonly="api.isInputReadonly.value"
          spellcheck="false"
          __@keydown="onKeyDown"
          @keyup="Compose.onKeyUp"
          @compositionstart="Compose.onStart"
          @compositionend="Compose.onEnd"
          __@focus.stop="onInputFocused"
          __@blur.stop="onInputBlur"
          __@dblclick.stop />
        <!--|> MAIN PART: BODY > suffix icon |-->
        <div
          v-if="Suffix.hasIcon.value"
          class="icon-part at-suffix"
          :class="Suffix.IconPartClass.value"
          v-html="Suffix.IconPartHtml.value"
          @click.left.stop="Suffix.onClick"></div>
      </div>
      <!----------|> MAIN PART: TAIL |---------->
      <slot name="tail"> </slot>
    </div>
    <!--=========| TIP OPTIONS PART |============-->
  </div>
</template>
<style lang="scss">
  @use "./ti-input-box3.scss";
</style>
