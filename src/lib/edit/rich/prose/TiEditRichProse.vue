<script lang="ts" setup>
  import { onMounted, provide, useTemplateRef } from "vue";
  import EditorDocTree from "./EditorDocTree.vue";
  import {
    TI_RICH_EDITOR_API_KEY,
    TiEditRichProseEmitter,
    TiEditRichProseProps,
  } from "./ti-edit-rich-prose-types";
  import { useTiEditRichProseApi } from "./use-ti-edit-rich-prose-api";
  //-----------------------------------------------------
  const $main = useTemplateRef<HTMLElement>("main");
  const emit = defineEmits<TiEditRichProseEmitter>();
  const props = withDefaults(defineProps<TiEditRichProseProps>(), {});
  const _api = useTiEditRichProseApi(props, () => $main.value, emit);
  //-----------------------------------------------------
  provide(TI_RICH_EDITOR_API_KEY, _api);
  //-----------------------------------------------------
  onMounted(() => {
    console.log("TiEditRichProse mounted");
    _api.initEditor();
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-edit-rich-prose fit-parent">
    <header>Toolbars</header>
    <nav>
      <EditorDocTree />
    </nav>
    <article ref="main" class="fit-parent"></article>
    <aside>Props</aside>
    <footer>
      <div class="as-cursor">
        <span>{{ _api.CursorInfo.value }}</span>
      </div>
    </footer>
  </div>
</template>
<style lang="scss">
  @use "./ti-edit-rich-prose.scss";
  @import "prosemirror-view/style/prosemirror.css";
</style>
