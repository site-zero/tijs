<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
  import { ListProps, TiList, TiProgressBar, TiTextSnippet } from '../../';
  import { CssUtils, TiButton } from '../../../';
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
  const ListConifg = computed(() => {
    if (props.listData) {
      let re = _.cloneDeep(props.listConf ?? {});
      _.defaults(re, {
        className: 'cover-parent',
        canSelect: false,
        showChecker: false,
        canHover: false,
        multi: false,
        allowUserSelect: true,
        borderStyle: 'dashed',
      } as ListProps);
      return re;
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
  const $list = useTemplateRef<InstanceType<typeof TiList>>('list');
  watch(
    () => props.listCurrentRowIndex,
    (index) => {
      //console.log('listCurrentRowIndex', index, $list.value);
      if ($list.value && _.isNumber(index)) {
        $list.value.scrollIntoViewByIndex(index);
      }
    }
  );
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
      v-if="props.listData"
      class="part-list">
      <TiList
        ref="list"
        v-bind="ListConifg"
        :style="props.listPartStyle"
        :data="props.listData" />
    </div>
    <div
      v-if="props.logs"
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
