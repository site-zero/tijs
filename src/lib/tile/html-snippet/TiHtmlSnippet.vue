<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { CssUtils } from '../../../core';
  import { getLogger } from '../../../core/log/ti-log';
  import { COM_TYPES } from '../../lib-com-types';
  import { HtmlSnippetEmitter, HtmlSnippetProps } from './html-snippet-types';
  import { useHtmlSnippetEventDelegate } from './use-html-snippet-events';
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.HtmlSnippet;
  const log = getLogger(COM_TYPE);
  const $top = ref<HTMLElement>();
  //-----------------------------------------------------
  const emit = defineEmits<HtmlSnippetEmitter>();
  //-----------------------------------------------------
  const props = defineProps<HtmlSnippetProps>();
  //-----------------------------------------------------
  const _event = computed(() => useHtmlSnippetEventDelegate(props, $top, emit));
  const eventBinding = computed(() => _event.value.buildEventBinding());
  //-----------------------------------------------------
  const snippetInnerHtml = computed(() => {
    let html = [];
    if (props.styleSheet) {
      html.push(`<style>
      ${CssUtils.renderCssStyleSheet(props.styleSheet)}
      </style>`);
    }
    html.push(props.content ?? '<strong>HTML <em>snippet</em></strong>');
    return html.join('\n');
  });
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  //-----------------------------------------------------
  watch(
    () => [snippetInnerHtml.value, _event.value, $top.value],
    () => {
      if ($top.value) {
        _event.value.setupTriggers($top.value);
      }
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  onMounted(() => {
    if (!$top.value) {
      log.warn('$top is Nil');
      return;
    }
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    ref="$top"
    class="ti-html-snippet"
    :class="TopClass"
    :style="TopStyle"
    v-html="snippetInnerHtml"
    v-on="eventBinding"></div>
</template>
<style lang="scss">
  @use './msg-box.scss';
</style>
