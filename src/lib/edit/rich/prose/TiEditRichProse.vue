<script lang="ts" setup>
  import "prosemirror-menu/style/menu.css"; // 菜单样式
  import { onMounted, onUnmounted, provide, useTemplateRef } from "vue";
  import { useViewport } from "../../../_features";
  import EditorDocTree from "./EditorDocTree.vue";
  import EditorFooter from "./EditorFooter.vue";
  import EditorToolbar from "./EditorToolbar.vue";
  import {
    TI_RICH_EDITOR_API_KEY,
    TiEditRichProseEmitter,
    TiEditRichProseProps,
  } from "./ti-edit-rich-prose-types";
  import { useTiEditRichProseApi } from "./use-editor-api";
  //-----------------------------------------------------
  const $main = useTemplateRef<HTMLElement>("main");
  const emit = defineEmits<TiEditRichProseEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<TiEditRichProseProps>(), {});
  //-----------------------------------------------------
  const _api = useTiEditRichProseApi(props, () => $main.value, emit);
  //-------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const _viewport = useViewport({
    el: $el,
    onMounted,
    onUnmounted,
  });
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
  <div class="ti-edit-rich-prose fit-parent" ref="el">
    <header>
      <EditorToolbar :toolbar="props.toolbar" />
    </header>
    <nav>
      <EditorDocTree />
    </nav>
    <article ref="main" class="fit-parent"></article>
    <aside>Props</aside>
    <footer>
      <EditorFooter />
    </footer>
  </div>
</template>
<style lang="scss">
  @use "./ti-edit-rich-prose.scss";
  @import "prosemirror-view/style/prosemirror.css";
  @import "prosemirror-tables/style/tables.css";
</style>
