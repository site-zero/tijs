<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { TextSnippet } from '../../';
  import GFItField from './GFItField.vue';
  import GFItLabel from './GFItLabel.vue';
  import { buildGridFieldsLayoutStyle } from './build-grid-field-layout';
  import {
    GridFieldsEmitter,
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';
  import { getGridItemStyle } from './use-field-style';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridFieldsEmitter>();
  const props = defineProps<GridFieldsStrictGroup>();
  const _viewport_width = ref(0);
  //-------------------------------------------------
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  const TopStyle = computed(() => {
    let css_1 = getGridItemStyle(props);
    let css_2 = getLayoutCss.value(_viewport_width.value);
    return _.assign({}, props.style, css_1, css_2);
  });
  //-------------------------------------------------
  const $main = ref<HTMLElement>();
  //-------------------------------------------------
  const obResize = new ResizeObserver((_entries) => {
    _viewport_width.value = $main.value?.clientWidth ?? 0;
    //console.log('obResize', _viewport_width.value);
  });
  //-------------------------------------------------
  onMounted(() => {
    if ($main.value) {
      obResize.observe($main.value);
    }
  });
  onUnmounted(() => {
    obResize.disconnect();
  });
</script>
<template>
  <div
    class="part-group"
    :class="props.className"
    :style="TopStyle">
    <!--===============: 组头 :===================-->
    <TextSnippet
      v-if="props.title"
      className="as-group-title"
      :text="props.title || ''"
      :textType="props.titleType"
      :comType="props.comType"
      :comConf="props.comConf"
      :autoValue="props.autoValue"
      :readonlyComType="props.readonlyComType"
      :readonlyComConf="props.readonlyComConf"
      :activatedComType="props.activatedComType"
      :activatedComConf="props.activatedComConf"
      :changeEventName="props.changeEventName" />
    <!--===============: 组体 :===================-->
    <div
      class="as-group-body"
      ref="$main">
      <div
        class="grid-group-cell"
        v-for="fld in props.fields">
        <!------[:Field:]---------->
        <GFItField
          v-if="'field' == fld.race"
          v-bind="(fld as GridFieldsStrictField)"
          @name-change="emit('name-change', $event)"
          @value-change="emit('value-change', $event)" />
        <!------[:Group:]---------->
        <GFItGroup
          v-else-if="'group' == fld.race"
          v-bind="(fld as GridFieldsStrictGroup)"
          @name-change="emit('name-change', $event)"
          @value-change="emit('value-change', $event)" />
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
