<script lang="ts" setup>
  import _ from "lodash";
  import "prosemirror-menu/style/menu.css"; // 菜单样式
  import { computed, inject } from "vue";
  import { DocTreeNode } from "./api/use-editor-doc-tree";
  import { TI_RICH_EDITOR_API_KEY } from "./ti-edit-rich-prose-types";
  //-----------------------------------------------------
  const api = inject(TI_RICH_EDITOR_API_KEY);
  //-----------------------------------------------------
  const CursorInfo = computed(() => {
    let { from, to, collapsed } = api!.Selection.value;
    if (_.isNil(from) || _.isNil(to)) {
      return "";
    }
    if (collapsed) {
      return `${from}`;
    }
    return `${to - from}:[${from}-${to}]`;
  });
  //-----------------------------------------------------
  function showNodeInfo(node?: DocTreeNode | null) {
    if (!node) {
      return;
    }
    let text =
      {
        paragraph: "P",
        hard_break: "BR",
        heading: "H",
        horizontal_rule: "HR",
        code_block: "PRE",
        image: "IMG",
        ordered_list: "OL",
        bullet_list: "UL",
        list_item: "LI",
        table: "TABLE",
        table_row: "TR",
        table_header: "TH",
        table_cell: "TD",
      }[node.name] ?? node.name;
    let str = [text] as any[];
    if (node.level > 0) {
      str.push(node.level);
    }
    return str.join("");
  }
  //-----------------------------------------------------
  const CurrentPath = computed(() => {
    let path = api?.Selection.value.path ?? [];
    return path;
  });
  //-----------------------------------------------------
  const hasMarks = computed(() => !_.isEmpty(api?.Selection.value.marks));
  //-----------------------------------------------------
</script>
<template>
  <div class="editor-footer">
    <dl class="as-node is-anchor">
      <dt><i class="fa-solid fa-file"></i></dt>
      <dd v-for="nd in CurrentPath">
        <span>{{ showNodeInfo(nd) }}</span>
        <i class="zmdi zmdi-caret-right path-sep"></i>
      </dd>
    </dl>
    <dl class="as-node is-anchor">
      <dt><i class="fa-solid fa-anchor"></i></dt>
      <dd>
        <span>{{ showNodeInfo(api?.Selection.value.anchor) }}</span>
      </dd>
    </dl>
    <dl class="as-node is-head" v-if="!api?.Selection.value.collapsed">
      <dt><i class="fa-solid fa-hand-pointer"></i></dt>
      <dd>
        <span>{{ showNodeInfo(api?.Selection.value.head) }}</span>
      </dd>
    </dl>
    <dl v-if="hasMarks" class="as-node is-head">
      <dt><i class="fa-solid fa-marker"></i></dt>
      <dd>
        <span>{{ api?.Selection.value.marks.join(",") }}</span>
      </dd>
    </dl>
    <div class="sep"></div>
    <dl class="as-cursor">
      <dt><i class="fa-solid fa-i-cursor"></i></dt>
      <dd>
        <span>{{ CursorInfo }}</span>
      </dd>
    </dl>
  </div>
</template>
<style lang="scss" scoped>
  @use "@site0/tijs/sass/_all.scss" as *;

  .editor-footer {
    @include flex-align-nowrap;
    @include font-fixed;
    border: 1px solid var(--ti-color-border-shallow);
    font-size: var(--ti-fontsz-s);
    background-color: var(--ti-color-body);
    color: var(--ti-color-bar-f);
    padding: 0.5em 0;
    line-height: 1em;
    user-select: none;
    > div.sep {
      flex: 1 1 auto;
    }
    dl {
      @include flex-align-nowrap;
      margin: 0;
      padding: 0 0.5em;
      flex: 0 0 auto;
    }
    dt {
      margin: 0;
      padding: 0;
    }
    dd {
      margin: 0;
      padding: 0;
      > .path-sep {
        opacity: 0.6;
        margin: 0 0.5em;
      }
      > span {
        margin: 0 0.2em;
      }
    }
  }
</style>
