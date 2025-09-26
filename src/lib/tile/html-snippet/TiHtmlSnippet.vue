<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import { CssUtils } from "../../../core";
  import { COM_TYPES } from "../../lib-com-types";
  import { HtmlSnippetEmitter, HtmlSnippetProps } from "./html-snippet-types";
  import { useHtmlSnippetEventDelegate } from "./use-html-snippet-events";
  import _ from "lodash";
  //-----------------------------------------------------
  const COM_TYPE = COM_TYPES.HtmlSnippet;
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
      html.push(`<style>`);
      if (_.isString(props.styleSheet)) {
        html.push(props.styleSheet);
      } else {
        html.push(CssUtils.renderCssStyleSheet(props.styleSheet));
      }
      html.push(`</style>`);
    }
    html.push(props.content ?? "<strong>HTML <em>snippet</em></strong>");
    return html.join("\n");
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
  @use "./msg-box.scss";
</style>
