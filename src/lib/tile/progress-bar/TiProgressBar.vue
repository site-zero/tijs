<script setup lang="ts">
  import { computed } from 'vue';
  import { ProgressBarProps } from './ti-progress-bar-types';
  import { CssUtils } from 'index';
  import _ from 'lodash';
  import { Str } from '@site0/tijs';

  //-----------------------------------------------------
  const props = withDefaults(defineProps<ProgressBarProps>(), {
    value: 0,
    range: () => [0, 1],
    type: 'info',
    mode: 'H',
    tipAt: 'center',
  });
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      `type-is-${props.type ?? 'info'}`,
      `mode-is-${props.mode ?? 'H'}`,
      `tip-at-${props.tipAt}`
    )
  );
  //-----------------------------------------------------
  const BarTipSide = computed(() => {
    if (/^(center|(head|tail)-inner)$/.test(props.tipAt)) {
      return 'inside';
    }
    if ('none' == props.tipAt) {
      return 'none';
    }
    return 'outside';
  });
  //-----------------------------------------------------
  const BarValue = computed(() => {
    let v_tidied = _.clamp(props.value, ...props.range);
    let val = v_tidied - props.range[0];
    let max = props.range[1] - props.range[0];
    return val / max;
  });
  //-----------------------------------------------------
  const BarTipText = computed(() => {
    return Str.toPercent(BarValue.value);
  });
  //-----------------------------------------------------
  //-----------------------------------------------------
</script>

<template>
  <div
    class="ti-progress-bar"
    :class="TopClass"
    :style="props.style"
    :data-bar-tip="BarTipText">
    <div
      class="bar-track"
      :style="props.trackStyle">
      <div
        class="bar-indicator"
        :style="props.indicatorStyle"
        :data-bar-tip="BarTipText"></div>
    </div>
  </div>
</template>
