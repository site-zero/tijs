<script lang="ts" setup>
  import { CssUtils, useBoxAspect } from "@site0/tijs";
  import _ from "lodash";
  import { computed, useTemplateRef } from "vue";
  import {
    InputPasswordEmitter,
    InputPasswordProps,
  } from "./ti-input-password-types";
  import { useTiInputPasswordApi } from "./use-ti-input-password-api";
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $input = useTemplateRef<HTMLInputElement>("input");
  //-----------------------------------------------------
  const emit = defineEmits<InputPasswordEmitter>();
  const props = withDefaults(defineProps<InputPasswordProps>(), {
    value: null,
    disabled: false,
    showIndicator: true,
    allowToggleVisible: true,
    autoSelect: true,
    weakSize: 8,
  });
  //-----------------------------------------------------
  const api = useTiInputPasswordApi(props, {
    emit,
    getInputElement: () => $input.value,
  });
  //-----------------------------------------------------
  const Value = computed(() => (_.isNil(props.value) ? "" : props.value));
  //-----------------------------------------------------
  const Aspect = computed(() =>
    useBoxAspect(props, {
      getElement: () => $el.value,
      getDockingElement: () => null,
      isFocused: () => api.isFocused.value,
      isTipBoxReady: () => false,
      isReadonly: () => api.isReadonly.value,
      autoFloatWhenTipReady: () => true,
    })
  );
  //-----------------------------------------------------
  const showToggle = computed(
    () => props.allowToggleVisible && !api.isReadonly.value
  );
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      Aspect.value.TopClass.value,
      Aspect.value.PartMainClass.value,
      {
        "is-readonly": api.isReadonly.value,
        "no-indicator": !props.showIndicator,
      }
    )
  );
  //-----------------------------------------------------
  const TopStyle = computed(() =>
    CssUtils.mergeStyles([
      Aspect.value.TopStyle.value,
      Aspect.value.PartMainStyle.value,
      {
        width: CssUtils.toSize(props.width),
      },
    ])
  );
  //-----------------------------------------------------
  const InputStyle = computed(() =>
    CssUtils.mergeStyles([{}, props.inputStyle, Aspect.value.InputStyle.value])
  );
  //-----------------------------------------------------
  const IndicatorClass = computed(() => {
    let lv = api.PasswdLevel.value;
    if (lv <= 0) return "level-empty";
    return `level-${lv}`;
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-password" :class="TopClass" :style="TopStyle" ref="el">
    <form class="part-box">
      <input
        ref="input"
        class="part-input"
        :type="api.InputType.value"
        :value="Value"
        :style="InputStyle"
        :placeholder="api.Placeholder.value"
        :readonly="api.isReadonly.value"
        :disabled="api.isReadonly.value"
        spellcheck="false"
        autocomplete="new-password"
        @focus="api.setFocused(true)"
        @blur="api.setFocused(false)"
        @input="api.onInput" />
      <button
        v-if="showToggle"
        class="part-toggle"
        type="button"
        tabindex="-1"
        @click="api.toggleVisible">
        <i
          :class="
            api.isRevealed.value ? 'zmdi zmdi-eye-off' : 'zmdi zmdi-eye'
          "></i>
      </button>
    </form>
    <div
      v-if="props.showIndicator"
      class="part-indicator"
      :class="IndicatorClass">
      <!--
      显示一个 1-5 级的密码强度指示器
      五个方块，如果3级，就前三个块高亮，后面两个是空的
      -->
      <span
        v-for="i in 5"
        :key="i"
        class="indicator-bar"
        :class="{ highlight: i <= api.PasswdLevel.value }">
        {{ api.getLevelText(i) }}
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-password.scss";
</style>
