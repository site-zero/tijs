<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { TextSnippet } from '../../';
  import { CssUtils } from '../../../core';
  import GFItField from './GFItField.vue';
  import GFItGroup from './GFItGroup.vue';
  import GFItLabel from './GFItLabel.vue';
  import { buildGridFieldsLayoutStyle } from './build-grid-field-layout';
  import {
    GridFieldsEmitter,
    GridFieldsProps,
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';
  import { useGridFields } from './use-grid-fields';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<GridFieldsProps>(), {
    fields: () => [],
    bodyPartGap: 'm',
    bodyPartFontSize: 's',
    fieldLayoutMode: 'h-wrap',
    maxFieldNameWidth: '36%',
    data: () => ({}),
  });
  const _viewport_width = ref(0);
  //-------------------------------------------------
  const Grid = computed(() => useGridFields(props));
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  //-------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      `body-gap-${props.bodyPartGap}`,
      `fsz-${props.bodyPartFontSize}`
    )
  );
  //-------------------------------------------------
  const BodyStyle = computed(() => {
    let css = getLayoutCss.value(_viewport_width.value);
    return _.assign({}, props.bodyPartStyle, css);
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
    class="ti-grid-fields"
    :class="TopClass"
    :style="props.style">
    <!--===============: 表单头 :===================-->
    <slot name="head">
      <TextSnippet
        v-if="props.title"
        className="part-title"
        :style="props.titleStyle"
        :text="props.title || ''"
        :textType="props.titleType"
        :comType="props.comType"
        :comConf="props.comConf"
        :autoValue="props.autoValue"
        :readonlyComType="props.readonlyComType"
        :readonlyComConf="props.readonlyComConf"
        :activatedComType="props.activatedComType"
        :activatedComConf="props.activatedComConf" />
    </slot>
    <!--===============: 表单体 :===================-->
    <div
      ref="$main"
      class="part-body"
      :style="BodyStyle">
      <template v-for="fld in Grid.strictItems">
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
      </template>
    </div>
    <!--===============: 表单尾 :===================-->
    <slot name="foot">
      <TextSnippet
        v-if="props.tip"
        className="part-foot"
        :style="props.tipStyle"
        :text="props.tip || ''"
        :textType="props.tipType"
        :comType="props.fieldTipBy?.comType"
        :comConf="props.fieldTipBy?.comConf"
        :autoValue="props.fieldTipBy?.autoValue"
        :readonlyComType="props.fieldTipBy?.readonlyComType"
        :readonlyComConf="props.fieldTipBy?.readonlyComConf"
        :activatedComType="props.fieldTipBy?.activatedComType"
        :activatedComConf="props.fieldTipBy?.activatedComConf"
        :changeEventName="props.fieldTipBy?.changeEventName" />
    </slot>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/ti-grid-fields.scss';
</style>
