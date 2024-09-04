<script setup lang="ts">
  import { computed } from 'vue';
  import { ProgressBarProps } from './ti-progress-bar-types';
  import { CssUtils, Str } from '../../../core';
  import _ from 'lodash';

  //-----------------------------------------------------
  const props = withDefaults(defineProps<ProgressBarProps>(), {
    value: 0,
    range: () => [0, 1],
    mode: 'H',
    tipAt: 'center',
  });
  //-----------------------------------------------------

  /**
   * 根据给定的模式返回轴的键名。
   *
   * @returns {Object} 轴的键名，包含主方向轴和交叉轴。
   */
  const Axis = computed(() => {
    if ('V' == props.mode) {
      return { main: 'height', cross: 'width' };
    }
    return { main: 'width', cross: 'height' };
  });
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, `is-${props.type}`)
  );
  //-----------------------------------------------------
  const TrackClass = computed(() => CssUtils.mergeClassName(props.trackClass));
  const IndicatorClass = computed(() =>
    CssUtils.mergeClassName(props.indicatorClass)
  );
  //-----------------------------------------------------
  const TrackStyle = computed(() => {
    return CssUtils.mergeStyles([
      {
        [Axis.value.cross]: '10px',
        [Axis.value.main]: '100%',
      },
      props.trackStyle,
    ]);
  });
  //-----------------------------------------------------
  // const BarTipSide = computed(() => {
  //   if (/^(center|(head|tail)-inner)$/.test(props.tipAt)) {
  //     return 'inside';
  //   }
  //   if ('none' == props.tipAt) {
  //     return 'none';
  //   }
  //   return 'outside';
  // });
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
  const IndicatorStyle = computed(() => {
    return CssUtils.mergeStyles([
      props.indicatorStyle ?? {},
      {
        [Axis.value.main]: BarTipText.value,
        [Axis.value.cross]: '100%',
      },
    ]);
  });
  //-----------------------------------------------------
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-progress-bar"
    :class="TopClass"
    :style="props.style"
    :data-bar-tip="BarTipText"
    :tip-at="props.tipAt ?? 'center'"
    :bar-mode="props.mode ?? 'H'">
    <div
      class="bar-track"
      :class="TrackClass"
      :style="TrackStyle">
      <div
        class="bar-indicator"
        :class="IndicatorClass"
        :style="IndicatorStyle"
        :data-bar-tip="BarTipText"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './progress-bar.scss';
</style>
