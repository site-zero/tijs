<script setup lang="ts">
  import _ from 'lodash';
  import { computed, reactive, ref } from 'vue';
  import { TiIcon, ValueBoxEmits, tiGetDefaultComPropValue } from '../../';
  import { CssUtils } from '../../../core';
  import { COM_TYPE, LabelProps, LabelState, useLabel } from './use-label';

  defineOptions({
    name: COM_TYPE,
    inheritAttrs: true,
  });

  const state = reactive({
    boxVal: null,
    boxText: '',
    boxFocused: false,
    boxErrMsg: '',
    prefixIconHovered: false,
    prefixTextHovered: false,
    suffixIconHovered: false,
    suffixTextHovered: false,
  } as LabelState);

  let props = withDefaults(defineProps<LabelProps>(), {
    value: tiGetDefaultComPropValue(COM_TYPE, 'value'),
    autoI18n: true,
  });

  //-----------------------------------------------------
  let emit = defineEmits<ValueBoxEmits>();
  //-----------------------------------------------------
  const $el = ref<any>(null);
  const Box = computed(() =>
    useLabel(state, props, {
      emit,
      getBoxElement: () => $el.value,
    })
  );
  /*-------------------------------------------------------

                      Computed

-------------------------------------------------------*/
  const hasValue = computed(() => {
    return !_.isNil(state.boxVal);
  });

  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, () => ({
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
    }))
  );
  const LabelText = computed(() => {
    if (hasValue.value) {
      return state.boxText;
    }
    return Box.value.getPlaceholder();
  });
</script>

<template>
  <div
    class="ti-label prefix-suffix-box"
    :class="TopClass"
    ref="$el">
    <div
      v-if="Box.Prefix.show"
      class="part-prefix as-icon-text"
      :class="Box.Prefix.className"
      :style="Box.Prefix.style">
      <TiIcon
        v-if="Box.Prefix.showIcon && hasValue"
        class="as-icon at-prefix"
        :class="Box.Prefix.iconClass"
        :style="Box.Prefix.iconStyle"
        :value="Box.Prefix.icon"
        @click="Box.OnClickPrefixIcon"
        @mouseenter="Box.setPrefixIconHover(true)"
        @mouseleave="Box.setPrefixIconHover(false)" />
      <span
        v-if="Box.Prefix.showText"
        class="as-text at-prefix"
        :class="Box.Prefix.textClass"
        :style="Box.Prefix.textStyle"
        @click="Box.Prefix.OnClickText"
        @mouseenter="Box.setPrefixTextHover(true)"
        @mouseleave="Box.setPrefixTextHover(false)"
        >{{ Box.Prefix.text }}</span
      >
    </div>
    <div
      class="part-value"
      ref="abc">
      {{ LabelText }}
    </div>
    <div
      v-if="Box.Suffix.show"
      class="part-suffix as-icon-text"
      :class="Box.Suffix.className"
      :style="Box.Suffix.style">
      <span
        v-if="Box.Suffix.showText"
        class="as-text at-suffix"
        :class="Box.Suffix.textClass"
        :style="Box.Suffix.textStyle"
        @click="Box.Suffix.OnClickText"
        @mouseenter="Box.setSuffixTextHover(true)"
        @mouseleave="Box.setSuffixTextHover(false)"
        >{{ Box.Suffix.text }}</span
      >
      <TiIcon
        v-if="Box.Suffix.showIcon"
        :value="Box.Suffix.icon"
        class="as-icon at-suffix"
        :class="Box.Suffix.iconClass"
        :style="Box.Suffix.iconStyle"
        @click="Box.OnClickSuffixIcon"
        @mouseenter="Box.setSuffixIconHover(true)"
        @mouseleave="Box.setSuffixIconHover(false)" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-label.scss';
</style>
