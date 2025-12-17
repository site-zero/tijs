<script lang="ts" setup>
  import { CssUtils, TiTags, TiTextSnippet } from "@site0/tijs";
  import { computed } from "vue";
  import GFItField from "../../shelf/grid-fields/GFItField.vue";
  import { FilterBarEmitter, FilterBarProps } from "./ti-filter-bar-types";
  import { useTiFilterBarApi } from "./use-ti-filter-bar-api";
  //-----------------------------------------------------
  const emit = defineEmits<FilterBarEmitter>();
  const props = withDefaults(defineProps<FilterBarProps>(), {});
  const api = useTiFilterBarApi(props, emit);
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-filter-bar" :style="TopStyle">
    <!-------头槽--------->
    <slot name="head">
      <TiTextSnippet
        v-if="props.head"
        className="part-head"
        v-bind="props.head" />
    </slot>
    <!-------常驻字段------>
    <div v-if="api.hasMajorFields.value" class="part-major">
      <template v-for="fld in api.MajorFields.value">
        <GFItField v-bind="fld" />
      </template>
    </div>
    <!-------主体--------->
    <TiTags
      class="part-body"
      :editable="true"
      :actions="api.ActionBarConfig.value"
      :nowrap="true"
      v-bind="props.tags"
      :placeholder="props.placeholder"
      :value="props.value"
      @change="api.onTagsChange"
      @click="api.openFilterEditor()"
      @fire="api.onActionFire" />
    <!-- <div class="part-menu">
      <TiActionBar v-bind="api.ActionBarConfig.value" />
    </div> -->
    <!-------尾槽--------->
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
