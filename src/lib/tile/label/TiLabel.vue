<script setup lang="ts">
  import { computed, reactive, useTemplateRef, watch } from 'vue';
  import { useDict, usePlaceholder, useValuePipe } from '../../';
  import { LabelEmitter, LabelProps, LabelState } from './ti-label-types';
  import { useLabel } from './use-label';
  import { useLabelAspect } from './use-label-aspect';
  import { useLabelIcon } from './use-label-icon';
  //-----------------------------------------------------
  defineOptions({ inheritAttrs: true });
  //-----------------------------------------------------
  let emit = defineEmits<LabelEmitter>();
  //-----------------------------------------------------
  let props = withDefaults(defineProps<LabelProps>(), {
    autoI18n: true,
    nowrap: true,
    boxRadius: 's',
    boxFontSize: 's',
    boxPadding: 's',
  });
  //-----------------------------------------------------
  const $el = useTemplateRef('el');
  const _state = reactive<LabelState>({});
  //-----------------------------------------------------
  const _pipe = computed(() => useValuePipe(props));
  const _dict = computed(() => useDict(props));
  //-----------------------------------------------------
  const _aspect = useLabelAspect(props);
  //-----------------------------------------------------
  const _api = useLabel(props, {
    _state,
    _pipe: _pipe.value,
    _dict: _dict.value,
    emit,
    getElement: () => $el.value!,
  });
  //-----------------------------------------------------
  const _prefix = computed(() =>
    useLabelIcon({
      _api: _api,
      href: _api.Href.value,
      icon: props.prefixIcon,
      hoverIcon: props.prefixHoverIcon,
      iconFor: props.prefixIconFor,
      emit,
    })
  );
  //-----------------------------------------------------
  const _suffix = computed(() =>
    useLabelIcon({
      _api: _api,
      icon: props.suffixIcon,
      hoverIcon: props.suffixHoverIcon,
      iconFor: props.suffixIconFor,
      emit,
    })
  );
  //-----------------------------------------------------
  const LabelText = computed(() => {
    return _state.text || usePlaceholder(props);
  });
  //-----------------------------------------------------
  // 看看是否满足选项列表的打开条件
  watch(
    () => [props.value],
    async () => {
      await _api.updateDisplay();
    },
    { immediate: true }
  );
</script>

<template>
  <div
    class="ti-label"
    :class="_aspect.TopClass.value"
    :style="_aspect.TopStyle.value"
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
      class="value-part"
      :style="_aspect.ValuePartStyle.value">
      <a
        v-if="_api.Href.value"
        :href="_api.Href.value"
        target="_blank"
        >{{ LabelText }}</a
      >
      <span v-else>
        {{ LabelText }}
      </span>
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
<style lang="scss">
  @use './ti-label.scss';
</style>
