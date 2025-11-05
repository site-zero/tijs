<script lang="ts" setup>
  import { TiTags, TiTextSnippet } from "../../";
  import { FilterBarEmitter, FilterBarProps } from "./ti-filter-bar-types";
  import { useTiFilterBarApi } from "./use-ti-filter-bar-api";
  //-----------------------------------------------------
  const emit = defineEmits<FilterBarEmitter>();
  const props = withDefaults(defineProps<FilterBarProps>(), {});
  const api = useTiFilterBarApi(props, emit);
  //-----------------------------------------------------

  //-----------------------------------------------------
</script>
<template>
  <div class="ti-filter-bar">
    <slot name="head">
      <TiTextSnippet
        v-if="props.head"
        className="part-head"
        v-bind="props.head" />
    </slot>
    <TiTags
      class="part-body"
      :editable="true"
      :actions="api.ActionBarConfig.value"
      v-bind="props.tags"
      :placeholder="props.placeholder"
      :value="props.value"
      @change="api.onTagsChange"
      @click="api.openFilterEditor()"
      @fire="api.onActionFire" />
    <!-- <div class="part-menu">
      <TiActionBar v-bind="api.ActionBarConfig.value" />
    </div> -->
    <slot name="tail">
      <TiTextSnippet
        v-if="props.tail"
        className="part-tail"
        v-bind="props.tail" />
    </slot>
  </div>
</template>
<style lang="scss">
  @use "./ti-filter-bar.scss";
</style>
