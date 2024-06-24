<script lang="ts" setup>
  import { computed } from 'vue';
  import { BooleanEmitter, TiIcon, useBooleanInput } from '../../';
  import { IconInput } from '../../../_type';
  import { I18n } from '../../../core';
  import { CheckProps } from './ti-check-types';

  const props = withDefaults(defineProps<CheckProps>(), {
    value: false,
    icons: () =>
      ['zmdi-square-o', 'zmdi-check-square'] as [IconInput, IconInput],
    text: 'i18n:yes',
    values: () => [false, true] as [any, any],
  });
  const emit = defineEmits<BooleanEmitter>();
  const Bool = computed(() => useBooleanInput(props, { emit }));

  const CheckIcon = computed(() => {
    let II = Bool.value.yes ? 1 : 0;
    return props.icons[II];
  });
</script>
<template>
  <div
    class="ti-check"
    @click.stop="Bool.emitToggle">
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
    user-select: none;
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
./ti-check-types
