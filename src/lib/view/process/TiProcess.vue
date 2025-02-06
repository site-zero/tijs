<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
  import { TiTextSnippet } from '../../';
  import { CssUtils, TiButton } from '../../../';
  import { TiProgressBar } from '../../tile/progress-bar/ti-progress-bar-index';
  import { ProcessProps } from './ti-process-types';
  //-------------------------------------------------------
  defineOptions({ inheritAttrs: false });
  //-------------------------------------------------------
  const emit = defineEmits<{
    (event: 'abort', payload?: any): void;
  }>();
  //-------------------------------------------------------
  const $logs = useTemplateRef<HTMLElement>('logs');
  //-------------------------------------------------------
  const props = defineProps<ProcessProps>();
  //-------------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'fit-parent': 'fit' == props.fillMode,
      'cover-parent': 'cover' == props.fillMode,
    })
  );
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  const ProgressPartStyle = computed(() =>
    CssUtils.toStyle(props.progressPartStyle)
  );
  const LogPartStyle = computed(() => CssUtils.toStyle(props.logPartStyle));
  //-------------------------------------------------------
  const ProcessTitle = computed(() => {
    if (props.title) {
      if (_.isString(props.title)) {
        return { text: props.title };
      }
      return props.title;
    }
  });
  //-------------------------------------------------------
  const isProcessFinished = computed(() => {
    let val = props.progress?.value || 0;
    let [_, max = 1] = props.progress?.range || [];
    return val >= max;
  });
  //-----------------------------------------------------
  const AbortButton = computed(() => {
    if (props.abort) {
      if (_.isString(props.abort)) {
        return { text: props.abort };
      }
      return _.assign({ text: 'i18n:cancel' }, props.abort);
    }
  });
  //-----------------------------------------------------
  const observer = new MutationObserver(() => {
    if (!$logs.value) {
      return;
    }
    let el = $logs.value;
    el.scrollTop = el.scrollHeight;
    // console.log('line changed');
  });
  //-----------------------------------------------------
  function tryWatchLogsScrolling() {
    if ($logs.value) {
      observer.observe($logs.value, { childList: true, subtree: false });
    }
  }
  //-----------------------------------------------------
  function onClickAbortButton() {
    emit('abort');
  }
  //-----------------------------------------------------
  onMounted(() => {
    tryWatchLogsScrolling();
  });
  //-----------------------------------------------------
  onUnmounted(() => {
    observer.disconnect();
  });
  //-------------------------------------------------------
</script>
<template>
  <div
    class="ti-process"
    :class="TopClass"
    :style="TopStyle">
    <TiTextSnippet
      v-if="ProcessTitle"
      class="part-title"
      v-bind="ProcessTitle" />
    <div
      class="part-progress"
      :style="ProgressPartStyle">
      <TiProgressBar v-bind="props.progress" />
    </div>
    <div
      class="part-abort"
      v-if="AbortButton">
      <TiButton
        v-bind="AbortButton"
        @click="onClickAbortButton" />
    </div>
    <div
      class="part-logs"
      :style="LogPartStyle"
      ref="logs">
      <div
        class="log-line"
        v-for="line in props.logs">
        {{ line }}
      </div>
      <div
        class="log-line as-process"
        v-if="!isProcessFinished">
        <i class="zmdi zmdi-settings zmdi-hc-spin"></i>
        <span>...</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @use './ti-process.scss';
</style>
