<script lang="ts" setup>
  import { onMounted, useTemplateRef } from "vue";
  import {
    TiEditRichProseProps,
    TiEditRichProseEmitter,
  } from "./ti-edit-rich-prose-types";
  import { useTiEditRichProseApi } from "./use-ti-edit-rich-prose-api";

  //-----------------------------------------------------
  const $main = useTemplateRef<HTMLElement>("main");
  const emit = defineEmits<TiEditRichProseEmitter>();
  const props = withDefaults(defineProps<TiEditRichProseProps>(), {});
  const _api = useTiEditRichProseApi(props, () => $main.value, emit);
  //-----------------------------------------------------

  //-----------------------------------------------------
  onMounted(() => {
    _api.initEditor();
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-edit-rich-prose fit-parent">
    <article ref="main" class="fit-parent"></article>
  </div>
</template>
<style lang="scss">
  @use "./ti-edit-rich-prose.scss";
</style>
