<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { InputBoxProps, TiInput, useViewport } from '../../';
  import { AnyOptionItem, ToStr } from '../../../_type';
  import { CssUtils, Util } from '../../../core';
  import { InputCodeProps } from './ti-input-code-types';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: string): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputCodeProps>(), {
    tipShowTime: 'focus',
    tipUseHint: false,
    tipTidyBy: () => ['main'],
    canInput: true,
    trimed: true,
    mustInOptions: true,
    // 自动，如果可编辑，就是 true ，否则就是 false
    checkValueWhenClose: undefined,
    autoSelect: true,
    useRawValue: true,
    valueCase: 'upperAll',
    codeWidth: '3em',
    hideDescription: false,
  });
  //-------------------------------------------------
  const $el = ref<HTMLElement>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $el,
    onMounted,
    onUnmounted,
  });
  //-----------------------------------------------------
  const _item = ref<AnyOptionItem>();
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    let re: InputBoxProps = _.omit(
      props,
      'style',
      'className',
      'codeWidth',
      'gap',
      'getDescription',
      'hideDescription',
      'tipList',
      'tipListWidth'
    );
    re.tipListWidth = props.tipListWidth ?? `${_viewport.size.width}px`;
    if (!re.tipFormat) {
      re.tipFormat = 'VT';
    }
    return re;
  });
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, `gap-${props.gap ?? 't'}`)
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  //-----------------------------------------------------
  const PartCodeStyle = computed(() => {
    return { width: props.codeWidth };
  });
  //-----------------------------------------------------
  const PartDescClass = computed(() => {
    return {
      'show-border': !props.hideBorder,
      'hide-border': props.hideBorder,
    };
  });
  //-----------------------------------------------------
  const GetDescription = computed((): ToStr<AnyOptionItem> => {
    // 默认
    if (!props.getDescription) {
      // [val] [txt]
      if (props.useRawValue) {
        return (item: AnyOptionItem): string => {
          return item.text ?? item.tip ?? item.value;
        };
      }
      // [txt] [tip]
      return (item: AnyOptionItem): string => {
        return item.tip ?? item.text ?? item.value;
      };
    }
    // 指定了键
    if (_.isString(props.getDescription)) {
      return Util.genObjGetter(props.getDescription);
    }
    // 完全定制
    return props.getDescription;
  });
  //-----------------------------------------------------
  const InputValue = computed(() => _item.value?.value);
  //-----------------------------------------------------
  const InputText = computed(() => {
    if (!_item.value) {
      return '';
    }
    GetDescription.value(_item.value);
  });
  //-----------------------------------------------------
  function onBoxItemChange(it: AnyOptionItem | null) {
    _item.value = it ?? undefined;
    emit('change', it?.value || null);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    v-bind="InputConfig"
    :emit-type="'std-item'"
    :value="InputValue"
    @change="onBoxItemChange" />
</template>
<style lang="scss" scoped>
  @use './ti-input-code.scss';
</style>
