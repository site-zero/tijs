<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, ref } from 'vue';
  import GFItField from './GFItField.vue';
  import GFItGroup from './GFItGroup.vue';
  import GFItLabel from './GFItLabel.vue';
  import GFText from './GFText.vue';
  import { buildGridFieldsLayoutStyle } from './build-grid-field-layout';
  import {
    GridFieldsEmitter,
    GridFieldsProps,
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';
  import { useGridFields } from './use-grid-fields';

  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<GridFieldsProps>(), {
    fields: () => [],
  });
  const _viewport_width = ref(0);

  const Grid = computed(() => useGridFields(props));
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  const TopStyle = computed(() => {
    let css = getLayoutCss.value(_viewport_width.value);
    return _.assign({}, props.style, css);
  });
</script>
<template>
  <div
    class="ti-grid-fields"
    :class="Grid.className"
    :style="TopStyle">
    <!--===============: 表单头 :===================-->
    <slot name="head">
      <GFText
        v-if="props.title"
        class-name="part-title"
        :text="props.title || ''"
        :type="props.titleType"
        :com-type="props.comType"
        :com-conf="props.comConf"
        :auto-value="props.autoValue"
        :readonly-com-type="props.readonlyComType"
        :readonly-com-conf="props.readonlyComConf"
        :activated-com-type="props.activatedComType"
        :activated-com-conf="props.activatedComConf"
        :change-event-name="props.changeEventName" />
    </slot>
    <!--===============: 表单体 :===================-->
    <div class="part-body">
      <div
        class="grid-group-cell"
        v-for="fld in Grid.strictItems">
        <!------[:Field:]---------->
        <GFItField
          v-if="'field' == fld.race"
          v-bind="(fld as GridFieldsStrictField)" />
        <!------[:Group:]---------->
        <GFItGroup
          v-else-if="'group' == fld.race"
          v-bind="(fld as GridFieldsStrictGroup)" />
        <!------[:Label:]---------->
        <GFItLabel
          v-else-if="'label' == fld.race"
          v-bind="(fld as GridFieldsStrictLabel)" />
        <!------[!Invalid!]---------->
        <blockquote
          v-else
          style="white-space: pre; color: var(--ti-color-error)">
          Invalid Field: -------------------------------------------
          {{ fld }}
        </blockquote>
      </div>
    </div>
    <!--===============: 表单尾 :===================-->
    <slot name="tail"></slot>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './style/ti-grid-fields.scss';
</style>
