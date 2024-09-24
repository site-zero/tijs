<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
  import { TextSnippet } from '../../';
  import { TiProgressBar } from '../../tile/progress-bar/ti-progress-bar-index';
  import { ProcessProps } from './ti-process-types';
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-------------------------------------------------------
  const $logs = useTemplateRef<HTMLElement>('logs');
  //-------------------------------------------------------
  const props = defineProps<ProcessProps>();
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
  <div class="ti-process cover-parent">
    <TextSnippet
      v-if="ProcessTitle"
      class="part-title"
      v-bind="ProcessTitle" />
    <div class="part-progress">
      <TiProgressBar v-bind="props.progress" />
    </div>
    <div
      class="part-logs"
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
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-process.scss';
</style>
