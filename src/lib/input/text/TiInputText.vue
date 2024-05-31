<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { InputTextProps } from './ti-input-text-types';
  import { CssUtils, Str } from '../../../core';
  import JSON5 from 'json5';
  import _ from 'lodash';

  const emit = defineEmits<{
    (eventName: 'change', payload: any): void;
  }>();
  const _focused = ref(false);

  const props = defineProps<InputTextProps>();

  const hasValue = computed(() => !_.isNil(props.value));

  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      'has-value': hasValue.value,
      'nil-value': !hasValue.value,
      'is-focused': _focused.value,
      'no-focused': !_focused.value,
      'show-border': !props.hideBorder,
      'hide-border': props.hideBorder,
    });
  });

  const TopStyle = computed(() => {
    return CssUtils.mergeStyles([
      {},
      props.style,
      {
        width: CssUtils.toSize(props.width),
        height: CssUtils.toSize(props.height),
      },
    ]);
  });

  const TextValue = computed(() => {
    let input = props.value;

    if (_.isNil(input)) {
      return '';
    }

    if (_.isString(input)) {
      return input;
    }

    if (_.isArray(input)) {
      let ss = _.map(input, (it) => Str.anyToStr(it));
      return ss.join('\n');
    }

    if (_.isError(input)) {
      return [input.name, input.message].join(': ');
    }

    if (_.isObject(input)) {
      return JSON5.stringify(input, null, '    ');
    }

    return input + '';
  });

  function onTextChange(evt: Event) {
    let $t = evt.target as HTMLTextAreaElement;
    let v = $t.value;
    if (props.trimed) {
      v = _.trim(v);
    }
    if ('list' == props.valueType) {
      let ss = Str.splitIgnoreBlank(v, /\r?\n/g);
      emit('change', ss);
    }
    // 简单文本值
    else {
      emit('change', v);
    }
  }
</script>
<template>
  <textarea
    class="ti-input-text"
    :class="TopClass"
    :style="TopStyle"
    spellcheck="false"
    :readonly="props.readonly"
    @change="onTextChange"
    @focus="_focused = true"
    @blur="_focused = false"
    >{{ TextValue }}</textarea
  >
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-input-text.scss';

  textarea {
    padding: 0.5em;
    display: block;
    width: 100%;
    height: 3em;
    outline: none;
    resize: none;
    font-family: inherit;
    &.show-border {
      border-radius: var(--ti-measure-r-s);
      border: 1px solid var(--ti-color-border-dark);
      &.is-focused {
        border-color: var(--ti-color-primary);
      }
    }
    &[readonly] {
      border-color: var(--ti-color-border-dark);
      &.is-focused {
        border-color: var(--ti-color-border-dark);
      }
      background-color: var(--ti-color-disable-r);
      color: var(--ti-color-disable);
    }
  }
</style>
