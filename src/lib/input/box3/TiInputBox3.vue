<script lang="ts" setup>
  import { Be, TiList, useBoxDropList, Vars } from "@site0/tijs";
  import { computed, onMounted, useTemplateRef, watch } from "vue";
  import {
    Box3IconHandler,
    BoxIconEmit,
    feaBoxAspect,
    useBoxPrefixSuffix,
  } from "./_fea";
  import {
    create_box_composition,
    on_click_top,
    try_blur,
    try_clear_value,
    try_click_mask,
    try_focus,
    try_select_option_item,
    try_show_options,
    try_submit_change,
    try_update_by_props,
  } from "./support";
  import { InputBox3Emitter, InputBoxProps } from "./ti-input-box3-types";
  import { useTiInputBox3Api } from "./use-ti-input-box3-api";
  //-----------------------------------------------------
  defineOptions({ inheritAttrs: false });
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $input = useTemplateRef<HTMLInputElement>("input");
  const $tipcon = useTemplateRef<HTMLElement>("tipcon");
  //-----------------------------------------------------
  const emit = defineEmits<InputBox3Emitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputBoxProps>(), {
    canInput: true,
    value: "",
    autoI18n: true,
    tipShowTime: "focus",
    tipShowDelay: 500,
    tipUseHint: false,
    trimed: true,
    // autoSelect: true,
    // autoFocus: true,
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
  const Compose = computed(() => create_box_composition(props, api));
  //-----------------------------------------------------
  const PreSuffix = computed(() =>
    useBoxPrefixSuffix(props, {
      getBoxIcon: () => api.CurrentItem.value?.icon,
      getBoxValue: () => api.CurrentItem.value ?? props.value,
      toOptionItem: (it: Vars) => api.toOptionItem(it)!,
      isReadonly: () => api.isReadonly.value,
      onInvoke: (hdl: Box3IconHandler) => {
        hdl(api);
      },
      onEmit: (clickEmit: BoxIconEmit) => {
        emit(clickEmit);
      },
      onClear: () => {
        try_clear_value(api);
      },
      onCopy: () => {
        Be.Clipboard.write(props.value);
        Be.BlinkIt($el.value);
      },
      onLoadOptions: () => {
        try_show_options(api);
      },
    })
  );
  const Prefix = computed(() => PreSuffix.value.getBoxPrefix());
  const Suffix = computed(() => PreSuffix.value.getBoxSuffix());
  //-----------------------------------------------------
  const Aspect = computed(() =>
    feaBoxAspect(props, {
      getElement: () => $el.value,
      getDockingElement: () => $tipcon.value,
      isFocused: () => api.isFocused.value,
      isTipBoxReady: () => false,
      isReadonly: () => api.isReadonly.value,
    })
  );
  //-----------------------------------------------------
  const BoxDropList = computed(() =>
    useBoxDropList(props, {
      getTipContainer: () => $tipcon.value,
    })
  );
  //-----------------------------------------------------
  watch(
    () => [props.value, props.options],
    async () => {
      await try_update_by_props(api);
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  onMounted(() => {
    if (props.autoFocus) {
      api.setFocused(true);
    }
  });
  //-----------------------------------------------------
  defineExpose(api);
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input-box3"
    :class="Aspect.TopClass.value"
    :style="Aspect.TopStyle.value">
    <!--div style="font-size: 9px; padding: 0; margin: 0">
      <span>val: "{{ props.value }}"</span>
      <span>cit: "{{ api.CurrentItemValue }}"</span>
      <span>hin: "{{ api.LastHint }}"</span>
      <span>dis: "{{ api.DisplayText }}"</span>
    </div-->
    <!--=============| MAIN PART |==================-->
    <div
      ref="el"
      class="part-main"
      :class="Aspect.PartMainClass.value"
      :style="Aspect.PartMainStyle.value"
      @click.stop="on_click_top(api, props)">
      <!----------|> MAIN PART: HEAD |---------->
      <slot name="head"></slot>
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
          @change="try_submit_change(api)"
          @keyup="Compose.onKeyUp"
          @keydown="Compose.onKeyDown"
          @beforeinput="Compose.onBeforeInput"
          @compositionstart="Compose.onStart"
          @compositionend="Compose.onEnd"
          @focus.stop="try_focus(api, props)"
          @blur.stop="try_blur(api)"
          @dblclick.stop />
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
    <template v-if="api.isOptionsDataShow.value">
      <!--
      占位支撑框。 当展开选项时，主体框会浮动到最顶层
      这就需要一个占位框来保证页面布局不会变化
      -->
      <div class="part-brace" :style="Aspect.BoxBraceStyle.value">
        <!--纯占位而已，似乎不需要内容-->
      </div>
      <!--遮罩层：展开选项后，会用这个来捕获全局 click-->
      <div class="part-mask" @click.left.stop="try_click_mask(api)"></div>
      <!--选项层：展开的选项存放的地方-->
      <div class="part-options" :style="Aspect.BoxTipWrapperStyle.value">
        <div class="part-options-con" ref="tipcon">
          <TiList
            v-bind="BoxDropList.value"
            :currentId="api.CurrentItemValue.value"
            :data="api.FilteredOptionsData.value"
            @select="try_select_option_item(api, $event)" />
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss">
  @use "./ti-input-box3.scss";
</style>
