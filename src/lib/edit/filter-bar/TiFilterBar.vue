<script lang="ts" setup>
  import {
    CssUtils,
    FIELD_STATUS_KEY,
    FieldStatusInfo,
    TiTags,
    TiTextSnippet,
  } from "@site0/tijs";
  import { computed, provide } from "vue";
  import TiActionBar from "../../action/actionbar/TiActionBar.vue";
  import GFItField from "../../shelf/grid-fields/GFItField.vue";
  import { FilterBarEmitter, FilterBarProps } from "./ti-filter-bar-types";
  import { useTiFilterBarApi } from "./use-ti-filter-bar-api";
  //-----------------------------------------------------
  const emit = defineEmits<FilterBarEmitter>();
  const props = withDefaults(defineProps<FilterBarProps>(), {
    majorTitleAsPlaceholder: true,
    displayMode: "bar",
  });
  const api = useTiFilterBarApi(props, emit);
  //-----------------------------------------------------
  // GFItField 需要一个全局注入，用来获取字段状态，这里搞个假的，用来防错。
  // 说不定以后也用得到
  const _field_status = computed(() => new Map<string, FieldStatusInfo>());
  provide(FIELD_STATUS_KEY, _field_status);
  //-----------------------------------------------------
  const TagsConfig = computed(() => {
    return {
      className: "part-tags",
      editable: true,
      nowrap: true,
      ...props.tags,
      placeholder: props.placeholder,
      value: api.FilterTagValue.value,
      onChange: api.onTagsChange,
      onClick: api.openFilterEditor,
      onFire: api.onActionFire,
    };
  });
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName({}, props.className, {
      "major-only": props.majorOnly,
    });
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-filter-bar"
    :class="TopClass"
    :style="TopStyle"
    :display-mode="props.displayMode">
    <!--
    布局: menu-at-top
    -->
    <template v-if="'menu-at-top' == props.displayMode">
      <div class="flt-bar-row at-1">
        <!-------头槽--------->
        <slot name="head">
          <TiTextSnippet
            v-if="props.head"
            className="part-head"
            v-bind="props.head" />
        </slot>
        <div class="part-menu">
          <TiActionBar v-bind="api.ActionBarConfig.value" />
        </div>
        <!-------尾槽--------->
        <slot name="tail">
          <TiTextSnippet
            v-if="props.tail"
            className="part-tail"
            v-bind="props.tail" />
        </slot>
      </div>
      <div class="flt-bar-row at-2">
        <!-------常驻字段------>
        <div v-if="api.hasMajorFields.value" class="part-major">
          <template v-for="fld in api.MajorFields.value">
            <GFItField
              v-bind="fld"
              :data="props.value ?? {}"
              :titleAsPlaceholder="props.majorTitleAsPlaceholder"
              @value-change="api.onMajorFieldChange" />
          </template>
        </div>
        <!-------主体--------->
        <template v-if="!props.majorOnly">
          <TiTags v-bind="TagsConfig" />
        </template>
      </div>
    </template>
    <!--
    默认布局:bar
    -->
    <template v-else>
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
          <GFItField
            v-bind="fld"
            :data="props.value ?? {}"
            :titleAsPlaceholder="props.majorTitleAsPlaceholder"
            @value-change="api.onMajorFieldChange" />
        </template>
      </div>
      <!-------主体--------->
      <template v-if="!props.majorOnly">
        <TiTags v-bind="TagsConfig" />
      </template>
      <div class="part-menu">
        <TiActionBar v-bind="api.ActionBarConfig.value" />
      </div>
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
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-filter-bar.scss";
</style>
