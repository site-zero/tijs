<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import { ActionBarEvent, TiActionBar } from '../../';
  import { Vars } from '../../../_type';
  import { CssUtils } from '../../../core';
  import { TiImage, TiProgressBar, TiTextSnippet } from '../../../lib';
  import { useDropping } from '../../_features';
  import { UploadBarEmitter, UploadBarProps } from './ti-upload-bar-types';
  import { useUploadBar } from './use-upload-bar';
  //-----------------------------------------------------
  const emit = defineEmits<UploadBarEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<UploadBarProps>(), {
    textSize: 's',
    textPadding: 's',
    textAlign: 'center',
    boxRadius: 's',
    uploadButton: true,
    clearButton: false,
    // tip: '点击或拖拽文件到此处上传',
    // type: 'danger',
  });
  //-----------------------------------------------------
  const Bar = useUploadBar(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'drag-enter': _drag_enter.value,
      'nil-value': props.nilValue,
      [`is-${props.type}`]: !!props.type,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let colorTheme: Vars = {
      '--bar-c0': 'var(--ti-color-border-thin)',
      '--bar-bg': 'var(--ti-color-border-shallow)',
      '--bar-action': 'var(--ti-color-primary)',
      '--bar-action-r': 'var(--ti-color-primary-r)',
    };
    if (props.type) {
      colorTheme = {
        '--bar-c0': `var(--ti-color-${props.type})`,
        '--bar-c1': `var(--ti-color-${props.type})`,
        '--bar-bg': `var(--ti-color-${props.type}-r)`,
        '--bar-action': `var(--ti-color-${props.type})`,
        '--bar-action-r': `var(--ti-color-${props.type}-r)`,
      };
    }
    return CssUtils.mergeStyles([colorTheme, props.style]);
  });
  //-----------------------------------------------------
  const ConClass = computed(() =>
    CssUtils.mergeClassName(
      {
        'hover-prefix-for-clear': Bar.isPrefixForClean.value,
      },
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
      props.conStyle,
    ]);
  });
  //-----------------------------------------------------
  let $file = useTemplateRef<HTMLInputElement>('file');
  function onActionFire(event: ActionBarEvent) {
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
    } else {
      emit('fire', event.payload);
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
        <div
          v-if="Bar.isPrefixForClean.value && !props.nilValue"
          class="prefix-cleaner"
          @click.left="emit('clear')">
          <i class="zmdi zmdi-close"></i>
        </div>
      </div>
      <!--============= Text =============-->
      <TiTextSnippet
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
        <TiProgressBar
          v-bind="props.progress"
          :type="props.type" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @use './ti-upload-bar.scss';
</style>
