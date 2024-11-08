<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import { ActionBarEvent, TiActionBar } from '../../';
  import { CssUtils } from '../../../core';
  import { TextSnippet, TiImage, TiProgressBar } from '../../../lib';
  import { useDropping } from '../image/use-dropping';
  import { UploadBarProps } from './ti-upload-bar-types';
  import { useUploadBar } from './use-upload-bar';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'upload', payload: File): void;
    (event: 'clear'): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<UploadBarProps>(), {
    textSize: 's',
    textPadding: 's',
    textAlign: 'center',
    boxRadius: 's',
    uploadButton: true,
    clearButton: true,
    // tip: '点击或拖拽文件到此处上传',
    // type: 'danger',
  });
  //-----------------------------------------------------
  const Bar = useUploadBar(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'drag-enter': _drag_enter.value,
      [`is-${props.type}`]: !!props.type,
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
  let $file = useTemplateRef('file');
  function onActionFire(event: ActionBarEvent) {
    console.log(event);
    let fn = {
      'choose-file': () => {
        if ($file.value) {
          $file.value.click();
        }
      },
      'clear': () => {
        emit('clear');
      },
    }[event.name];
    if (fn) {
      fn();
    }
  }
  //-----------------------------------------------------
  function onSelectLocalFilesToUpload(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
      let f = _.first(files);
      if (f) {
        emit('upload', f);
      }
    }
  }
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
    <!--
    Hidden input file to choose files
  -->
    <input
      type="file"
      ref="file"
      style="display: none"
      @change="onSelectLocalFilesToUpload" />
    <div
      class="bar-con"
      :class="ConClass"
      :style="ConStyle"
      ref="bar">
      <!--============= Preview =============-->
      <div
        class="part-icon"
        :title="props.tip">
        <TiImage v-bind="Bar.Preview.value" />
      </div>
      <!--============= Text =============-->
      <TextSnippet
        class="part-text"
        v-bind="Bar.Text.value" />
      <!--============= Actions =============-->
      <TiActionBar
        v-if="Bar.ActionBar.value"
        item-size="t"
        bar-pad="s"
        v-bind="Bar.ActionBar.value"
        class="part-actions"
        @fire="onActionFire" />
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
