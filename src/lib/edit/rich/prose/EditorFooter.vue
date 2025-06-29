<script lang="ts" setup>
  import "prosemirror-menu/style/menu.css"; // 菜单样式
  import { computed, inject } from "vue";
  import { TI_RICH_EDITOR_API_KEY } from "./ti-edit-rich-prose-types";
  //-----------------------------------------------------
  const api = inject(TI_RICH_EDITOR_API_KEY);
  //-----------------------------------------------------
  const CursorInfo = computed(() => {
    let { from, to } = api?.Selection.value.cursor ?? {};
    if (from === to) {
      return `${from}`;
    }
    return [from, to].join("-");
  });
  //-----------------------------------------------------
</script>
<template>
  <footer>
    <div class="as-cursor">
      <span>{{ CursorInfo }}</span>
      <span>{{ api?.Selection.value.anchorHeadingLevel }}</span>
      <span>{{ api?.Selection.value.anchorNodeName }}</span>
      <span>{{ api?.Selection.value.headHeadingLevel }}</span>
      <span>{{ api?.Selection.value.headNodeName }}</span>
      <span>{{ api?.Selection.value.marks }}</span>
    </div>
  </footer>
</template>
