<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onMounted, ref, watch } from 'vue';
  import { CssUtils, Dom } from '../../../core';
  import { getLogger } from '../../../core/log/ti-log';
  import { COM_TYPES } from '../../lib-com-types';
  import {
    HtmlSnippetEmitter,
    HtmlSnippetListenner,
    HtmlSnippetProps,
  } from './html-snippet-types';
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
  const _event = useHtmlSnippetEventDelegate(props, $top, emit);
  const eventBinding = computed(() => _event.buildEventBinding());
  //-----------------------------------------------------
  const snippetInnerHtml = computed(() => {
    return props.content ?? '<strong>HTML <em>snippet</em></strong>';
  });
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
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
    v-html="snippetInnerHtml"
    v-on="eventBinding"></div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './msg-box.scss';
</style>
