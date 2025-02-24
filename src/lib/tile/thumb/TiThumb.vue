<script lang="ts" setup>
  import { computed } from 'vue';
  import { TiTextSnippet } from '../../';
  import { CssUtils } from '../../../core';
  import { TiImage, TiProgressBar } from '../all-tiles';
  import { ThumbProps } from './ti-thumb-types';
  import { useThumb } from './use-thumb';
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ThumbProps>(), {
    textAlign: 'center',
    textSize: 'm',
    textPadding: 's',
    moreAlign: 'center',
    moreSize: 's',
    morePadding: 's',
    flexGrow: 'text',
  });
  //-----------------------------------------------------
  const Thumb = useThumb(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      props.flexGrow ? `flex-grow-${props.flexGrow}` : ''
    )
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.mergeStyles([
      CssUtils.toStyle({ width: props.width, height: props.height }),
      props.style,
    ]);
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-thumb"
    :class="TopClass"
    :style="TopStyle"
    :text-size="props.textSize"
    :text-align="props.textAlign"
    :text-padding="props.textPadding"
    :more-size="props.moreSize"
    :more-align="props.moreAlign"
    :more-padding="props.morePadding">
    <!--============= Preview =============-->
    <TiImage
      class="part-preview"
      v-bind="props.preview" />
    <TiTextSnippet
      v-if="Thumb.Text.value"
      class="part-text"
      v-bind="Thumb.Text.value" />
    <TiTextSnippet
      v-if="Thumb.More.value"
      class="part-more"
      v-bind="Thumb.More.value" />
    <!--============= Indicators ============-->
    <template v-for="indicators in Thumb.Indicators.value">
      <div
        class="thumb-indicators"
        :at="indicators.position">
        <TiTextSnippet
          v-for="ind of indicators.items"
          class="thumb-indicator-item"
          v-bind="ind" />
      </div>
    </template>
    <!--============= Processor =============-->
    <div
      class="part-progress"
      v-if="props.progress">
      <TiProgressBar v-bind="props.progress" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-thumb.scss';
</style>
