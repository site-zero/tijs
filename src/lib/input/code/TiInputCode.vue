<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import {
    InputBoxProps,
    TiInput,
    TipListProps,
    useValueInput,
    useViewport,
  } from '../../';
  import { CssUtils, Dicts, Util } from '../../../core';
  import { InputCodeProps } from './ti-input-code-types';
  import { ToStr } from '../../../_type';
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
    let re: InputBoxProps = _.omit(
      props,
      'style',
      'className',
      'tipList',
      'tipListWidth'
    );
    re.tipListWidth = props.tipListWidth ?? `${_viewport.size.width}px`;
    return re;
  });
  //-----------------------------------------------------
  const TipListConfig = computed(() => {
    let cw = props.codeWidth;
    let re: TipListProps = {
      textAsHtml: true,
      textFormat: `<code style="min-width:${cw};">\${value}:</code><em>\${text}</em>`,
    };
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
  const GetDescription = computed((): ToStr<Dicts.DictItem<any>> => {
    // 默认
    if (!props.getDescription) {
      // [val] [txt]
      if (props.useRawValue) {
        return (item: Dicts.DictItem<any>): string => {
          return item.text ?? item.tip ?? item.value;
        };
      }
      // [txt] [tip]
      return (item: Dicts.DictItem<any>): string => {
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
  async function __update_desc_text(val = props.value) {
    let item = await _vals.value.translateValue(val);
    if (item instanceof Dicts.DictItem) {
      _desc.value = GetDescription.value(item);
    }
    // 翻译失败
    else {
      _desc.value = item;
    }
  }
  //-----------------------------------------------------
  async function onChange(val: string) {
    __update_desc_text(val);
    emit('change', val);
  }
  //-----------------------------------------------------
  watch(
    () => [props.value, props.options, props.useRawValue],
    () => {
      __update_desc_text(props.value);
    },
    { immediate: true }
  );
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
        @change="onChange" />
    </div>
    <!--描述-->
    <div
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
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-code.scss';
</style>
