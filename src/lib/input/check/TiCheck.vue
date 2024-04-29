<script lang="ts" setup>
  import { computed } from 'vue';
  import { IconInput, TiIcon } from '../../';
  import { I18n } from '../../../core';
  import { CheckProps } from './check.type';

  const props = withDefaults(defineProps<CheckProps>(), {
    value: false,
    icons: () =>
      ['zmdi-square-o', 'zmdi-check-square'] as [IconInput, IconInput],
    values: () => [false, true] as [any, any],
    isTrue: (val: any) => (val ? true : false),
  });

  const CheckIcon = computed(() => {
    let II = props.value ? 1 : 0;
    return props.icons[II];
  });

  const emit = defineEmits<{
    (eventName: 'change', payload: any): void;
  }>();
</script>
<template>
  <div class="ti-check">
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
    > .part-text {
      margin-left: 0.5em;
    }
  }
</style>
