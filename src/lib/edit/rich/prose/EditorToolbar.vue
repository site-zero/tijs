<script lang="ts" setup>
  import { computed, inject } from "vue";
  import { ActionBarEvent, TiActionBar } from "../../../";
  import {
    EditorToolbarProps,
    TI_RICH_EDITOR_API_KEY,
  } from "./ti-edit-rich-prose-types";
  import { buildEditorToolbarItem } from "./toolbar/use-editor-toolbar";
  //-----------------------------------------------------
  const api = inject(TI_RICH_EDITOR_API_KEY);
  //-----------------------------------------------------
  const props = withDefaults(defineProps<EditorToolbarProps>(), {
    toolbar: () => [
      "heading",
      ["B", "I", "U"],
      "link",
      "blockquote",
      "|",
      "table",
      "image",
      "|",
      "undo",
      "redo",
    ],
  });

  //-----------------------------------------------------
  const ToolbarItems = computed(() => buildEditorToolbarItem(props.toolbar));
  //-----------------------------------------------------
  function onFire(barEvent: ActionBarEvent) {
    let { name, payload } = barEvent;
    if ("run:command" == name) {
      api?.runCommand(payload);
    } else {
      console.log("unhandle toolbar event:", { name, payload });
    }
  }
  //-----------------------------------------------------
</script>
<template>
  <TiActionBar
    item-size="m"
    top-item-aspect-mode="button"
    :top-item-min-width="null"
    :items="ToolbarItems"
    @fire="onFire" />
</template>
