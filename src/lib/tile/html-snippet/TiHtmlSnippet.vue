<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onMounted, ref } from 'vue';
  import { CssUtils, Dom } from '../../../core';
  import { getLogger } from '../../../core/log/ti-log';
  import { COM_TYPES } from '../../lib-com-types';
  import { HtmlSnippetListenner, HtmlSnippetProps } from './html-snippet-types';
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.HtmlSnippet;
  const log = getLogger(COM_TYPE);
  const $top = ref<HTMLElement>();
  //-----------------------------------------------------
  const emit = defineEmits<{
    (name: string, playload?: any): void;
  }>();
  //-----------------------------------------------------
  const props = defineProps<HtmlSnippetProps>();
  //-----------------------------------------------------
  const snippetInnerHtml = computed(() => {
    return props.content ?? '<strong>HTML <em>snippet</em></strong>';
  });
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-----------------------------------------------------
  function applyListenner(lis: HtmlSnippetListenner) {
    // Guard
    if (_.isEmpty(lis.selector)) {
      return;
    }

    let selector = _.concat(lis.selector).join(',');
    let els = Dom.findAll(selector, $top.value);
    if (els.length > 0) {
      for (let el of els) {
        // setup value
        if (lis.setup) {
          lis.setup(el as HTMLElement);
        }
        // listen event
        if (lis.handler) {
          el.addEventListener(lis.eventName, (evt: Event) => {
            if (lis.handler) {
              lis.handler(evt, emit);
            }
          });
        }
      }
    }
  }
  //-----------------------------------------------------
  onMounted(() => {
    if (!$top.value) {
      log.warn('$top is Nil');
      return;
    }
    if (props.listenners) {
      for (let lis of props.listenners) {
        applyListenner(lis);
      }
    }
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    ref="$top"
    class="ti-html-snippet"
    :class="TopClass"
    v-html="snippetInnerHtml"></div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './msg-box.scss';
</style>
