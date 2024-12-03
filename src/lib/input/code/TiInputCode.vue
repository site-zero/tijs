<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { InputBox2Props, TiInput2, useValueInput, useViewport } from '../../';
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
  const _desc = ref('');
  //-----------------------------------------------------
  const _vals = computed(() => useValueInput(props));
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    let re: InputBox2Props = _.omit(
      props,
      'style',
      'className',
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
  const TipListConfig = computed(() => {
    let cw = props.codeWidth;
    // let re: TipListProps = {
    //   textAsHtml: true,
    //   textFormat: `<code style="min-width:${cw};">\${value}:</code><em>\${text}</em>`,
    // };
    let re = {};
    _.assign(re, props.tipList);
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
  function onBoxItemChange(it?: AnyOptionItem) {
    if (_.isNil(it)) {
      _desc.value = '';
    } else {
      _desc.value = GetDescription.value(it);
    }
  }
  //-----------------------------------------------------
  async function onChange(val: string) {
    emit('change', val);
  }
  //-----------------------------------------------------
</script>
<template>
  <div
    ref="$el"
    class="ti-input-code"
    :class="TopClass"
    :style="TopStyle">
    <!--代码-->
    <div
      class="part-code"
      :style="PartCodeStyle">
      <TiInput
        v-bind="InputConfig"
        :tip-list="TipListConfig"
        @change="onChange"
        @box-item-change="onBoxItemChange" />
    </div>
    <!--描述-->
    <div
      v-if="!props.hideDescription"
      class="part-desc"
      :class="PartDescClass">
      <input
        :value="_desc"
        readonly
        spellcheck="false" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-input-code.scss';
</style>
