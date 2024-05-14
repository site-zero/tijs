<script lang="ts" setup>
  import { computed } from 'vue';
  import { BooleanEmitter, useBooleanInput } from '../../';
  import { CssUtils } from '../../../core';
  import { ToggleProps } from './ti-toggle-types';

  const props = withDefaults(defineProps<ToggleProps>(), {
    value: false,
    values: () => [false, true] as [any, any],
  });
  const emit = defineEmits<BooleanEmitter>();
  const Bool = computed(() => useBooleanInput(props, { emit }));

  const TopClass = computed(() => {
    let yes = Bool.value.getTrueValue();
    return CssUtils.mergeClassName({
      'is-on': yes,
      'is-off': !yes,
    });
  });
</script>
<template>
  <div
    class="ti-toggle"
    :class="TopClass">
    <aside @click.left="Bool.emitToggle"><b></b></aside>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-toggle.scss';
</style>
