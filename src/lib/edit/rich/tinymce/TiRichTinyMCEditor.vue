<script lang="ts" setup>
  import { nextTick, onMounted, useTemplateRef } from "vue";
  import {
    TinyMCEditorEmitter,
    TinyMCEditorProps,
  } from "./ti-tiny-mc-editor-types";
  import { useTinyMcEditorApi } from "./use-tiny-mc-editor-api";

  const emit = defineEmits<TinyMCEditorEmitter>();
  const props = withDefaults(defineProps<TinyMCEditorProps>(), {});

  const $main = useTemplateRef("main");
  const api = useTinyMcEditorApi(props, () => $main.value, emit);

  onMounted(() => {
    nextTick(() => {
      api.init();
    });
  });
</script>
<template>
  <div class="ti-tiny-mce-editor fit-parent">
    <div v-if="api.ErrorInfo.value">{{ api.ErrorInfo.value }}</div>
    <div ref="main" class="fit-parent"></div>
  </div>
</template>
<style lang="scss">
  @use "./ti-tiny-mc-editor.scss";
</style>
