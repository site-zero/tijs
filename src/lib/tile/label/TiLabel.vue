<script setup lang="ts">
  import { computed, reactive, useTemplateRef, watch } from 'vue';
  import { useDict, usePlaceholder, useValuePipe } from '../../';
  import { CssUtils } from '../../../core';
  import { LabelEmitter, LabelProps, LabelState } from './ti-label-types';
  import { useLabel } from './use-label';
  import { useLabelIcon } from './use-label-icon';
  //-----------------------------------------------------
  defineOptions({ inheritAttrs: true });
  //-----------------------------------------------------
  let emit = defineEmits<LabelEmitter>();
  //-----------------------------------------------------
  let props = withDefaults(defineProps<LabelProps>(), {
    autoI18n: true,
    nowrap: true,
  });
  //-----------------------------------------------------
  const $el = useTemplateRef('el');
  const _state = reactive<LabelState>({});

  const _pipe = computed(() => useValuePipe(props));
  const _dict = computed(() => useDict(props));
  //-----------------------------------------------------
  const _api = computed(() =>
    useLabel(props, {
      _state,
      _pipe: _pipe.value,
      _dict: _dict.value,
      emit,
      getElement: () => $el.value!,
    })
  );
  //-----------------------------------------------------
  const _prefix = computed(() =>
    useLabelIcon({
      _api: _api.value,
      icon: props.prefixIcon,
      hoverIcon: props.prefixHoverIcon,
      iconFor: props.prefixIconFor,
      emit,
    })
  );
  //-----------------------------------------------------
  const _suffix = computed(() =>
    useLabelIcon({
      _api: _api.value,
      icon: props.suffixIcon,
      hoverIcon: props.suffixHoverIcon,
      iconFor: props.suffixIconFor,
      emit,
    })
  );
  //-----------------------------------------------------
  const hasValue = computed(() => {
    return _state.text ? true : false;
  });
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      {
        'has-value': hasValue.value,
        'nil-value': !hasValue.value,
        'is-clickable': props.clickable,
        'is-nowrap': props.nowrap,
        'is-disable': props.disable,
      },
      () => {
        if (props.type) {
          return `is-${props.type}`;
        }
      }
    )
  );
  //-----------------------------------------------------
  const TextStyle = computed(() => {
    return {
      textAlign: props.textAlign,
    };
  });
  //-----------------------------------------------------
  const LabelText = computed(() => {
    return _state.text || usePlaceholder(props);
  });
  //-----------------------------------------------------
  // 看看是否满足选项列表的打开条件
  watch(
    () => [props.value],
    async () => {
      await _api.value.updateDisplay();
    },
    { immediate: true }
  );
</script>

<template>
  <div
    class="ti-label prefix-suffix-box"
    :class="TopClass"
    ref="el">
    <!--====================================-->
    <div
      v-if="_prefix.hasIcon.value"
      class="icon-part at-prefix"
      :class="_prefix.IconPartClass.value"
      v-html="_prefix.IconPartHtml.value"
      @click.left.stop="_prefix.onClick"></div>
    <!--====================================-->
    <div
      class="part-value"
      :style="TextStyle">
      {{ LabelText }}
    </div>
    <!--====================================-->
    <div
      v-if="_suffix.hasIcon.value"
      class="icon-part at-suffix"
      :class="_suffix.IconPartClass.value"
      v-html="_suffix.IconPartHtml.value"
      @click.left.stop="_suffix.onClick"></div>
    <!--====================================-->
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-label.scss';
</style>
