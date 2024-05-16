<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, ref } from 'vue';
  import GFItField from './GFItField.vue';
  import GFItLabel from './GFItLabel.vue';
  import GFText from './GFText.vue';
  import { buildGridFieldsLayoutStyle } from './build-grid-field-layout';
  import {
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';

  defineOptions({
    inheritAttrs: false,
  });

  const _viewport_width = ref(0);

  const props = defineProps<GridFieldsStrictGroup>();
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  const TopStyle = computed(() => {
    let css = getLayoutCss.value(_viewport_width.value);
    return _.assign({}, props.style, css);
  });
</script>
<template>
  <div
    class="part-group"
    :class="props.className"
    :style="TopStyle">
    <!--===============: 组头 :===================-->
    <GFText
      v-if="props.title"
      class-name="as-group-title"
      :text="props.title || ''"
      :text-type="props.titleType"
      :com-type="props.comType"
      :com-conf="props.comConf"
      :auto-value="props.autoValue"
      :readonly-com-type="props.readonlyComType"
      :readonly-com-conf="props.readonlyComConf"
      :activated-com-type="props.activatedComType"
      :activated-com-conf="props.activatedComConf"
      :change-event-name="props.changeEventName" />
    <!--===============: 组体 :===================-->
    <div class="as-group-body">
      <div
        class="grid-group-cell"
        v-for="fld in props.fields">
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
      <!--.grid-group-cell-->
    </div>
  </div>
</template>
