<script lang="ts" setup>
  import { computed } from 'vue';
  import { IconInput, TiIcon } from '../../';
  import { FuncA0, I18n } from '../../../core';
  import { CheckProps } from './check.type';
  import _ from 'lodash';

  const props = withDefaults(defineProps<CheckProps>(), {
    value: false,
    icons: () =>
      ['zmdi-square-o', 'zmdi-check-square'] as [IconInput, IconInput],
    values: () => [false, true] as [any, any],
  });

  function getTrueValue() {
    return _.nth(props.values, 1) ?? true;
  }

  function isTrue(val: any) {
    if (_.isFunction(props.isTrue)) {
      return props.isTrue(val);
    }
    let trueValue: any = getTrueValue();
    return trueValue === val;
  }

  const CheckIcon = computed(() => {
    let II = isTrue(props.value) ? 1 : 0;
    return props.icons[II];
  });

  const emit = defineEmits<{
    (eventName: 'change', payload: any): void;
  }>();

  function onClick() {
    let I = isTrue(props.value) ? 0 : 1;
    let val = props.values[I];
    emit('change', val);
  }
</script>
<template>
  <div
    class="ti-check"
    @click.stop="onClick">
    <div class="part-icon"><TiIcon :value="CheckIcon" /></div>
    <div
      class="part-text"
      v-if="props.text">
      {{ I18n.text(props.text) }}
    </div>
  </div>
</template>
<style scoped lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  .ti-check {
    @include flex-align-nowrap;
    cursor: pointer;
    > .part-icon {
      font-size: 1.2em;
    }
    > .part-text {
      margin-left: 0.5em;
    }
    &:hover {
      color: var(--ti-color-link-hover);
    }
  }
</style>
