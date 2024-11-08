<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import { TiActionBar } from '../../';
  import { CssUtils } from '../../../core';
  import { TextSnippet, TiImage, TiProgressBar } from '../../../lib';
  import { useDropping } from '../image/use-dropping';
  import { UploadBarProps } from './ti-upload-bar-types';
  import { useUploadBar } from './use-upload-bar';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'upload', payload: File): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<UploadBarProps>(), {
    textSize: 's',
    textPadding: 's',
    textAlign: 'center',
    boxRadius: 's',
  });
  //-----------------------------------------------------
  const Bar = useUploadBar(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'drag-enter': _drag_enter.value,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
  const ConClass = computed(() =>
    CssUtils.mergeClassName(
      `bar-pad-${props.textPadding}`,
      `text-size-${props.textSize}`,
      `text-align-${props.textAlign}`,
      `bar-radius-${props.boxRadius}`
    )
  );
  //-----------------------------------------------------
  const ConStyle = computed(() => {
    return CssUtils.mergeStyles([
      CssUtils.toStyle({ width: props.width, height: props.height }),
      props.style,
    ]);
  });
  //-----------------------------------------------------
  const _drag_enter = ref(false);
  const $bar = useTemplateRef('bar');
  const dropping = computed(() =>
    useDropping({
      target: () => $bar.value as unknown as HTMLElement,
      enter: () => {
        _drag_enter.value = true;
      },
      over: () => {
        _drag_enter.value = true;
      },
      leave: () => {
        _drag_enter.value = false;
      },
      drop: (files) => {
        //console.log(files);
        let f = _.first(files);
        if (f) {
          emit('upload', f);
        }
      },
    })
  );
  //-----------------------------------------------------
  onMounted(() => {
    dropping.value();
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-upload-bar"
    :class="TopClass"
    :style="TopStyle">
    <div
      class="bar-con"
      :class="ConClass"
      :style="ConStyle"
      ref="bar">
      <!--============= Preview =============-->
      <div class="part-icon">
        <TiImage v-bind="Bar.Preview.value" />
      </div>
      <!--============= Text =============-->
      <TextSnippet
        class="part-text"
        v-bind="Bar.Text.value" />
      <!--============= Actions =============-->
      <TiActionBar
        v-if="props.actions"
        item-size="t"
        bar-pad="s"
        v-bind="props.actions"
        class="part-actions" />
      <!--============= Processor =============-->
      <div
        class="part-progress"
        v-if="props.progress">
        <TiProgressBar v-bind="props.progress" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @use './ti-upload-bar.scss';
</style>
